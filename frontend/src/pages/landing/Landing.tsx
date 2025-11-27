import { memo } from 'react';
import { Hero, Features, CTA } from '@/components/landing';

const Landing = memo(() => {
  return (
    <>
      <Hero />
      <Features />
      <CTA />
    </>
  );
});

Landing.displayName = 'Landing';

export default Landing;
