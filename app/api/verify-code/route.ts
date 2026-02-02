import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  const { code } = await request.json();

  if (!code) {
    return NextResponse.json({ error: 'Code is required' }, { status: 400 });
  }

  try {
    const { data: prize, error } = await supabase
      .from('prizes')
      .select('*')
      .eq('code', code)
      .single();

    if (error || !prize) {
      return NextResponse.json({ error: 'Invalid code. Please check and try again.' }, { status: 404 });
    }

    if (prize.status === 'redeemed') {
      return NextResponse.json({ error: 'This code has already been redeemed.' }, { status: 400 });
    }

    return NextResponse.json({ success: true, prize });
  } catch (error) {
    console.error('Supabase error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
