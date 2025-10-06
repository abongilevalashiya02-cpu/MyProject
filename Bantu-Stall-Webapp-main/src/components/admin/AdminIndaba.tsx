
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

const AdminIndaba = () => {
  const [articles, setArticles] = useState([]);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Manage Indaba Articles</h2>
            <p className="text-gray-600">Create and edit articles for Indaba</p>
          </div>
          <Button className="bg-bantu-orange hover:bg-bantu-orange/90">
            <FileText className="mr-2 h-4 w-4" />
            New Article
          </Button>
        </div>

        <div className="p-8 text-center">
          <p className="text-gray-500">
            This is where you'll manage all articles for the Indaba section. <br />
            The full implementation will include creating, editing, and publishing articles.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminIndaba;
