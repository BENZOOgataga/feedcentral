import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Migration endpoint - pushes Prisma schema to database
 * Security: Requires SEED_SECRET_KEY
 * DELETE THIS AFTER RUNNING!
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const providedKey = searchParams.get('key');
    const expectedKey = process.env.SEED_SECRET_KEY;

    if (!expectedKey) {
      return NextResponse.json(
        { success: false, error: 'SEED_SECRET_KEY not configured' },
        { status: 500 }
      );
    }

    if (providedKey !== expectedKey) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('🔄 Running database migration...');
    
    // Run prisma db push
    const { stdout, stderr } = await execAsync('npx prisma db push --skip-generate');
    
    console.log('✅ Migration completed');
    console.log('stdout:', stdout);
    if (stderr) console.log('stderr:', stderr);

    return NextResponse.json({
      success: true,
      message: 'Database schema pushed successfully',
      output: stdout,
    });
  } catch (error) {
    console.error('❌ Migration error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to push database schema',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
