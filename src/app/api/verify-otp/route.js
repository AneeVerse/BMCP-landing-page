import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { phone, otp } = body || {};

    if (!phone || !otp) {
      return NextResponse.json(
        { success: false, message: 'Phone number and OTP are required' },
        { status: 400 }
      );
    }

    // Clean phone number (keep digits only)
    let cleanPhone = String(phone).replace(/\D/g, '');
    if (cleanPhone.length === 10) {
      cleanPhone = `91${cleanPhone}`;
    }

    const authKey = process.env.MSG91_AUTH_KEY;

    if (authKey) {
      // MSG91 v5 Verify OTP API
      const url = `https://control.msg91.com/api/v5/otp/verify?otp=${encodeURIComponent(otp)}&mobile=${encodeURIComponent(cleanPhone)}`;

      const msg91Res = await fetch(url, {
        method: 'GET',
        headers: {
          'authkey': authKey,
        },
      });

      const data = await msg91Res.json();

      if (msg91Res.ok && (data.type === 'success' || data.type === 'Success')) {
        return NextResponse.json({
          success: true,
          message: data.message || 'OTP verified successfully',
        });
      } else {
        return NextResponse.json(
          {
            success: false,
            message: data.message || 'Invalid or expired OTP',
          },
          { status: 400 }
        );
      }
    } else {
      // Dev Mode verification (accepts 4+ digit OTP)
      if (String(otp).trim().length >= 4) {
        return NextResponse.json({
          success: true,
          message: 'OTP verified (Dev Mode)',
          devMode: true,
        });
      } else {
        return NextResponse.json(
          { success: false, message: 'Invalid OTP (Dev Mode requires min 4 digits)' },
          { status: 400 }
        );
      }
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      { success: false, message: 'Server error while verifying OTP' },
      { status: 500 }
    );
  }
}
