
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Star, ThumbsUp, Calendar, PlusCircle } from 'lucide-react';

const PersonalizedSuggestions = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <ThumbsUp className="mr-2 h-5 w-5 text-bantu-orange" />
          Recommended for You
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Featured Experience */}
        <div className="relative rounded-lg overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YWZyaWNhbiUyMGRhbmNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60" 
            alt="Traditional Dance Workshop" 
            className="w-full h-36 object-cover"
          />
          <div className="absolute top-2 right-2">
            <Badge className="bg-bantu-orange">Limited Spots</Badge>
          </div>
          <div className="p-3">
            <h3 className="font-medium">Traditional Dance Workshop</h3>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span>Lagos, Nigeria</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                <span className="text-sm font-medium">4.9</span>
                <span className="text-xs text-gray-500 ml-1">(124)</span>
              </div>
              <Button size="sm" className="bg-bantu-orange hover:bg-bantu-orange/90">
                <PlusCircle className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
          </div>
        </div>

        {/* More Suggestions */}
        <div className="space-y-3">
          {[
            {
              title: "Artisan Craft Workshop",
              location: "Accra, Ghana",
              date: "Sep 15",
              image: "https://images.unsplash.com/photo-1632853073412-582bf5ffcbb6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YWZyaWNhbiUyMGNyYWZ0fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
            },
            {
              title: "Night Safari Experience",
              location: "Serengeti, Tanzania",
              date: "Oct 5",
              image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c2FmYXJpfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
            }
          ].map((suggestion, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                <img 
                  src={suggestion.image} 
                  alt={suggestion.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm">{suggestion.title}</h4>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>{suggestion.location}</span>
                </div>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>Available from {suggestion.date}</span>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full text-bantu-orange border-bantu-orange hover:bg-bantu-orange/10">
          View All Recommendations
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PersonalizedSuggestions;
