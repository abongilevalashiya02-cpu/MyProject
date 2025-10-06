import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Clock, Target } from 'lucide-react';

interface FormData {
  eventType: string;
  attendeeCount: string;
  duration: string;
  objectives: string[];
}

interface StepBasicInfoProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

const EVENT_TYPES = [
  'Corporate Team Building',
  'Leadership Retreat', 
  'Strategic Planning',
  'Company Offsite',
  'Training Workshop',
  'Client Event',
  'Board Meeting',
  'Conference',
  'Wellness Retreat',
  'Custom Event'
];

const OBJECTIVES = [
  'Team Building & Collaboration',
  'Strategic Planning',
  'Leadership Development', 
  'Skills Training',
  'Culture Building',
  'Innovation Workshop',
  'Problem Solving',
  'Wellness & Relaxation',
  'Networking',
  'Celebration'
];

export default function StepBasicInfo({ formData, updateFormData }: StepBasicInfoProps) {
  const handleObjectiveChange = (objective: string, checked: boolean) => {
    const updatedObjectives = checked
      ? [...formData.objectives, objective]
      : formData.objectives.filter(obj => obj !== objective);
    
    updateFormData({ objectives: updatedObjectives });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Event Details
        </h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="eventType">Event Type *</Label>
            <Select
              value={formData.eventType}
              onValueChange={(value) => updateFormData({ eventType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                {EVENT_TYPES.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="attendeeCount" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Number of Attendees *
              </Label>
              <Select
                value={formData.attendeeCount}
                onValueChange={(value) => updateFormData({ attendeeCount: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select group size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5-10">5-10 people</SelectItem>
                  <SelectItem value="11-25">11-25 people</SelectItem>
                  <SelectItem value="26-50">26-50 people</SelectItem>
                  <SelectItem value="51-100">51-100 people</SelectItem>
                  <SelectItem value="100+">100+ people</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="duration" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Duration *
              </Label>
              <Select
                value={formData.duration}
                onValueChange={(value) => updateFormData({ duration: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.5">Half Day (4 hours)</SelectItem>
                  <SelectItem value="1">Full Day (8 hours)</SelectItem>
                  <SelectItem value="2">2 Days</SelectItem>
                  <SelectItem value="3">3 Days</SelectItem>
                  <SelectItem value="5">1 Week (5 days)</SelectItem>
                  <SelectItem value="custom">Custom Duration</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div>
        <Label className="text-base font-medium">Event Objectives</Label>
        <p className="text-sm text-muted-foreground mb-4">
          Select all that apply to help us tailor your experience
        </p>
        
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {OBJECTIVES.map((objective) => (
                <div key={objective} className="flex items-center space-x-2">
                  <Checkbox
                    id={objective}
                    checked={formData.objectives.includes(objective)}
                    onCheckedChange={(checked) => 
                      handleObjectiveChange(objective, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={objective}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {objective}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}