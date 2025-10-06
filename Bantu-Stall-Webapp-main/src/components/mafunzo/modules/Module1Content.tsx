
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ModuleOverview from './sections/ModuleOverview';
import IndustryOverview from './sections/IndustryOverview';
import TouristDestinations from './sections/TouristDestinations';
import RegionalDifferences from './sections/RegionalDifferences';
import TourismStatistics from './sections/TourismStatistics';
import InteractiveActivities from './sections/InteractiveActivities';
import ModuleAssessment from './sections/ModuleAssessment';
import { Progress } from "@/components/ui/progress";
import { useIsMobile } from "@/hooks/use-mobile";
import { navLinks } from '@/components/navbar/navigationData';

const Module1Content: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [progress, setProgress] = useState(35);
  const isMobile = useIsMobile();
  
  const [viewedSections, setViewedSections] = useState({
    overview: true,
    section1: false,
    section2: false,
    section3: false,
    section4: false,
    activities: false,
    assessment: false
  });

  const markSectionAsViewed = (section: keyof typeof viewedSections) => {
    if (!viewedSections[section]) {
      const updatedViewedSections = { ...viewedSections, [section]: true };
      setViewedSections(updatedViewedSections);
      
      const totalSections = Object.keys(viewedSections).length;
      const completedSections = Object.values(updatedViewedSections).filter(Boolean).length;
      const newProgress = Math.round((completedSections / totalSections) * 100);
      setProgress(newProgress);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    markSectionAsViewed(value as keyof typeof viewedSections);
  };

  const tabLabels = {
    overview: "Overview",
    section1: "Industry",
    section2: "Destinations",
    section3: "Regional",
    section4: "Statistics",
    activities: "Activities",
    assessment: "Assessment"
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-blue-900">Module 1: Introduction to African Tourism</h1>
          <p className="text-gray-600">Duration: 2 Hours | Status: In Progress</p>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-md">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">Module Progress</span>
            <span className="text-sm text-bantu-orange">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="bg-white border rounded-md p-4">
        <h3 className="text-sm font-medium mb-3">Navigate to other sections:</h3>
        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
          {navLinks.map((link) => (
            <Link to={link.path} key={link.path}>
              <Button 
                variant={window.location.pathname === link.path ? "default" : "outline"}
                size="sm"
                className="whitespace-nowrap"
              >
                <link.icon className="mr-2 h-4 w-4" />
                {link.title}
              </Button>
            </Link>
          ))}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        {isMobile ? (
          <div className="bg-white border rounded-md p-2">
            <div className="flex justify-between items-center">
              <span className="font-medium text-sm">
                {tabLabels[activeTab as keyof typeof tabLabels]}
              </span>
              <div className="flex space-x-2">
                {activeTab !== "overview" && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      const keys = Object.keys(viewedSections);
                      const currentIndex = keys.indexOf(activeTab);
                      if (currentIndex > 0) {
                        handleTabChange(keys[currentIndex - 1]);
                      }
                    }}
                    className="h-8 px-2"
                  >
                    Previous
                  </Button>
                )}
                {activeTab !== "assessment" && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const keys = Object.keys(viewedSections);
                      const currentIndex = keys.indexOf(activeTab);
                      if (currentIndex < keys.length - 1) {
                        handleTabChange(keys[currentIndex + 1]);
                      }
                    }}
                    className="h-8 px-2"
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
            <div className="mt-3 overflow-x-auto">
              <TabsList className="w-full inline-flex">
                {Object.entries(tabLabels).map(([value, label]) => (
                  <TabsTrigger 
                    key={value} 
                    value={value} 
                    className="text-xs flex-1 whitespace-nowrap"
                  >
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </div>
        ) : (
          <div className="bg-white border rounded-md p-1">
            <TabsList className="grid grid-cols-7">
              <TabsTrigger value="overview" className="text-sm">Overview</TabsTrigger>
              <TabsTrigger value="section1" className="text-sm">Industry</TabsTrigger>
              <TabsTrigger value="section2" className="text-sm">Destinations</TabsTrigger>
              <TabsTrigger value="section3" className="text-sm">Regional</TabsTrigger>
              <TabsTrigger value="section4" className="text-sm">Statistics</TabsTrigger>
              <TabsTrigger value="activities" className="text-sm">Activities</TabsTrigger>
              <TabsTrigger value="assessment" className="text-sm">Assessment</TabsTrigger>
            </TabsList>
          </div>
        )}

        <TabsContent value="overview">
          <ModuleOverview onNext={() => handleTabChange("section1")} />
        </TabsContent>

        <TabsContent value="section1">
          <IndustryOverview 
            onNext={() => handleTabChange("section2")}
            onPrevious={() => handleTabChange("overview")}
          />
        </TabsContent>

        <TabsContent value="section2">
          <TouristDestinations
            onNext={() => handleTabChange("section3")}
            onPrevious={() => handleTabChange("section1")}
          />
        </TabsContent>

        <TabsContent value="section3">
          <RegionalDifferences
            onNext={() => handleTabChange("section4")}
            onPrevious={() => handleTabChange("section2")}
          />
        </TabsContent>

        <TabsContent value="section4">
          <TourismStatistics
            onNext={() => handleTabChange("activities")}
            onPrevious={() => handleTabChange("section3")}
          />
        </TabsContent>

        <TabsContent value="activities">
          <InteractiveActivities
            onNext={() => handleTabChange("assessment")}
            onPrevious={() => handleTabChange("section4")}
          />
        </TabsContent>

        <TabsContent value="assessment">
          <ModuleAssessment
            onNext={() => handleTabChange("assessment")}
            onPrevious={() => handleTabChange("activities")}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Module1Content;
