
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Map, 
  Calendar, 
  FileText, 
  Video, 
  CheckSquare, 
  Headphones,
  MapPin,
  Users,
  Sun,
  CloudRain,
  Plane,
  Bus,
  FileCheck
} from "lucide-react";

const Module2Content = () => {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [progress, setProgress] = useState<number>(15);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Update progress based on tab views
    if (value === "resources" && progress < 25) {
      setProgress(25);
    } else if (value === "activities" && progress < 35) {
      setProgress(35);
    }
  };
  
  const markComplete = () => {
    setProgress(100);
    // Here we could also store the progress in the database
    alert("Congratulations on completing Module 2! You can now proceed to Module 3.");
  };
  
  return (
    <div className="space-y-8">
      {/* Module Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-blue-800">Module 2: Planning and Designing Tours in Africa</h1>
            <p className="text-gray-600">Duration: 3 Hours</p>
          </div>
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-none">
            In Progress
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium">Module Progress</p>
            <p className="text-sm text-gray-500">{progress}% Complete</p>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>
      
      {/* Module Content */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Module Overview</h2>
              <p className="mb-4 text-gray-700">
                This module focuses on the intricacies of designing tailored itineraries that cater to diverse traveler 
                preferences. Whether it's an exhilarating wildlife safari, an immersive cultural experience, or a 
                luxurious beach getaway, understanding how to balance logistics, accessibility, and seasonal factors 
                is key to curating unforgettable travel experiences.
              </p>
              
              <h3 className="text-lg font-semibold mt-6 mb-3">Learning Objectives</h3>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2"></span>
                  <span>Understand core principles of itinerary development for African tours.</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2"></span>
                  <span>Learn how to balance activities, rest periods, and travel time effectively.</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2"></span>
                  <span>Recognize the impact of seasonal variations on travel planning.</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2"></span>
                  <span>Develop strategies for transportation and accessibility planning across Africa.</span>
                </li>
              </ul>
              
              <Separator className="my-6" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <Map className="h-5 w-5 mr-2 text-blue-600" />
                    What You'll Learn
                  </h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Itinerary Development Principles</li>
                    <li>• Balancing Activities and Rest</li>
                    <li>• Seasonal Considerations</li>
                    <li>• Accessibility and Transportation Planning</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <FileCheck className="h-5 w-5 mr-2 text-green-600" />
                    What You'll Create
                  </h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Sample 5-day African Tour Itinerary</li>
                    <li>• Transportation Plan for Remote Destinations</li>
                    <li>• Seasonal Activity Calendar</li>
                    <li>• Balanced Activity Schedule</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button onClick={() => handleTabChange("content")}>
              Continue to Module Content
            </Button>
          </div>
        </TabsContent>
        
        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Module Topics</h2>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-blue-600" />
                      <span>Itinerary Development Principles</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-7 space-y-4">
                      <p className="text-gray-700">
                        Developing a well-structured itinerary is the foundation of any successful tour in Africa. This section covers:
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2"></span>
                          <span><strong>Understanding traveler preferences and tour customization:</strong> Learn how to assess your clients' interests, travel style, budget, and expectations to tailor an itinerary that meets their specific needs.</span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2"></span>
                          <span><strong>Structuring itineraries day-by-day planning:</strong> Master the art of organizing each day for optimal experience, including morning, afternoon, and evening activities.</span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2"></span>
                          <span><strong>Incorporating must-see attractions, leisure, and optional experiences:</strong> Balance iconic landmarks with hidden gems while allowing flexibility for spontaneous exploration.</span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2"></span>
                          <span><strong>Managing client expectations and flexibility:</strong> Strategies for communicating realistic timelines and building contingency plans for weather, transportation delays, or unexpected events.</span>
                        </li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 mr-2 text-green-600" />
                      <span>Balancing Activities and Rest</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-7 space-y-4">
                      <p className="text-gray-700">
                        One of the most common mistakes in tour planning is creating overpacked schedules that lead to traveler fatigue. This section examines:
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2"></span>
                          <span><strong>The importance of downtime in travel planning:</strong> Why scheduled free time is essential for traveler satisfaction and enjoyment.</span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2"></span>
                          <span><strong>Scheduling cultural experiences, adventure activities, and relaxation:</strong> How to create a rhythm that alternates between high-energy activities and recovery periods.</span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2"></span>
                          <span><strong>Avoiding travel fatigue and overpacked schedules:</strong> Techniques for assessing travel distance, activity intensity, and appropriate pacing.</span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2"></span>
                          <span><strong>Sample itineraries with ideal activity-rest balance:</strong> Analysis of successful tour schedules and what makes them work.</span>
                        </li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-amber-600" />
                      <span>Seasonal Considerations</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-7 space-y-4">
                      <p className="text-gray-700">
                        Africa's diverse climate zones mean that optimal travel seasons vary dramatically by region. This section explores:
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="inline-block w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 mr-2"></span>
                          <span><strong>Best seasons for different travel experiences:</strong> Optimal timing for safaris, beach holidays, cultural festivals, and other activities across various regions.</span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 mr-2"></span>
                          <span><strong>Weather patterns and their impact on travel logistics:</strong> How rainy seasons, dust, extreme heat, or other weather factors affect transportation, accommodations, and activities.</span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 mr-2"></span>
                          <span><strong>Peak vs. off-season advantages and challenges:</strong> Balancing crowd levels, pricing, availability, and experience quality when planning during different seasons.</span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 mr-2"></span>
                          <span><strong>How climate change affects African tourism planning:</strong> Emerging patterns and adaptations needed in contemporary tour planning.</span>
                        </li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-purple-600" />
                      <span>Accessibility and Transportation Planning</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-7 space-y-4">
                      <p className="text-gray-700">
                        The logistics of movement between destinations can make or break an African tour experience. This section covers:
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="inline-block w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-2"></span>
                          <span><strong>Air, road, and rail transportation across Africa:</strong> Comparing transportation modes for different routes and traveler preferences.</span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-2"></span>
                          <span><strong>Domestic vs. international travel connections:</strong> Coordinating international arrivals with regional transportation networks.</span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-2"></span>
                          <span><strong>Challenges of remote destination access:</strong> Solutions for reaching off-the-beaten-path locations while maintaining comfort and safety.</span>
                        </li>
                        <li className="flex items-start">
                          <span className="inline-block w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-2"></span>
                          <span><strong>Travel regulations and visa requirements:</strong> Navigating cross-border travel, visa formalities, and health requirements for multi-country itineraries.</span>
                        </li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => handleTabChange("overview")}>
              Back to Overview
            </Button>
            <Button onClick={() => handleTabChange("resources")}>
              Continue to Resources
            </Button>
          </div>
        </TabsContent>
        
        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-6">Learning Resources</h2>
              
              <div className="space-y-8">
                {/* Itinerary Development Resources */}
                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-600" />
                    Itinerary Development Resources
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="bg-blue-50 p-4 flex items-center">
                        <BookOpen className="h-8 w-8 text-blue-600 mr-4" />
                        <div>
                          <Badge className="mb-1 bg-blue-100 text-blue-800 hover:bg-blue-200">Guide</Badge>
                          <h4 className="font-semibold">Steps to Creating a Perfect Travel Itinerary</h4>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-600 mb-3">
                          A comprehensive guide covering the essential steps for creating balanced, engaging, and practical African tour itineraries.
                        </p>
                        <Button variant="outline" size="sm" className="w-full">Access Resource</Button>
                      </CardContent>
                    </Card>
                    
                    <Card className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="bg-blue-50 p-4 flex items-center">
                        <FileText className="h-8 w-8 text-blue-600 mr-4" />
                        <div>
                          <Badge className="mb-1 bg-blue-100 text-blue-800 hover:bg-blue-200">Template</Badge>
                          <h4 className="font-semibold">African Tour Itinerary Planner</h4>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-600 mb-3">
                          Downloadable template with day-by-day planning structure, activity categorization, and timing guidelines for African tours.
                        </p>
                        <Button variant="outline" size="sm" className="w-full">Download Template</Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                {/* Balancing Activities Resources */}
                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-green-600" />
                    Balancing Activities Resources
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="bg-green-50 p-4 flex items-center">
                        <CheckSquare className="h-8 w-8 text-green-600 mr-4" />
                        <div>
                          <Badge className="mb-1 bg-green-100 text-green-800 hover:bg-green-200">Checklist</Badge>
                          <h4 className="font-semibold">How to Structure Balanced Itineraries</h4>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-600 mb-3">
                          A practical checklist for evaluating and adjusting itineraries to achieve optimal balance between activities and rest.
                        </p>
                        <Button variant="outline" size="sm" className="w-full">Access Checklist</Button>
                      </CardContent>
                    </Card>
                    
                    <Card className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="bg-green-50 p-4 flex items-center">
                        <Video className="h-8 w-8 text-green-600 mr-4" />
                        <div>
                          <Badge className="mb-1 bg-green-100 text-green-800 hover:bg-green-200">Video</Badge>
                          <h4 className="font-semibold">Expert Insights on Itinerary Pacing</h4>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-600 mb-3">
                          Video lecture featuring experienced tour operators discussing strategies to avoid overpacked schedules.
                        </p>
                        <Button variant="outline" size="sm" className="w-full">Watch Video</Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                {/* Seasonal Considerations Resources */}
                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-amber-600" />
                    Seasonal Considerations Resources
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="bg-amber-50 p-4 flex items-center">
                        <FileText className="h-8 w-8 text-amber-600 mr-4" />
                        <div>
                          <Badge className="mb-1 bg-amber-100 text-amber-800 hover:bg-amber-200">Report</Badge>
                          <h4 className="font-semibold">Seasonal Travel Trends in Africa</h4>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-600 mb-3">
                          Comprehensive analysis of seasonal patterns, visitor statistics, and pricing fluctuations across African destinations.
                        </p>
                        <Button variant="outline" size="sm" className="w-full">Read Report</Button>
                      </CardContent>
                    </Card>
                    
                    <Card className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="bg-amber-50 p-4 flex items-center">
                        <Headphones className="h-8 w-8 text-amber-600 mr-4" />
                        <div>
                          <Badge className="mb-1 bg-amber-100 text-amber-800 hover:bg-amber-200">Podcast</Badge>
                          <h4 className="font-semibold">How Weather Shapes African Travel</h4>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-600 mb-3">
                          Audio series exploring how seasonal weather patterns influence travel experiences across different African regions.
                        </p>
                        <Button variant="outline" size="sm" className="w-full">Listen to Podcast</Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                {/* Transportation Planning Resources */}
                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-purple-600" />
                    Transportation Planning Resources
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="bg-purple-50 p-4 flex items-center">
                        <Map className="h-8 w-8 text-purple-600 mr-4" />
                        <div>
                          <Badge className="mb-1 bg-purple-100 text-purple-800 hover:bg-purple-200">Guide</Badge>
                          <h4 className="font-semibold">Navigating Africa's Transport Network</h4>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-600 mb-3">
                          Practical resource for understanding transportation options, reliability factors, and booking approaches across the continent.
                        </p>
                        <Button variant="outline" size="sm" className="w-full">Access Guide</Button>
                      </CardContent>
                    </Card>
                    
                    <Card className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="bg-purple-50 p-4 flex items-center">
                        <Video className="h-8 w-8 text-purple-600 mr-4" />
                        <div>
                          <Badge className="mb-1 bg-purple-100 text-purple-800 hover:bg-purple-200">Webinar</Badge>
                          <h4 className="font-semibold">Visa & Travel Regulations</h4>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-600 mb-3">
                          Expert-led session covering visa requirements, border crossings, and regulatory considerations for multi-country tours.
                        </p>
                        <Button variant="outline" size="sm" className="w-full">Watch Webinar</Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => handleTabChange("content")}>
              Back to Content
            </Button>
            <Button onClick={() => handleTabChange("activities")}>
              Continue to Activities
            </Button>
          </div>
        </TabsContent>
        
        {/* Activities Tab */}
        <TabsContent value="activities" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-6">Interactive Activities</h2>
              
              <div className="space-y-8">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Case Study Review</h3>
                  <p className="mb-4">
                    Analyze how leading tour operators design their itineraries for maximum traveler satisfaction while 
                    maintaining operational efficiency.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">Abercrombie & Kent: Luxury Safari Circuit</h4>
                        <p className="text-sm text-gray-600 mb-4">
                          Explore how this luxury operator structures their Kenya & Tanzania safari itineraries to balance 
                          game viewing with relaxation and cultural experiences.
                        </p>
                        <Button variant="outline" size="sm">View Case Study</Button>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">Intrepid Travel: Small Group Morocco Tour</h4>
                        <p className="text-sm text-gray-600 mb-4">
                          Analyze how this adventure travel company designs itineraries that connect multiple 
                          destinations while maintaining an authentic, immersive experience.
                        </p>
                        <Button variant="outline" size="sm">View Case Study</Button>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-medium mb-2">Discussion Questions</h4>
                    <ol className="list-decimal ml-5 space-y-2">
                      <li>What principles do both companies follow despite their different market positioning?</li>
                      <li>How do they handle transportation between distant locations?</li>
                      <li>What techniques do they use to create a sense of narrative through their itinerary flow?</li>
                    </ol>
                  </div>
                </div>
                
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Itinerary Workshop</h3>
                  <p className="mb-6">
                    Apply what you've learned by developing a 5-day itinerary for one of the following destinations. 
                    Focus on creating a balanced, realistic schedule that incorporates the principles covered in this module.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card className="overflow-hidden hover:shadow-md transition-all cursor-pointer">
                      <div className="h-40 overflow-hidden">
                        <img 
                          src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                          alt="Cape Town" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-medium">Cape Town & Winelands</h4>
                        <p className="text-sm text-gray-600">South Africa</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="overflow-hidden hover:shadow-md transition-all cursor-pointer">
                      <div className="h-40 overflow-hidden">
                        <img 
                          src="https://images.unsplash.com/photo-1523805009345-7448845a9e53?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                          alt="Zanzibar" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-medium">Zanzibar Island</h4>
                        <p className="text-sm text-gray-600">Tanzania</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="overflow-hidden hover:shadow-md transition-all cursor-pointer">
                      <div className="h-40 overflow-hidden">
                        <img 
                          src="https://images.unsplash.com/photo-1504432842032-3c90296f8c1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                          alt="Marrakech" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-medium">Marrakech & Atlas Mountains</h4>
                        <p className="text-sm text-gray-600">Morocco</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border mb-4">
                    <h4 className="font-medium mb-2">Itinerary Requirements</h4>
                    <ul className="list-disc ml-5 space-y-1">
                      <li>Day-by-day breakdown with morning, afternoon, and evening activities</li>
                      <li>At least one cultural experience, one natural/scenic experience, and one leisure period</li>
                      <li>Practical transportation planning between locations</li>
                      <li>Consideration of seasonal factors for your chosen destination</li>
                    </ul>
                  </div>
                  
                  <Button>Start Itinerary Workshop</Button>
                </div>
                
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Assessment Quiz</h3>
                  <p className="mb-6">
                    Test your knowledge of the key concepts covered in Module 2. Complete this multiple-choice quiz 
                    to assess your understanding of itinerary planning principles.
                  </p>
                  
                  <div className="bg-white p-4 rounded-lg border mb-6">
                    <h4 className="font-medium mb-4">Sample Questions</h4>
                    <div className="space-y-6">
                      <div>
                        <p className="font-medium mb-2">1. When planning an itinerary that includes a safari in East Africa, what is the optimal number of different lodges/camps to include in a 7-day stay?</p>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <input type="radio" id="q1a" name="q1" className="mr-2" />
                            <label htmlFor="q1a">A) 5-7 different properties (one each night)</label>
                          </div>
                          <div className="flex items-center">
                            <input type="radio" id="q1b" name="q1" className="mr-2" />
                            <label htmlFor="q1b">B) 3-4 different properties (2 nights at some)</label>
                          </div>
                          <div className="flex items-center">
                            <input type="radio" id="q1c" name="q1" className="mr-2" />
                            <label htmlFor="q1c">C) 2 different properties (3-4 nights each)</label>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <p className="font-medium mb-2">2. Which of the following is NOT a valid principle of activity-rest balance in itinerary planning?</p>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <input type="radio" id="q2a" name="q2" className="mr-2" />
                            <label htmlFor="q2a">A) Always schedule at least one full day of leisure in a 7-day itinerary</label>
                          </div>
                          <div className="flex items-center">
                            <input type="radio" id="q2b" name="q2" className="mr-2" />
                            <label htmlFor="q2b">B) Plan the most intensive activities for the first day to maximize excitement</label>
                          </div>
                          <div className="flex items-center">
                            <input type="radio" id="q2c" name="q2" className="mr-2" />
                            <label htmlFor="q2c">C) Avoid scheduling more than 6 hours of structured activities in one day</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button>Take Full Assessment Quiz</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => handleTabChange("resources")}>
              Back to Resources
            </Button>
            <Button onClick={markComplete}>
              Mark Module as Complete
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Module2Content;
