import { memo } from 'react';
import { Header, ContactForm, Footer } from '@/components/landing';

const Contact = memo(() => {
  return (
    <>
      <Header />
      <ContactForm />
      <Footer />
    </>
  );
});

Contact.displayName = 'Contact';

export default Contact;
