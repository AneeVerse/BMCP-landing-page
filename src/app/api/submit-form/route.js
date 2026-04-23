import nodemailer from 'nodemailer';
import { sendToGoogleSheets } from '../../../lib/googleSheetsClient';

const ODOO_URL = process.env.ODOO_URL || 'https://dream-big-event-management-pvt.odoo.com';
const ODOO_DB = process.env.ODOO_DB || 'dream-big-event-management-pvt';
const ODOO_USERNAME = process.env.ODOO_USERNAME || 'info@bookmycorporateparty.com';
const ODOO_API_KEY = process.env.ODOO_API_KEY || '358e433cc6ce125fa09a04e47f5573401bdd73cd';

function xmlRpc(endpoint, method, params) {
  const toXml = (val) => {
    if (val === null || val === undefined) return '<value><boolean>0</boolean></value>';
    if (typeof val === 'boolean') return `<value><boolean>${val ? 1 : 0}</boolean></value>`;
    if (typeof val === 'number' && Number.isInteger(val)) return `<value><int>${val}</int></value>`;
    if (typeof val === 'string') return `<value><string>${val.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</string></value>`;
    if (Array.isArray(val)) return `<value><array><data>${val.map(toXml).join('')}</data></array></value>`;
    if (typeof val === 'object') {
      const members = Object.entries(val).map(([k, v]) => `<member><name>${k}</name>${toXml(v)}</member>`).join('');
      return `<value><struct>${members}</struct></value>`;
    }
    return `<value><string>${val}</string></value>`;
  };
  const body = `<?xml version="1.0"?><methodCall><methodName>${method}</methodName><params>${params.map(p => `<param>${toXml(p)}</param>`).join('')}</params></methodCall>`;
  return fetch(`${ODOO_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'text/xml', 'Accept': 'text/xml' },
    body,
  }).then(async r => {
    const text = await r.text();
    if (text.includes('<fault>')) {
      const faultStr = text.match(/<name>faultString<\/name>[\s\S]*?<string>([\s\S]*?)<\/string>/);
      throw new Error(`Odoo fault: ${faultStr ? faultStr[1] : text}`);
    }
    const intMatch = text.match(/<value><int>(\d+)<\/int><\/value>/);
    if (intMatch) return parseInt(intMatch[1], 10);
    const strMatch = text.match(/<string>([\s\S]*?)<\/string>/);
    if (strMatch) return strMatch[1];
    return null;
  });
}

async function pushToOdoo({ name, phone, event, city, date, whatsapp, userLocation }) {
  try {
    const uid = await xmlRpc('/xmlrpc/2/common', 'authenticate', [ODOO_DB, ODOO_USERNAME, ODOO_API_KEY, {}]);
    if (!uid) return;
    const leadName = `${event || 'Venue Enquiry'} — ${city || 'Mumbai'}`;
    const notes = [
      `Phone: ${phone}`,
      `Event: ${event || 'Not specified'}`,
      `City: ${city || 'Mumbai'}`,
      `Date: ${date || 'Not specified'}`,
      `WhatsApp: ${whatsapp ? 'Yes' : 'No'}`,
      `Location: ${userLocation || 'Unknown'}`,
      `Source: Website Form`,
    ].join('\n');
    await xmlRpc('/xmlrpc/2/object', 'execute_kw', [
      ODOO_DB, uid, ODOO_API_KEY,
      'crm.lead', 'create',
      [{ name: leadName, contact_name: name, phone, description: notes, city: city || 'Mumbai', type: 'opportunity' }],
      {},
    ]);
  } catch (err) {
    console.error('[Odoo] Error:', err);
  }
}

const getIndianTime = () => {
  const now = new Date();
  const istTime = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
  const day = String(istTime.getUTCDate()).padStart(2, '0');
  const month = String(istTime.getUTCMonth() + 1).padStart(2, '0');
  const year = istTime.getUTCFullYear();
  let hours = istTime.getUTCHours();
  const minutes = String(istTime.getUTCMinutes()).padStart(2, '0');
  const seconds = String(istTime.getUTCSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${day}/${month}/${year}, ${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${ampm} (IST)`;
};

export async function POST(req) {
  try {
    const {
      name,
      phone,
      event,
      city,
      area,
      location,
      date,
      whatsapp,
      userLocation,
      userPincode,
      userIp,
    } = await req.json();

    if (!name || !phone || !event) {
      return Response.json(
        { error: 'Name, phone, and venue type are required.' },
        { status: 400 }
      );
    }

    const venueLocation = area && city ? `${area}, ${city}` : (location || 'Not specified');

    const indianTime = getIndianTime();

    // 1. Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.NEXT_PUBLIC_EMAIL_USER,
        pass: process.env.NEXT_PUBLIC_EMAIL_APP_PASSWORD,
      },
    });

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
        <div style="background: #80281F; padding: 24px 32px;">
          <h2 style="color: #fff; margin: 0; font-size: 20px;">New Venue Enquiry — BookMyCorporateParty</h2>
          <p style="color: rgba(255,255,255,0.8); margin: 6px 0 0; font-size: 13px;">Received at ${indianTime}</p>
        </div>
        <div style="padding: 28px 32px; background: #fff;">
          <h3 style="color: #80281F; margin: 0 0 16px; font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 10px;">Contact Details</h3>
          <p style="margin: 0 0 8px;"><strong>Name:</strong> ${name}</p>
          <p style="margin: 0 0 8px;"><strong>Phone / WhatsApp:</strong> ${phone}</p>
          <p style="margin: 0 0 8px;"><strong>WhatsApp Updates:</strong> ${whatsapp ? 'Yes' : 'No'}</p>

          <h3 style="color: #80281F; margin: 24px 0 16px; font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 10px;">Event Details</h3>
          <p style="margin: 0 0 8px;"><strong>Event / Occasion:</strong> ${event}</p>
          <p style="margin: 0 0 8px;"><strong>City:</strong> ${city || 'Mumbai'}</p>
          <p style="margin: 0 0 8px;"><strong>Preferred Area:</strong> ${area || 'Not specified'}</p>
          <p style="margin: 0 0 8px;"><strong>Event Date:</strong> ${date || 'Not specified'}</p>

          <h3 style="color: #80281F; margin: 24px 0 16px; font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 10px;">User Location (Auto-Detected)</h3>
          <p style="margin: 0 0 8px;"><strong>Location:</strong> ${userLocation || 'Unknown'}</p>
          <p style="margin: 0 0 8px;"><strong>Pincode:</strong> ${userPincode || 'Unknown'}</p>
          <p style="margin: 0 0 8px;"><strong>IP Address:</strong> ${userIp || 'Unknown'}</p>
        </div>
        <div style="background: #f9f9f9; padding: 16px 32px; text-align: center; font-size: 12px; color: #999;">
          BookMyCorporateParty · Mumbai's #1 Corporate Party Platform
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"BookMyCorporateParty Enquiry" <${process.env.NEXT_PUBLIC_EMAIL_USER}>`,
      to: process.env.NEXT_PUBLIC_EMAIL_RECEIVER,
      subject: `New Venue Enquiry from ${name} — ${event}`,
      html: emailHtml,
      text: `New enquiry from ${name} (${phone}). Event: ${event}. Area: ${venueLocation}. Date: ${date || 'N/A'}. User Location: ${userLocation || 'Unknown'}. IP: ${userIp || 'Unknown'}. Submitted: ${indianTime}`,
    });

    // 2. Push to Odoo CRM (fire-and-forget)
    pushToOdoo({ name, phone, event, city, date, whatsapp, userLocation });

    // 3. Send to Google Sheets
    await sendToGoogleSheets(
      {
        name,
        phone,
        event,
        city: city || 'Mumbai',
        area: area || '',
        location: venueLocation,
        date: date || '',
        whatsapp: whatsapp ? 'Yes' : 'No',
        userLocation: userLocation || '',
        userPincode: userPincode || '',
        userIp: userIp || '',
        submittedAt: indianTime,
        pageSource: 'Hero Form',
        formType: 'Venue Enquiry Form',
      },
      'venue enquiry form'
    );

    return Response.json({ success: true, message: 'Enquiry submitted! We will contact you within 30 minutes.' });
  } catch (error) {
    console.error('submit-form error:', error);
    return Response.json(
      { success: false, message: 'Something went wrong. Please try again or call us directly.' },
      { status: 500 }
    );
  }
}
