import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
export async function GET(request: NextRequest) {
  return requireAdmin(request, async () => {
    const row = await prisma.mcpSettings.findUnique({ where: { id: 'default' } });
    return NextResponse.json({ success: true, data: { enabled: row?.enabled === true, allowWrites: row?.allowWrites === true } }, { headers: { 'Cache-Control': 'no-store' } });
  });
}
export async function PATCH(request: NextRequest) {
  return requireAdmin(request, async () => {
    const { enabled, allowWrites } = await request.json();
    if ((enabled !== undefined && typeof enabled !== 'boolean') || (allowWrites !== undefined && typeof allowWrites !== 'boolean'))
      return NextResponse.json({ success: false, error: 'Boolean settings required' }, { status: 400 });
    const row = await prisma.mcpSettings.upsert({
      where: { id: 'default' },
      create: { enabled: enabled === true, allowWrites: allowWrites === true },
      update: { ...(enabled !== undefined && { enabled }), ...(allowWrites !== undefined && { allowWrites }) },
    });
    return NextResponse.json({ success: true, data: { enabled: row.enabled, allowWrites: row.allowWrites } }, { headers: { 'Cache-Control': 'no-store' } });
  });
}
