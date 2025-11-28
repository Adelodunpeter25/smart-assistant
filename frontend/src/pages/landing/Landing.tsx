import { memo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores';
import { Header, Hero, Features, FAQ, CTA, Footer } from '@/components/landing';

const Landing = memo(() => {
  const navigate = useNavigate();
  const { isAuthenticated, isInitialized } = useAuthStore();

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isInitialized, isAuthenticated, navigate]);

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
