
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ItineraryTable = () => {
  const itineraryData = [
    {
      date: "Thurs, Nov 13",
      day: "1",
      location: "Cape Town",
      activities: "Arrival, Coastal Introduction, Rhode's Memorial Panoramic Views",
      overnight: "Cape Town"
    },
    {
      date: "Fri, Nov 14",
      day: "2", 
      location: "Cape Town",
      activities: "Table Mountain (Cape Floral Region WHS), Robben Island (WHS), V&A Waterfront, Boo Kaap",
      overnight: "Cape Town"
    },
    {
      date: "Sat, Nov 15",
      day: "3",
      location: "Cederberg Wilderness Area",
      activities: "Scenic Drive, San Rock Art Exploration (Cape Floral Region WHS context)",
      overnight: "Cederberg"
    },
    {
      date: "Sun, Nov 16",
      day: "4",
      location: "Cederberg to Drakensberg",
      activities: "Cederberg reflections, Transfer via Cape Town Airport (CPT) to Durban (DUR), Transfer to Drakensberg foothills",
      overnight: "Drakensberg"
    },
    {
      date: "Mon, Nov 17",
      day: "5",
      location: "uKhahlamba-Drakensberg Park",
      activities: "San Rock Art & Natural Beauty Exploration (Maloti-Drakensberg Park WHS)",
      overnight: "Drakensberg"
    },
    {
      date: "Tues, Nov 18",
      day: "6",
      location: "Drakensberg to Durban",
      activities: "Leisurely Departure, Transfer to King Shaka International Airport (DUR) for onward journey",
      overnight: "N/A"
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl text-center">Expedition Snapshot</CardTitle>
            <p className="text-center text-gray-600">
              Cape Town, Cederberg & Drakensberg Expedition (November 13-18, 2025)
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-bantu-orange">
                    <th className="text-left p-3 font-semibold">Date</th>
                    <th className="text-left p-3 font-semibold">Day</th>
                    <th className="text-left p-3 font-semibold">Primary Location(s)</th>
                    <th className="text-left p-3 font-semibold">Key World Heritage Focus/Activities</th>
                    <th className="text-left p-3 font-semibold">Overnight</th>
                  </tr>
                </thead>
                <tbody>
                  {itineraryData.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{item.date}</td>
                      <td className="p-3 text-center">{item.day}</td>
                      <td className="p-3">{item.location}</td>
                      <td className="p-3 text-sm">{item.activities}</td>
                      <td className="p-3">{item.overnight}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ItineraryTable;
