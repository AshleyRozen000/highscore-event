import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// MOCK DATA for testing in production
const MOCK_CODES: Record<string, any> = {
  'HS-DRN-TEST1': { code: 'HS-DRN-TEST1', prize_type: 'DJI Mini Drone', category: 'PHYSICAL', status: 'active' },
  'HS-V05-TEST2': { code: 'HS-V05-TEST2', prize_type: '5 USD Voucher', category: 'VOUCHER', status: 'active' },
  'HS-USED-CODE': { code: 'HS-USED-CODE', prize_type: '10 USD Voucher', category: 'VOUCHER', status: 'redeemed' },
};

export async function POST(request: NextRequest) {
  const { code } = await request.json();

  if (!code) {
    return NextResponse.json({ error: 'Code is required' }, { status: 400 });
  }

  // 1. Check for Mock Data first (Allow testing in production)
  const mockPrize = MOCK_CODES[code];
  if (mockPrize) {
    // Simulate API delay for realism
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    if (mockPrize.status === 'redeemed') {
      return NextResponse.json({ error: 'This code has already been redeemed (TEST).' }, { status: 400 });
    }
    return NextResponse.json({ success: true, prize: mockPrize, isMock: true });
  }

  // 2. If not mock data, query real Supabase database
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
