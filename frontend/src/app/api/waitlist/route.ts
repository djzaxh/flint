// /app/api/waitlist/route.ts

import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const resend = new Resend(process.env.RESEND_API_KEY)

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // service key only for server
)

export async function POST(req: Request) {
    const { email } = await req.json()

    if (!email || !email.includes('@')) {
        return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    // Save to Supabase
    const { error } = await supabase.from('waitlist').insert({ email })
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Send email
    await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Thanks for joining Flint!',
        html: `<p>You're on the list! We'll let you know when Flint is live 🚀</p>`,
    })

    return NextResponse.json({ success: true })
}
