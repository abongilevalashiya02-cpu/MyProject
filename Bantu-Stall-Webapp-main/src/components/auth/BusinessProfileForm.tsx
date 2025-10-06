
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { authLogger } from '@/utils/logger';

interface BusinessProfileFormProps {
  onComplete: () => void;
}

const BusinessProfileForm: React.FC<BusinessProfileFormProps> = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    jobTitle: '',
    companySize: '',
    linkedinProfileUrl: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('business_profiles')
        .insert([{
          user_id: user.id,
          company_name: formData.companyName,
          job_title: formData.jobTitle,
          company_size: formData.companySize,
          linkedin_profile_url: formData.linkedinProfileUrl || null
        }]);

      if (error) throw error;

      toast({
        title: "Profile completed!",
        description: "Welcome to your Retreat Planning Dashboard",
      });

      onComplete();
    } catch (error: any) {
      authLogger.error('Error creating business profile', error);
      toast({
        title: "Error",
        description: "Failed to save your business profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Complete Your Business Profile</CardTitle>
          <p className="text-gray-600 text-center">
            Help us personalize your retreat planning experience
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title / Role *</Label>
              <Input
                id="jobTitle"
                value={formData.jobTitle}
                onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companySize">Company Size *</Label>
              <Select value={formData.companySize} onValueChange={(value) => setFormData(prev => ({ ...prev, companySize: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select company size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">1-10 employees</SelectItem>
                  <SelectItem value="11-50">11-50 employees</SelectItem>
                  <SelectItem value="51-200">51-200 employees</SelectItem>
                  <SelectItem value="201-1000">201-1000 employees</SelectItem>
                  <SelectItem value="1000+">1000+ employees</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedinProfileUrl">LinkedIn Profile URL (Optional)</Label>
              <Input
                id="linkedinProfileUrl"
                type="url"
                placeholder="https://www.linkedin.com/in/yourprofile"
                value={formData.linkedinProfileUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, linkedinProfileUrl: e.target.value }))}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-bantu-orange hover:bg-bantu-orange/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Complete Profile & Access Dashboard'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessProfileForm;
