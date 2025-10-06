
import React from 'react';
import { MapPin, ChefHat, Palette, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const partnerCategories = [
  {
    category: "Authentic Restaurants",
    icon: <ChefHat className="w-6 h-6" />,
    locations: [
      { city: "Cape Town", country: "South Africa", specialty: "Traditional Braai & Potjiekos" },
      { city: "Brooklyn", country: "USA", specialty: "East African Fusion" },
      { city: "Accra", country: "Ghana", specialty: "Jollof & Local Delicacies" }
    ],
    image: "/lovable-uploads/4fbf6fc5-c7f9-4af2-b716-6bac63c8fcaf.png",
    description: "Savor authentic African flavors prepared by passionate chefs who honor traditional recipes"
  },
  {
    category: "Cultural Artisans",
    icon: <Palette className="w-6 h-6" />,
    locations: [
      { city: "Nairobi", country: "Kenya", specialty: "Maasai Beadwork & Crafts" },
      { city: "London", country: "UK", specialty: "African Literature & Arts" },
      { city: "Lagos", country: "Nigeria", specialty: "Yoruba Textiles & Sculptures" }
    ],
    image: "/lovable-uploads/8f904e85-a315-4e6b-9061-6f959cadf576.png",
    description: "Discover handcrafted treasures from master artisans preserving centuries-old traditions"
  },
  {
    category: "Cultural Experiences",
    icon: <Users className="w-6 h-6" />,
    locations: [
      { city: "Johannesburg", country: "South Africa", specialty: "Township Tours & Dance" },
      { city: "Berlin", country: "Germany", specialty: "African Heritage Centers" },
      { city: "Paris", country: "France", specialty: "Diaspora Cultural Events" }
    ],
    image: "/lovable-uploads/11a1368a-560d-4bb1-92ea-5789adb56330.png",
    description: "Immerse yourself in living culture through music, dance, and storytelling experiences"
  }
];

const RedeemTokens: React.FC = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Stamps Open Doors Worldwide</h2>
          <div className="w-24 h-1 bg-bantu-orange mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            From the heart of Africa to diaspora communities globally, your cultural stamps unlock authentic experiences 
            with local partners who share our vision of preserving and celebrating African heritage.
          </p>
        </div>

        <div className="relative px-10">
          <Carousel opts={{ loop: true }}>
            <CarouselContent>
              {partnerCategories.map((category, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="h-full card-hover overflow-hidden">
                    <CardHeader className="p-0">
                      <div className="relative h-64 overflow-hidden">
                        <img 
                          src={category.image} 
                          alt={category.category} 
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                              {category.icon}
                            </div>
                            <CardTitle className="text-white text-xl">
                              {category.category}
                            </CardTitle>
                          </div>
                          <p className="text-white/90 text-sm">{category.description}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {category.locations.map((location, idx) => (
                          <div key={idx} className="border-l-4 border-bantu-orange pl-4">
                            <div className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 text-bantu-orange flex-shrink-0 mt-1" />
                              <div>
                                <div className="font-medium text-gray-800">
                                  {location.city}, {location.country}
                                </div>
                                <div className="text-sm text-gray-600">{location.specialty}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0 px-6 pb-6">
                      <Button variant="outline" className="w-full border-bantu-orange text-bantu-orange hover:bg-bantu-orange hover:text-white">
                        Explore {category.category}
                      </Button>
                    </CardFooter>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0" />
            <CarouselNext className="right-0" />
          </Carousel>
        </div>

        {/* Community Impact Section */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">Building Cultural Bridges</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Every stamp redeemed strengthens the network of African cultural ambassadors worldwide, 
              creating sustainable support for traditional arts, cuisine, and community enterprises.
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <Button className="button-primary text-lg px-8 py-4">
            Explore Global Redemption Partners
          </Button>
        </div>
      </div>
    </section>
  );
};

export default RedeemTokens;
