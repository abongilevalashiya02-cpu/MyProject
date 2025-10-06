
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "What are Culture Tokens?",
    answer: "Culture Tokens are Bantu Stall's rewards currency that you earn when engaging with our platform. You can share stories, leave reviews, interact on social media, or book experiences to earn tokens that can be redeemed at partner businesses globally."
  },
  {
    question: "Where can I redeem them?",
    answer: "Culture Tokens can be redeemed at our partner network of African-owned and Africa-focused businesses worldwide, including restaurants, bookstores, fashion retailers, and more. View our interactive map to find partners near you."
  },
  {
    question: "Do they expire?",
    answer: "Culture Tokens are valid for 24 months from the date they are earned. We'll send you reminders before your tokens expire so you have plenty of time to redeem them."
  },
  {
    question: "How do I track my tokens?",
    answer: "You can track your Culture Tokens balance in your Bantu Stall account dashboard. The dashboard shows your current balance, transaction history, and upcoming expiration dates."
  },
  {
    question: "Can I transfer tokens to another user?",
    answer: "Yes, Culture Tokens can be gifted to other Bantu Stall users. You can transfer up to 50% of your token balance to friends and family each month."
  },
  {
    question: "How do I become a redemption partner?",
    answer: "If you own an African business or sell African products and services, you can apply to become a redemption partner through our business portal. Partners receive marketing support and connect with our global community."
  }
];

const TokensFAQ: React.FC = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="w-24 h-1 bg-bantu-orange mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about Culture Tokens
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-bold py-4">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default TokensFAQ;
