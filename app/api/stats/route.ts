import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    // Проверяем наличие ключей
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('CRITICAL: Supabase keys are missing in .env.local');
      return NextResponse.json({ count: 0 });
    }

    const { count, error } = await supabaseAdmin
      .from('players')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Supabase query error:', error.message);
      return NextResponse.json({ count: 0, error: error.message });
    }

    return NextResponse.json({ count: count ?? 0 });
  } catch (err: any) {
    console.error('Internal API stats error:', err?.message || err);
    return NextResponse.json({ count: 0, error: 'Internal server error' });
  }
}
