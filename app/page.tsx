import Hero from '@/components/sections/Hero';
import Marquee from '@/components/sections/Marquee';
import About from '@/components/sections/About';
import Services from '@/components/sections/Services';
import Stats from '@/components/sections/Stats';
import Process from '@/components/sections/Process';
import SoftwareTease from '@/components/sections/SoftwareTease';
import Industries from '@/components/sections/Pricing';
import BlogPreview from '@/components/sections/BlogPreview';
import CTA from '@/components/sections/CTA';
import SectionDivider from '@/components/SectionDivider';

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <About />
      <SectionDivider />
      <Services />
      <Stats />
      <SectionDivider color="var(--color-green)" />
      <Process />
      <SectionDivider />
      <SoftwareTease />
      <Industries />
      <BlogPreview />
      <CTA />
    </>
  );
}
