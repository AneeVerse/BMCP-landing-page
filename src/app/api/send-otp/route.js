import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { phone } = body || {};

    if (!phone) {
      return NextResponse.json(
        { success: false, message: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Clean phone number (keep digits only)
    let cleanPhone = String(phone).replace(/\D/g, '');

    // Standardize to 91XXXXXXXXXX format for India
    if (cleanPhone.length === 10) {
      cleanPhone = `91${cleanPhone}`;
    }

    if (cleanPhone.length < 12) {
      return NextResponse.json(
        { success: false, message: 'Invalid 10-digit mobile number' },
        { status: 400 }
      );
    }

    const authKey = process.env.MSG91_AUTH_KEY?.trim();
    const templateId = process.env.MSG91_TEMPLATE_ID?.trim();
    const senderId = process.env.MSG91_SENDER_ID?.trim();

    // Check if real MSG91 credentials exist
    if (authKey && templateId) {
      // MSG91 v5 Send OTP API
      const url = `https://control.msg91.com/api/v5/otp?template_id=${encodeURIComponent(templateId)}&mobile=${encodeURIComponent(cleanPhone)}${senderId ? `&sender=${encodeURIComponent(senderId)}` : ''}`;

      console.log(`[MSG91 Request] Sending OTP to ${cleanPhone} with templateId ${templateId}`);

      const msg91Res = await fetch(url, {
        method: 'POST',
        headers: {
          'authkey': authKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          template_id: templateId,
          mobile: cleanPhone,
          ...(senderId ? { sender: senderId } : {}),
        }),
      });

      const responseText = await msg91Res.text();
      let data = {};
      try {
        data = JSON.parse(responseText);
      } catch {
        data = { raw: responseText };
      }

      console.log('[MSG91 Send OTP Status]:', msg91Res.status);
      console.log('[MSG91 Send OTP Data]:', data);

      if (msg91Res.ok && (data.type === 'success' || data.type === 'Success')) {
        return NextResponse.json({
          success: true,
          message: data.message || 'OTP sent successfully via SMS',
        });
      } else {
        const errorMsg = data.message || data.type || (typeof data === 'string' ? data : 'Failed to send OTP via MSG91');
        return NextResponse.json(
          {
            success: false,
            message: errorMsg,
            details: data,
          },
          { status: 400 }
        );
      }
    } else {
      // Dev Mode fallback when credentials are not configured yet
      console.log(`[MSG91 OTP DEV MODE] Simulated OTP send to ${cleanPhone}`);
      return NextResponse.json({
        success: true,
        message: 'OTP sent (Dev Mode)',
        devMode: true,
      });
    }
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      { success: false, message: 'Server error while sending OTP' },
      { status: 500 }
    );
  }
}
