
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const AdminExperiences = () => {
  const [experiences, setExperiences] = useState([]);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Manage Experiences</h2>
            <p className="text-gray-600">Create and edit cultural experiences for travelers</p>
          </div>
          <Button className="bg-bantu-orange hover:bg-bantu-orange/90">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Experience
          </Button>
        </div>

        <div className="p-8 text-center">
          <p className="text-gray-500">
            This is where you'll manage all travel and cultural experiences. <br />
            The full implementation will include creating, editing, and publishing experiences.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminExperiences;
