import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { fetchAllActiveSources, fetchSingleSource, validateRSSFeed } from '@/lib/rss-parser';
import { audit, enabled, origin, verifyMcp } from '@/lib/mcp-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const tools = [
  { name: 'list_categories', description: 'List categories and IDs for new RSS sources.', inputSchema: { type: 'object', properties: {}, additionalProperties: false } },
  { name: 'list_sources', description: 'List sources with active flags, feed URLs, and fetch timestamps.', inputSchema: { type: 'object', properties: { active: { type: 'boolean' } }, additionalProperties: false } },
  { name: 'list_feed_jobs', description: 'List recent fetch jobs with statuses, found/added counts and errors.', inputSchema: { type: 'object', properties: { sourceId: { type: 'string' }, limit: { type: 'integer', minimum: 1, maximum: 100 }, status: { enum: ['PENDING','RUNNING','COMPLETED','FAILED'] } }, additionalProperties: false } },
  { name: 'source_health', description: 'Analyze per-source recent fetch success, latest errors and article ingestion. No new articles is not automatically failure.', inputSchema: { type: 'object', properties: { sourceId: { type: 'string' }, limit: { type: 'integer', minimum: 1, maximum: 100 } }, additionalProperties: false } },
  { name: 'validate_feed', description: 'Validate public RSS URL without creating a source.', inputSchema: { type: 'object', required: ['feedUrl'], properties: { feedUrl: { type: 'string' } }, additionalProperties: false } },
  { name: 'add_source', description: 'Add a source after checking category and feed validity.', inputSchema: { type: 'object', required: ['name','url','feedUrl','categoryId'], properties: { name: { type: 'string' }, url: { type: 'string' }, feedUrl: { type: 'string' }, categoryId: { type: 'string' } }, additionalProperties: false } },
  { name: 'set_source_active', description: 'Activate or deactivate an existing RSS source.', inputSchema: { type: 'object', required: ['sourceId','active'], properties: { sourceId: { type: 'string' }, active: { type: 'boolean' } }, additionalProperties: false } },
  { name: 'fetch_source', description: 'Fetch a single active source now. Cooldown and job checks apply.', inputSchema: { type: 'object', required: ['sourceId'], properties: { sourceId: { type: 'string' } }, additionalProperties: false } },
  { name: 'fetch_all_sources', description: 'Fetch active sources with low concurrency. Global cooldown applies.', inputSchema: { type: 'object', properties: {}, additionalProperties: false } },
];

const reply = (id: unknown, result: unknown, status = 200) => NextResponse.json({ jsonrpc: '2.0', id, result }, { status, headers: { 'Cache-Control':'no-store' } });
const fail = (id: unknown, code: number, message: string) => NextResponse.json({ jsonrpc:'2.0', id, error:{ code, message } }, { headers: { 'Cache-Control':'no-store' } });
const jsonResult = (value: unknown) => ({ content: [{ type: 'text', text: JSON.stringify(value) }] });
const isUrl = (value: unknown) => { try { return typeof value === 'string' && value.length < 2048 && ['https:', 'http:'].includes(new URL(value).protocol); } catch { return false; } };

