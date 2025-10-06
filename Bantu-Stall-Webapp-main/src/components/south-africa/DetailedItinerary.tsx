
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { MapPin, Clock, Camera, Users } from 'lucide-react';

const DetailedItinerary = () => {
  const days = [
    {
      id: "day1",
      title: "Day 1: Thursday, 13th November",
      subtitle: "Arrival in Cape Town & Embracing the Mother City's Aura",
      activities: [
        {
          time: "Morning/Afternoon",
          title: "Arrival & VIP Welcome",
          description: "Personalized VIP welcome service at Cape Town International Airport with seamless private transfer to luxury accommodation."
        },
        {
          time: "Late Afternoon", 
          title: "Rhode's Memorial & Panoramic City Views",
          description: "Stunning panoramic views of the city, Table Bay, and distant Hottentots Holland mountains, often bathed in warm sunset glow."
        },
        {
          time: "Evening",
          title: "Welcome Dinner & Expedition Briefing", 
          description: "Exclusive welcome dinner featuring exquisite local cuisine and fine South African wines with expedition overview."
        }
      ]
    },
    {
      id: "day2",
      title: "Day 2: Friday, 14th November",
      subtitle: "Cape Town's Icons: A Dual World Heritage Perspective",
      activities: [
        {
          time: "Morning",
          title: "Ascent of Table Mountain",
          description: "Cable car ascent to explore unique Fynbos vegetation. Over 9,000 vascular plant species with 69% endemic to the Cape Floral Region."
        },
        {
          time: "Afternoon",
          title: "Robben Island - A Testament to Resilience",
          description: "Ferry to Robben Island with tours often led by former political prisoners. Visit Nelson Mandela's former cell."
        },
        {
          time: "Late Afternoon/Evening",
          title: "V&A Waterfront & Boo Kaap Exploration",
          description: "Explore vibrant V&A Waterfront and historic, colorful Boo Kaap with its unique Cape Malay cultural heritage."
        }
      ]
    },
    {
      id: "day3", 
      title: "Day 3: Saturday, 15th November",
      subtitle: "Journey to the Ancient Cederberg: San Echoes in Stone",
      activities: [
        {
          time: "Morning",
          title: "Scenic Drive to Cederberg Wilderness Area",
          description: "2-3 hour scenic drive through picturesque landscapes with commentary on changing geology and unique Western Cape flora."
        },
        {
          time: "Afternoon",
          title: "Unveiling San Rock Art",
          description: "Exploration of key San rock art sites including Stadsaal Caves or Sevilla Rock Art Trail with paintings dating back thousands of years."
        },
        {
          time: "Evening",
          title: "Stargazing and Wilderness Serenity",
          description: "Dinner at lodge followed by stargazing in exceptionally clear night skies, connecting with ancient San astronomical understanding."
        }
      ]
    },
    {
      id: "day4",
      title: "Day 4: Sunday, 16th November", 
      subtitle: "From Ancient Rocks to Majestic Peaks: Journey to the Drakensberg",
      activities: [
        {
          time: "Morning",
          title: "Cederberg Reflections & Transfer Preparations",
          description: "Final opportunity to absorb Cederberg's unique atmosphere with possible short guided walk to additional rock art sites."
        },
        {
          time: "Late Morning/Early Afternoon",
          title: "Transfer to Cape Town Airport & Flight to Durban",
          description: "Scenic 2-3 hour drive back to Cape Town International Airport, then 2-hour domestic flight to King Shaka International Airport."
        },
        {
          time: "Late Afternoon/Evening",
          title: "Arrival in KwaZulu-Natal & Transfer to Drakensberg",
          description: "2.5-3 hour transfer to accommodation in Drakensberg foothills with unfolding views of the KwaZulu-Natal landscape."
        }
      ]
    },
    {
      id: "day5",
      title: "Day 5: Monday, 17th November",
      subtitle: "The Spirit of the Drakensberg: uKhahlamba-Drakensberg Park",
      activities: [
        {
          time: "Full Day",
          title: "Exploring the 'Barrier of Spears'",
          description: "Guided hikes to renowned rock art sites like Main Caves at Giant's Castle. Africa's largest concentration of rock paintings with over 35,000 individual images."
        },
        {
          time: "Detailed Focus",
          title: "Ancient Visual Narratives",
          description: "In-depth interpretation of San spiritual art depicting eland, shamanistic trances, communal dances, and daily life spanning 4,000 years."
        },
        {
          time: "Landscape Immersion",
          title: "Dramatic Natural Beauty",
          description: "Experience soaring basaltic buttresses, golden sandstone ramparts, and unique alpine flora including endangered Bearded Vultures."
        }
      ]
    },
    {
      id: "day6",
      title: "Day 6: Tuesday, 18th November",
      subtitle: "Drakensberg to Durban: Leisurely Departure",
      activities: [
        {
          time: "Morning",
          title: "Final Mountain Reflections",
          description: "Leisurely morning for personal reflection and absorption of the profound mountain atmosphere."
        },
        {
          time: "Departure",
          title: "Transfer to King Shaka International Airport",
          description: "Comfortable transfer to King Shaka International Airport (DUR) for onward journey, marking the end of this heritage expedition."
        }
      ]
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Detailed Daily Exploration
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Each day has been carefully crafted to provide deep insights and exclusive experiences, 
            all managed with seamless logistical precision.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {days.map((day) => (
              <AccordionItem key={day.id} value={day.id} className="bg-white rounded-lg shadow-sm">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-bantu-orange">{day.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{day.subtitle}</p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-6">
                    {day.activities.map((activity, index) => (
                      <div key={index} className="border-l-4 border-bantu-orange pl-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-bantu-orange" />
                          <span className="font-semibold text-bantu-orange">{activity.time}</span>
                        </div>
                        <h4 className="font-semibold text-lg mb-2">{activity.title}</h4>
                        <p className="text-gray-700 leading-relaxed">{activity.description}</p>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default DetailedItinerary;
