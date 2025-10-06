
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookPlus } from 'lucide-react';

const AdminLearning = () => {
  const [modules, setModules] = useState([]);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Manage Learning Modules</h2>
            <p className="text-gray-600">Create and edit educational content for users</p>
          </div>
          <Button className="bg-bantu-orange hover:bg-bantu-orange/90">
            <BookPlus className="mr-2 h-4 w-4" />
            New Module
          </Button>
        </div>

        <div className="p-8 text-center">
          <p className="text-gray-500">
            This is where you'll manage all learning modules and educational content. <br />
            The full implementation will include creating, editing, and publishing learning materials.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminLearning;
