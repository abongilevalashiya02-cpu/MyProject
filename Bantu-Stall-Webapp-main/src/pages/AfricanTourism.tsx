
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, MapPin, Users, Truck, Megaphone, BookOpen, Award, ChevronLeft } from "lucide-react";
import { Link, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import AfricanTourismCourse from "@/components/mafunzo/AfricanTourismCourse";
import Module1Content from "@/components/mafunzo/modules/Module1Content";
import Module2Content from "@/components/mafunzo/modules/Module2Content";
import RegionalMapsSection from "@/components/mafunzo/modules/sections/RegionalMapsSection";

const AfricanTourism = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("modules");

  useEffect(() => {
    if (location.pathname.includes("/module1")) {
      setActiveTab("module1");
    } else if (location.pathname.includes("/module2")) {
      setActiveTab("module2");
    } else {
      setActiveTab("modules");
    }
  }, [location.pathname]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "module1") {
      navigate("/mafunzo/african-tourism/module1");
    } else if (value === "module2") {
      navigate("/mafunzo/african-tourism/module2");
    } else {
      navigate("/mafunzo/african-tourism");
    }
  };

  return (
    <div className="min-h-screen bg-[#fef7f4]">
      {/* Header with Navigation */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" asChild className="mr-4">
              <Link to="/mafunzo/dashboard">
                <ChevronLeft className="h-4 w-4 mr-1" /> Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-xl font-bold">African Tourism Specialist Course</h1>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="modules">Course Modules</TabsTrigger>
            <TabsTrigger value="module1">Module 1</TabsTrigger>
            <TabsTrigger value="module2">Module 2</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="modules" className="space-y-4">
            <AfricanTourismCourse />
          </TabsContent>

          <TabsContent value="module1" className="space-y-4">
            <Module1Content />
          </TabsContent>
          
          <TabsContent value="module2" className="space-y-4">
            <Module2Content />
          </TabsContent>
          
          <TabsContent value="resources" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-6">Course Resources</h2>
                
                {/* Regional Maps Section */}
                <RegionalMapsSection />
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      title: "Tourism Industry Reports",
                      description: "Latest statistics and trends in African tourism sector",
                      icon: <BookOpen className="h-8 w-8 text-blue-500" />,
                      badge: "PDF Documents"
                    },
                    {
                      title: "Regional Maps Collection",
                      description: "Detailed maps of major tourist routes and destinations",
                      icon: <MapPin className="h-8 w-8 text-green-500" />,
                      badge: "Interactive Maps"
                    },
                    {
                      title: "Cultural Etiquette Guides",
                      description: "Cultural protocols for different African regions",
                      icon: <Users className="h-8 w-8 text-purple-500" />,
                      badge: "Downloadable Guides"
                    },
                    {
                      title: "Logistics Checklists",
                      description: "Essential templates for tour planning and operation",
                      icon: <Truck className="h-8 w-8 text-amber-500" />,
                      badge: "Templates"
                    },
                    {
                      title: "Marketing Toolkit",
                      description: "Promotional materials and campaign examples",
                      icon: <Megaphone className="h-8 w-8 text-red-500" />,
                      badge: "Marketing Resources"
                    },
                    {
                      title: "Case Study Database",
                      description: "Extended case studies with detailed analysis",
                      icon: <Award className="h-8 w-8 text-indigo-500" />,
                      badge: "Case Studies"
                    }
                  ].map((resource, i) => (
                    <Card key={i} className="flex flex-col border p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start mb-4">
                        <div className="mr-4 p-3 bg-gray-100 rounded-lg">
                          {resource.icon}
                        </div>
                        <div>
                          <Badge className="mb-2 bg-gray-100 text-gray-800 border-none">
                            {resource.badge}
                          </Badge>
                          <h3 className="font-bold text-lg mb-1">{resource.title}</h3>
                          <p className="text-gray-600 text-sm">{resource.description}</p>
                        </div>
                      </div>
                      <Button variant="outline" className="mt-auto self-start">
                        Access Resource
                      </Button>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="discussions" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Course Discussions</h2>
                  <Button>Start New Discussion</Button>
                </div>
                
                <div className="text-center py-12">
                  <GraduationCap className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium mb-2">Join the Conversation</h3>
                  <p className="text-gray-500 max-w-md mx-auto mb-6">
                    Connect with fellow students and instructors to discuss course material, 
                    share insights, and collaborate on projects.
                  </p>
                  <Button variant="outline">Browse All Discussions</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AfricanTourism;
