import { NextRequest, NextResponse } from 'next/server';
import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import { AuditPDF } from '@/components/reports/AuditPDF';
import { EmailPayload } from '@/types/analysis';

// Email configuration
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || 'merchzenith@gmail.com'; // Use verified account email
const SENDER_NAME = 'Zeniac Intelligence';

// Log status
if (BREVO_API_KEY) {
  console.log(`📧 Brevo API Key loaded: ${BREVO_API_KEY.substring(0, 8)}...`);
  console.log(`📧 Sending from: ${SENDER_EMAIL}`);
} else {
  console.warn('⚠️ No BREVO_API_KEY found in environment. Emails will fail.');
}

// Professional branded HTML email template
const getEmailHTML = (name: string, email: string, website: string, analysis: any): string => {
  const score = analysis?.score || 0;
  const scoreColor = score >= 80 ? '#16a34a' : score >= 60 ? '#D4AF37' : score >= 40 ? '#ea580c' : '#dc2626';
  const topIssues = (analysis?.weaknesses || analysis?.inferredPainPoints || []).slice(0, 3);
  const revenueImpact = analysis?.revenueImpact?.monthlyRevenueLeak || 0;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Zeniac Intelligence Report</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #0a0a0a;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #000000; border: 1px solid #D4AF37; border-radius: 8px; overflow: hidden;">
          <tr>
            <td style="background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); padding: 40px 30px; text-align: center; border-bottom: 2px solid #D4AF37;">
              <h1 style="margin: 0; color: #D4AF37; font-size: 28px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">
                ZENIAC INTELLIGENCE
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px 30px 20px; color: #ffffff;">
              <p style="margin: 0; font-size: 16px; line-height: 1.6;">
                Hello <strong style="color: #D4AF37;">${name}</strong>,
              </p>
              <p style="margin: 15px 0 0; font-size: 16px; line-height: 1.6; color: #cccccc;">
                Your comprehensive digital audit for <strong style="color: #ffffff;">${website}</strong> is complete.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 30px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%); border: 1px solid #333; border-radius: 8px; padding: 25px; text-align: center;">
                <tr>
                  <td>
                    <p style="margin: 0; color: #999; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; font-weight: 600;">Digital Health Score</p>
                    <h2 style="margin: 10px 0 0; color: ${scoreColor}; font-size: 56px; font-weight: 700; line-height: 1;">${score}<span style="font-size: 24px; color: #666;">/100</span></h2>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px 30px 40px; text-align: center;">
              <a href="mailto:merchzenith@gmail.com?subject=Audit Consultation Request&body=Hi, I'd like to discuss my audit results. (Website: ${website})" style="display: inline-block; background-color: #D4AF37; color: #000000; text-decoration: none; padding: 16px 40px; border-radius: 4px; font-weight: 700; font-size: 16px; letter-spacing: 0.5px; text-transform: uppercase;">
                Book Strategy Call
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
};

export async function POST(req: NextRequest) {
  try {
    const body: EmailPayload = await req.json();
    const { name, website, email, analysis } = body;

    // Validate
    if (!name || !website || !email || !analysis) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!BREVO_API_KEY) {
      console.error("❌ BREVO_API_KEY MISSING - Cannot send email.");
      return NextResponse.json({ error: 'Email configuration error' }, { status: 500 });
    }

    // Generate PDF
    console.log(`🔄 Generating PDF for ${website}...`);
    let pdfBuffer;
    try {
      pdfBuffer = await renderToBuffer(
        React.createElement(AuditPDF, {
          analysis,
          website,
          name,
          email,
          reportDate: new Date().toLocaleDateString()
        }) as any
      );
      console.log(`✅ PDF Buffer created: ${pdfBuffer.length} bytes`);
    } catch (pdfError) {
      console.error('❌ PDF Generation Error:', pdfError);
      return NextResponse.json({ error: 'Failed to generate PDF report' }, { status: 500 });
    }

    const pdfBase64 = pdfBuffer.toString('base64');

    // Send via Brevo API
    console.log(`📧 Sending Brevo email to ${email} (from: ${SENDER_EMAIL})...`);
    console.log(`📎 Attaching PDF: Zeniac_Intelligence_Report.pdf`);

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY
      },
      body: JSON.stringify({
        sender: { name: SENDER_NAME, email: SENDER_EMAIL },
        to: [{ email: email, name: name }],
        subject: `🚨 Intelligence Report: ${website} (Score: ${analysis?.score || 0}/100)`,
        htmlContent: getEmailHTML(name, email, website, analysis),
        attachment: [
          {
            content: pdfBase64,
            name: "Zeniac_Intelligence_Report.pdf"
          }
        ]
      })
    });

    let result;
    try {
      result = await response.json();
    } catch (e) {
      console.error('❌ Failed to parse Brevo JSON response:', e);
      return NextResponse.json({ error: 'Invalid response from email service' }, { status: 502 });
    }

    if (!response.ok) {
      console.error('❌ Brevo API Error Status:', response.status);
      console.error('❌ Brevo API Error details:', JSON.stringify(result, null, 2));
      return NextResponse.json({
        error: result.message || `Brevo Error (${response.status})`,
        details: result
      }, { status: response.status });
    }

    console.log('✅ Brevo Success. Message ID:', result.messageId);
    return NextResponse.json({
      success: true,
      id: result.messageId,
      message: 'Email sent successfully via Brevo'
    });

  } catch (error) {
    console.error("❌ Email Route Critical Error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal server error' }, { status: 500 });
  }
}

