import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { name, email, budget, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // TODO: replace with your email provider (Resend, SendGrid, etc.)
    // Example with Resend:
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'contact@yourdomain.com',
    //   to: 'info@floka.com',
    //   subject: `New inquiry from ${name}`,
    //   html: `<p><b>Name:</b> ${name}</p><p><b>Email:</b> ${email}</p><p><b>Budget:</b> ${budget}</p><p><b>Message:</b> ${message}</p>`,
    // });

    console.log('Contact form submission:', { name, email, budget, message });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
