import React from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "What is Bantu Stall?",
    answer: "Bantu Stall connects travelers, vendors, and professionals across Africa through experiential learning, cultural retreats, and business travel. We are a pan-African marketplace that promotes immersive experiences, trade, and mobility across the continent."
  },
  {
    question: "How can I attend a cultural travel experience through Bantu Stall?",
    answer: "Browse our Experiences page, filter by region or type of experience, and book directly—whether you're interested in leadership retreats or immersive learning circuits. You can customize your journey based on your interests and travel dates."
  },
  {
    question: "Does Bantu Stall offer training programs in local African languages?",
    answer: "Yes—we feature training (mafunzo) and experiences across Africa, tailored to regional languages and cultures to enrich your travel and learning journey. Our programs incorporate local terms like bantu, batho, vanhu, and vatu to ensure authentic cultural immersion."
  },
  {
    question: "How do I join a cultural retreat on Bantu Stall?",
    answer: "Visit our retreat planning section, select your preferred destination and dates, then connect with local providers. Our platform facilitates the entire booking process, from initial inquiry to final confirmation, ensuring a seamless experience."
  },
  {
    question: "What regions across Africa does Bantu Stall cover?",
    answer: "We operate across multiple African regions including South Africa, West Africa, East Africa, and Central Africa. Each region offers unique cultural experiences, business networking opportunities, and educational programs tailored to local traditions and languages."
  },
  {
    question: "Can businesses book corporate retreats through Bantu Stall?",
    answer: "Absolutely! We specialize in corporate retreats that combine team building with cultural immersion. Our business travel packages include leadership development, cultural learning circuits, and networking opportunities designed for professional growth."
  },
  {
    question: "How does Bantu Stall support local African vendors and businesses?",
    answer: "Our platform connects local vendors, service providers, and businesses with travelers and corporate clients. We promote trade opportunities, provide marketing support, and facilitate direct bookings to boost local economies across Africa."
  },
  {
    question: "What makes Bantu Stall different from other travel platforms?",
    answer: "We focus on authentic African experiences rooted in local culture, languages, and traditions. Our platform combines experiential learning, business networking, and cultural immersion, creating meaningful connections between travelers and local communities."
  }
];

const FAQ: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-background to-background/80">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqData.map(item => ({
              "@type": "Question",
              "name": item.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer
              }
            }))
          })}
        </script>
      </Helmet>
      
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to know about Bantu Stall's pan-African experiential learning platform
          </p>
        </div>
        
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqData.map((item, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border border-border/50 rounded-lg px-6 bg-card/50 backdrop-blur-sm"
            >
              <AccordionTrigger 
                className="text-left hover:text-primary transition-colors py-6"
                aria-label={`Toggle answer for: ${item.question}`}
              >
                <span className="font-semibold">{item.question}</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;