
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MapPin } from 'lucide-react';
import PackageRating from './PackageRating';
import { formatRatingsString } from '@/utils/experienceRatingUtils';
import { getAllRatings } from '@/utils/experienceRatingUtils';
import { packageExperiences } from '@/data/packageExperiences';

// Filter out the TEDx package (id 103) for the homepage featured packages
const homepagePackages = packageExperiences.filter(pkg => pkg.id !== 103);

const FeaturedPackages = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Featured Packages</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our curated selection of adventure and cultural packages across Africa's most 
            breathtaking destinations.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {homepagePackages.map((pkg) => {
            // Get all ratings for this package
            const ratings = getAllRatings(pkg);
            const { ratingsString } = formatRatingsString(ratings);
            
            return (
              <Card key={pkg.id} className="overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative h-64">
                  <img 
                    src={pkg.image} 
                    alt={pkg.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-green-600 text-white">
                      {pkg.category}
                    </Badge>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                    <h3 className="text-2xl font-bold text-white">{pkg.title}</h3>
                    <p className="text-white/90">{pkg.location}</p>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <CalendarDays className="mr-1 h-4 w-4 text-bantu-orange" />
                      <span>{pkg.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="mr-1 h-4 w-4 text-bantu-orange" />
                      <span>{pkg.location}</span>
                    </div>
                    <PackageRating 
                      rating={pkg.rating} 
                      reviewCount={pkg.reviewCount} 
                      useCustomSymbols={true}
                    />
                  </div>
                  
                  <div className="text-sm text-gray-700 mb-4">
                    <p>{ratingsString}</p>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{pkg.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-2xl font-bold text-bantu-orange">${pkg.price}</p>
                      <p className="text-sm text-gray-600">All-Inclusive</p>
                    </div>
                    
                    <Link to="/musika">
                      <Button className="bg-bantu-orange hover:bg-bantu-orange/90 text-white">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="text-center mt-10">
          <Link to="/musika">
            <Button variant="outline" className="rounded-full px-8 border-bantu-orange text-bantu-orange hover:bg-bantu-orange/10">
              View All Packages
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPackages;
