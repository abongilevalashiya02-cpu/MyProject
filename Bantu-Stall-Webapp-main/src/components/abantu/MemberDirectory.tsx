
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, UserPlus } from 'lucide-react';
import { MemberType } from '@/types/marketplace';

// Sample data for demonstration
const members: MemberType[] = [
  {
    id: 1,
    name: 'Amara Okafor',
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
    role: 'Fashion Entrepreneur',
    company: 'AfroStyle Fashion',
    location: 'Lagos, Nigeria',
    industry: 'Textiles & Fashion',
    connections: 156
  },
  {
    id: 2,
    name: 'David Mwangi',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
    role: 'Tech Startup Founder',
    company: 'AfriTech Solutions',
    location: 'Nairobi, Kenya',
    industry: 'Technology',
    connections: 201
  },
  {
    id: 3,
    name: 'Fatima Nkosi',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
    role: 'Tourism Director',
    company: 'Safari Expeditions',
    location: 'Cape Town, South Africa',
    industry: 'Tourism & Travel',
    connections: 178
  },
  {
    id: 4,
    name: 'Ibrahim Diallo',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
    role: 'Agricultural Exporter',
    company: 'WestAfrica Produce',
    location: 'Accra, Ghana',
    industry: 'Agriculture',
    connections: 132
  },
  {
    id: 5,
    name: 'Zainab Mohammed',
    avatar: 'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1889&q=80',
    role: 'Fintech Consultant',
    company: 'Digital Payments Africa',
    location: 'Cairo, Egypt',
    industry: 'Finance',
    connections: 198
  },
  {
    id: 6,
    name: 'Kwame Agyei',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
    role: 'Renewable Energy Developer',
    company: 'SunPower Ghana',
    location: 'Kumasi, Ghana',
    industry: 'Energy',
    connections: 145
  }
];

const MemberDirectory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  
  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         member.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.industry.toLowerCase().includes(searchTerm.toLowerCase());
                         
    if (filter === 'all') return matchesSearch;
    return matchesSearch && member.industry.toLowerCase().includes(filter.toLowerCase());
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Member Directory</h2>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Connect
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search members by name, company, or industry" 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="technology">Tech</TabsTrigger>
            <TabsTrigger value="fashion">Fashion</TabsTrigger>
            <TabsTrigger value="agriculture">Agriculture</TabsTrigger>
            <TabsTrigger value="tourism">Tourism</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map(member => (
          <Card key={member.id} className="overflow-hidden hover:shadow-md transition-shadow card-hover">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center mb-4">
                <Avatar className="h-20 w-20 mb-4">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <h3 className="font-bold text-lg">{member.name}</h3>
                <p className="text-gray-600 text-sm">{member.role}</p>
                <p className="text-gray-500 text-sm">{member.company}</p>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-center gap-2 text-sm">
                  <Badge variant="outline" className="bg-gray-50">
                    {member.industry}
                  </Badge>
                  <Badge variant="outline" className="bg-gray-50">
                    {member.location}
                  </Badge>
                </div>
                
                <p className="text-center text-sm text-gray-500">
                  {member.connections} connections
                </p>
              </div>
              
              <Button variant="outline" className="w-full">
                View Profile
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MemberDirectory;
