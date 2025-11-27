import { memo } from 'react';
import { Header, Hero, Features, FAQ, CTA, Footer } from '@/components/landing';

const Landing = memo(() => {
  return (
    <>
      <Header />
      <Hero />
      <Features />
      <FAQ />
      <CTA />
      <Footer />
    </>
  );
});

Landing.displayName = 'Landing';

export default Landing;
