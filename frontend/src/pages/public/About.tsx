import { memo } from 'react';
import { Header, AboutContent, Footer } from '@/components/landing';

const About = memo(() => {
  return (
    <>
      <Header />
      <AboutContent />
      <Footer />
    </>
  );
});

About.displayName = 'About';

export default About;
