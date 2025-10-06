
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { culturalEtiquette, bonusTips } from '@/data/culturalEtiquette';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const CulturalEtiquetteGuide = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🌍 Cultural Etiquette & Protocols in African Regions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <Accordion type="single" collapsible className="space-y-4">
            {culturalEtiquette.map((region, index) => (
              <AccordionItem key={index} value={`region-${index}`} className="border rounded-lg px-4">
                <AccordionTrigger className="text-lg font-semibold">
                  📍 {region.region}
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-2">
                  {region.sections.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="space-y-2">
                      <h4 className="font-medium flex items-center gap-2">
                        {section.icon} {section.title}
                      </h4>
                      <ul className="space-y-2 pl-6">
                        {section.points.map((point, pointIndex) => (
                          <li key={pointIndex} className="text-gray-600">{point}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              ✨ Bonus Tips Across All Regions
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Do</h4>
                <ul className="space-y-2">
                  {bonusTips.do.map((tip, index) => (
                    <li key={index} className="text-green-600">✓ {tip}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Don't</h4>
                <ul className="space-y-2">
                  {bonusTips.dont.map((tip, index) => (
                    <li key={index} className="text-red-600">✗ {tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default CulturalEtiquetteGuide;
