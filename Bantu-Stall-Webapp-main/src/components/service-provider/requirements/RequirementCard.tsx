
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Info, Download, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { BusinessType } from './businessTypesData';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface RequirementCardProps {
  businessType: BusinessType;
}

const RequirementCard: React.FC<RequirementCardProps> = ({ businessType }) => {
  const [showExemptions, setShowExemptions] = useState(false);
  const IconComponent = businessType.icon;
  const navigate = useNavigate();

  const handleDownloadChecklist = () => {
    // Process checklist download
    toast.success(`Checklist for ${businessType.title} downloaded!`);
  };

  const handleStartApplication = () => {
    // Process application start
    navigate('/service-provider/apply');
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      {/* Header Strip */}
      <CardHeader className="bg-bantu-orange text-white rounded-t-lg">
        <div className="flex items-center space-x-3">
          <IconComponent className="h-6 w-6" />
          <div>
            <h2 className="text-xl font-semibold">
              {businessType.title}
            </h2>
            <p className="text-orange-100 text-sm">{businessType.subtitle}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Who qualifies section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Who qualifies?</h3>
          <ul className="space-y-2">
            {businessType.description.map((desc, index) => (
              <li key={index} className="flex items-start">
                <span className="text-bantu-orange mr-2 mt-1">▸</span>
                <span className="text-gray-700">{desc}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Mandatory paperwork */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            <strong>Minimum paperwork you must upload</strong>
          </h3>
          <hr className="border-gray-300 mb-4" />
          
          <div className="space-y-3">
            {businessType.mandatory.map((item, index) => (
              <div key={index} className="flex items-start space-x-3">
                <Checkbox className="mt-1" />
                <div className="flex-1">
                  <label className="text-gray-900 font-medium cursor-pointer">
                    {item.label}
                  </label>
                  {item.description && (
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nice-to-have section */}
        {businessType.optional.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-600 mb-3">
              <strong>Nice-to-have (fast-track approval)</strong>
            </h3>
            
            <div className="space-y-3">
              {businessType.optional.map((item, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-4 h-4 border border-gray-400 rounded mt-1" />
                  <div className="flex-1">
                    <label className="text-gray-700 cursor-pointer">
                      {item.label}
                    </label>
                    {item.description && (
                      <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Exemptions info */}
        {businessType.exemptions && (
          <div className="mb-6">
            <Collapsible open={showExemptions} onOpenChange={setShowExemptions}>
              <CollapsibleTrigger className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
                <Info className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Why no CIPC / B-BBEE docs here?
                </span>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">{businessType.exemptions}</p>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button 
            variant="outline" 
            onClick={handleDownloadChecklist}
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Download checklist PDF</span>
          </Button>
          
          <Button 
            onClick={handleStartApplication}
            className="bg-bantu-orange hover:bg-bantu-orange/90 flex items-center space-x-2"
          >
            <span>Start my application</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RequirementCard;
