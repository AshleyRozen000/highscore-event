import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, firstName, lastName, email, address, city, zip, country, phone } = body;

    const { error } = await supabase
      .from('redemptions')
      .insert([
        {
          prize_code: code,
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          address,
          city,
          zip_code: zip,
          country
        }
      ]);

    if (error) {
      console.error('Supabase Insert Error:', error);
      throw error;
    }

    // Note: The 'prizes' table status is automatically updated by a database trigger
    // defined in schema.sql (function mark_prize_as_redeemed)

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Redeem API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
