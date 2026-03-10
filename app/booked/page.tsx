import VslPage from '@/components/VslPage';

export const metadata = {
  title: 'RevCore | Watch Before Our Call',
  description: "You're confirmed. Watch this quick video before our call so you know exactly what to expect.",
};

export default function BookedPage() {
  return (
    <VslPage
      eyebrow="Watch Before Your Call"
      headline="Get 5-10 Qualified Jobs Booked Into Your Calendar Every Month, Done For You"
      subheadline="Watch this quick video before our call (see proof)"
      mainVideoLoomId="0547417968dd4c1ba4d82fad14ac2181"
      ctaText="Ready to see how we can help you add 7 figures to your contracting business?"
      modalBadge="Elite Contractors Only"
      modalTitle="Scale Your"
      modalTitleAccent="Business Today."
      modalDescription="Lock in your exclusive territory before your competitor does. In just 15 minutes, we'll show you exactly how to add 7 figures to your contracting business."
      modalTestimonial='"I was skeptical, but we closed $180K in new jobs our first month. Best decision I ever made."'
      calendarSrc="https://api.leadconnectorhq.com/widget/booking/QElsvxr2NXutfz0fv7dm"
      calendarId="QElsvxr2NXutfz0fv7dm_1770921673569"
    />
  );
}