async function execute(name: string, args: Record<string, any>, userId: string) {
  const config = await enabled();
  const writes = ['add_source','set_source_active','fetch_source','fetch_all_sources'];
  if (writes.includes(name) && !config.allowWrites) throw Error('MCP write tools disabled in admin settings');
  switch (name) {
    case 'list_categories':
      return prisma.category.findMany({ select: { id:true, name:true, slug:true }, orderBy: { order:'asc' } });
    case 'list_sources':
      return prisma.source.findMany({ where: typeof args.active === 'boolean' ? { isActive: args.active } : {}, select: { id:true, name:true, url:true, feedUrl:true, isActive:true, lastFetchedAt:true, category: { select: { id:true, name:true } }, _count: { select: { articles:true } } }, orderBy: { name:'asc' }, take:500 });
    case 'list_feed_jobs': {
      const limit = Number.isInteger(args.limit) ? Math.min(100,Math.max(1,args.limit)) : 50;
      return prisma.feedJob.findMany({ where: { ...(typeof args.sourceId==='string' && { sourceId: args.sourceId }), ...(['PENDING','RUNNING','COMPLETED','FAILED'].includes(args.status) && { status: args.status }) },
        select: { id:true, status:true, startedAt:true, completedAt:true, articlesFound:true, articlesAdded:true, error:true, source: { select: { id:true, name:true, feedUrl:true } } }, orderBy:{ startedAt:'desc' }, take:limit });
    }
    case 'source_health': {
      const limit = Number.isInteger(args.limit) ? Math.min(100,Math.max(1,args.limit)) : 25;
      const source = typeof args.sourceId === 'string' ? await prisma.source.findUnique({ where:{ id:args.sourceId }, select:{ id:true,name:true,feedUrl:true,isActive:true,lastFetchedAt:true } }) : null;
      if (args.sourceId && !source) throw Error('Source not found');
      const jobs = await prisma.feedJob.findMany({ where: source ? { sourceId:source.id } : {}, orderBy:{ startedAt:'desc' }, take:limit,
        select: { sourceId:true, status:true, startedAt:true, completedAt:true, articlesFound:true, articlesAdded:true, error:true, source:{ select:{name:true} } } });
      const summary = Object.values(jobs.reduce<Record<string,{sourceId:string;name:string;total:number;completed:number;failed:number;found:number;added:number;latestStatus:string;latestError:string|null;lastRun:Date}>>((acc,j)=>{
        const x = acc[j.sourceId] ||= {sourceId:j.sourceId,name:j.source.name,total:0,completed:0,failed:0,found:0,added:0,latestStatus:j.status,latestError:j.error,lastRun:j.startedAt};
        x.total++; if(j.status==='COMPLETED')x.completed++; if(j.status==='FAILED')x.failed++;
        x.found+=j.articlesFound; x.added+=j.articlesAdded; return acc;
      },{}));
      return { source, inspectedJobs: jobs.length, summary, jobs };
    }
    case 'validate_feed': {
      if (!isUrl(args.feedUrl)) throw Error('Invalid HTTP(S) feed URL');
      return validateRSSFeed(args.feedUrl);
    }
    case 'add_source': {
      if (![args.name,args.url,args.feedUrl,args.categoryId].every(x=>typeof x==='string' && x.trim().length>0) ||
          args.name.length>180 || !isUrl(args.url) || !isUrl(args.feedUrl)) throw Error('Invalid source fields');
      const category = await prisma.category.findUnique({ where:{id:args.categoryId}, select:{id:true} });
      if (!category) throw Error('Unknown category');
      const validated = await validateRSSFeed(args.feedUrl);
      if (!validated.isValid) throw Error('Feed validation failed: '+ validated.error);
      const existing = await prisma.source.findUnique({where:{feedUrl:args.feedUrl},select:{id:true}});
      if (existing) return { alreadyExists:true,sourceId:existing.id };
      const created = await prisma.source.create({ data:{ name:args.name.trim(),url:args.url,feedUrl:args.feedUrl,categoryId:args.categoryId }, select:{id:true,name:true,feedUrl:true,isActive:true} });
      await audit(userId,name,created.id); return created;
    }
    case 'set_source_active': {
      if (typeof args.sourceId!=='string' || typeof args.active!=='boolean') throw Error('sourceId and active required');
      const updated = await prisma.source.update({where:{id:args.sourceId},data:{isActive:args.active},select:{id:true,name:true,isActive:true}});
      await audit(userId,name,updated.id); return updated;
    }
    case 'fetch_source': {
      if (typeof args.sourceId!=='string') throw Error('sourceId required');
      const source = await prisma.source.findUnique({ where:{id:args.sourceId},select:{id:true,isActive:true,lastFetchedAt:true} });
      if(!source || !source.isActive) throw Error('Active source not found');
      if(source.lastFetchedAt && Date.now()-source.lastFetchedAt.getTime()<60000) throw Error('Source fetched less than 60 seconds ago');
      const running=await prisma.feedJob.count({where:{sourceId:source.id,status:{in:['PENDING','RUNNING']},startedAt:{gte:new Date(Date.now()-15*60000)}}});
      if(running) throw Error('Source already has an active fetch');
      await audit(userId,name,source.id);
      return fetchSingleSource(source.id);
    }
    case 'fetch_all_sources': {
      const latest = await prisma.mcpAuditLog.findFirst({where:{tool:'fetch_all_sources',createdAt:{gte:new Date(Date.now()-10*60000)}},orderBy:{createdAt:'desc'}});
      if(latest) throw Error('Full fetch cooldown: 10 minutes');
      await audit(userId,name,'all');
      return fetchAllActiveSources({concurrency:2});
    }
    default: throw Error('Unknown MCP tool');
  }
}
export async function POST(request: NextRequest) {
  const setting=await enabled();
  if (!setting.enabled) return NextResponse.json({error:'MCP is disabled'}, {status:404});
  const userId=await verifyMcp(request);
  if(!userId) return NextResponse.json({error:'Unauthorized'}, {status:401,headers:{'WWW-Authenticate':'Bearer resource_metadata="https://feed.benzoogataga.com/.well-known/oauth-protected-resource/mcp"'}});
  if(!((request.headers.get('accept')||'').includes('application/json') && (request.headers.get('accept')||'').includes('text/event-stream'))) return NextResponse.json({error:'MCP Accept header required'}, {status:406});
  let body:any; try { body=await request.json(); } catch { return fail(null,-32700,'Parse error'); }
  if(!body || body.jsonrpc!=='2.0' || typeof body.method!=='string') return fail(body?.id ?? null,-32600,'Invalid request');
  if(body.id===undefined) return new NextResponse(null,{status:202});
  const id=body.id;
  if(body.method==='initialize') return reply(id,{protocolVersion:'2025-06-18',capabilities:{tools:{listChanged:false}},serverInfo:{name:'FeedCentral',version:'1.0.0'}});
  if(body.method==='ping') return reply(id,{});
  if(body.method==='tools/list') return reply(id,{tools:setting.allowWrites?tools:tools.filter(x=>!['add_source','set_source_active','fetch_source','fetch_all_sources'].includes(x.name))});
  if(body.method==='tools/call') {
    const name=body.params?.name, args=body.params?.arguments || {};
    if(typeof name!=='string' || !tools.some(x=>x.name===name) || !args || typeof args!=='object' || Array.isArray(args)) return fail(id,-32602,'Invalid tool arguments');
    try { return reply(id,jsonResult(await execute(name,args,userId))); }
    catch(error:any) { return reply(id,{...jsonResult({error:error?.message || 'Tool failed'}),isError:true}); }
  }
  return fail(id,-32601,'Method not found');
}
export async function GET() { return NextResponse.json({error:'Use MCP Streamable HTTP POST'}, {status:405}); }
export async function DELETE() { return new NextResponse(null,{status:204}); }
