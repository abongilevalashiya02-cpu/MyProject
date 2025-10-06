
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, CheckCircle, Map, BarChart } from "lucide-react";

interface ModuleOverviewProps {
  onNext: () => void;
}

const ModuleOverview: React.FC<ModuleOverviewProps> = ({ onNext }) => {
  return (
    <div className="space-y-6">
      <Alert className="bg-blue-50 border-blue-200">
        <Globe className="h-5 w-5 text-blue-600" />
        <AlertTitle className="text-blue-800">About This Module</AlertTitle>
        <AlertDescription className="text-blue-700">
          Africa is a continent of vast landscapes, diverse cultures, and incredible tourism opportunities. 
          This module provides an overview of the African tourism industry, covering key destinations, regional distinctions, 
          and tourism growth trends.
        </AlertDescription>
      </Alert>

      <h2 className="text-xl font-bold">Learning Objectives</h2>
      <div className="space-y-3">
        {[
          "Understand the scope and significance of the African tourism industry.",
          "Identify key tourist destinations across different African regions.",
          "Recognize the unique cultural, geographical, and environmental characteristics of African destinations.",
          "Analyze tourism growth trends and the impact of tourism on local economies."
        ].map((objective, index) => (
          <div key={index} className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <p>{objective}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold">Topics Covered</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { title: "Overview of the African Tourism Industry", icon: <Globe className="h-5 w-5 text-bantu-orange" /> },
          { title: "Key Tourist Destinations Across Africa", icon: <Map className="h-5 w-5 text-bantu-orange" /> },
          { title: "Understanding Regional Differences", icon: <Globe className="h-5 w-5 text-bantu-orange" /> },
          { title: "Tourism Statistics and Growth Trends", icon: <BarChart className="h-5 w-5 text-bantu-orange" /> },
        ].map((topic, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex gap-3 items-center">
              <div className="bg-bantu-orange/10 p-2 rounded-full h-10 w-10 flex items-center justify-center">
                {topic.icon}
              </div>
              <h3 className="font-medium">{topic.title}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={onNext} className="bg-bantu-orange hover:bg-bantu-orange/90">
          Start Learning
        </Button>
      </div>
    </div>
  );
};

export default ModuleOverview;
