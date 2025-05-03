// /app/api/waitlist/route.ts

import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // service key only for server
);

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  // Save to Supabase
  const { error } = await supabase.from("waitlist").insert({ email });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Send email
  await resend.emails.send({
    from: "Flint <onboarding@resend.dev>",
    to: email,
    subject: "Thanks for joining Flint!",
    html: `
  <div style="background-color:#f9fafb; padding:40px 0; font-family:Arial, sans-serif; color:#111827;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.05);">
      <tr>
        <td style="padding:40px 40px 20px 40px; text-align:center;">
          <h1 style="margin:0; font-size:28px; color:#111827;">Hey there 👋 I'm Flint.</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:0 40px 20px 40px; text-align:center;">
          <p style="font-size:16px; line-height:1.6; margin:0;">
            Thanks for joining the <strong>Get Strong</strong> waitlist! I’m your AI nutrition companion, and my mission is simple: help you eat better—without the stress.
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding:0 40px 30px 40px; text-align:center;">
          <p style="font-size:16px; line-height:1.6; margin:0;">
            I’ll learn your preferences, keep track of what you eat, and give you real-time advice—even when you're ordering takeout.
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding:0 40px;">
          <div style="background:#f3f4f6; padding:20px; border-radius:8px; text-align:left; font-size:14px; line-height:1.6;">
            <p style="margin:0;">Here's what happens next:</p>
            <ul style="margin:10px 0 0 20px; padding:0;">
              <li>✅ You’re officially on the waitlist</li>
              <li>📬 I’ll let you know the moment we launch</li>
              <li>💡 In the meantime, stay strong 💪</li>
            </ul>
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding:30px 40px 0 40px; text-align:center;">
          <a href="https://getstrong.ai" target="_blank" style="display:inline-block; padding:12px 24px; background-color:#0f172b; color:#ffffff; text-decoration:none; border-radius:6px; font-weight:bold; font-size:16px;">
            Visit GetStrong.ai
          </a>
        </td>
      </tr>
      <tr>
        <td style="padding:40px 40px 20px 40px; text-align:center; font-size:12px; color:#6b7280;">
          <p style="margin:0;">
            You received this email because you signed up for the Get Strong waitlist.<br />
            If this wasn’t you, you can safely ignore it.
          </p>
        </td>
      </tr>
    </table>
  </div>
`,
  });

  return NextResponse.json({ success: true });
}
