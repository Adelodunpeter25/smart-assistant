import { memo } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  {
    question: 'What is Smart Assistant?',
    answer: 'Smart Assistant is an AI-powered personal assistant that helps you automate tasks, manage your schedule, set timers, send emails, and boost your productivity through natural language conversations.',
  },
  {
    question: 'How does the AI chat work?',
    answer: 'Our AI uses advanced language models to understand your requests in natural language. Simply type what you need, and the assistant will execute tasks, provide information, or help you manage your workflow.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes, we take security seriously. All data is encrypted in transit and at rest. We use industry-standard security practices and never share your personal information with third parties.',
  },
  {
    question: 'Can I use it on mobile devices?',
    answer: 'Absolutely! Smart Assistant is a Progressive Web App (PWA) that works seamlessly on desktop, mobile, and tablet devices. You can install it on your device for a native app experience.',
  },
  {
    question: 'What features are included?',
    answer: 'Smart Assistant includes AI chat, task management, calendar events, timers and alarms, email integration, web search, currency conversion, calculator, and real-time notifications.',
  },
  {
    question: 'Is there a free plan?',
    answer: 'Yes! You can create a free account and start using Smart Assistant immediately. All core features are available to help you boost your productivity.',
  },
];

export const FAQ = memo(() => {
  return (
    <section className="py-24 px-4 bg-background">
      <div className="max-w-3xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl font-bold">Frequently Asked Questions</h2>
          <p className="text-xl text-muted-foreground">Everything you need to know</p>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
});

FAQ.displayName = 'FAQ';
