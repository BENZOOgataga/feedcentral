import { NextResponse } from 'next/server';
import { metadata } from '@/lib/mcp-auth';
export function GET() { return NextResponse.json(metadata); }
