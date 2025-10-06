
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface ResourceCardProps {
  icon: React.ReactNode;
  title: string;
  type: string;
  description: string;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ 
  icon, 
  title, 
  type, 
  description 
}) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardContent className="p-4 flex gap-3">
      <div className="bg-bantu-orange/10 p-2 rounded-full h-10 w-10 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <h4 className="font-medium text-sm">{title}</h4>
        <div className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full inline-block mb-1">
          {type}
        </div>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </CardContent>
  </Card>
);
