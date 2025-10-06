
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Award, GraduationCap, Trophy, Share2, Clock, Calendar } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

const badges = [
  {
    id: 1,
    name: "Msafiri wa Utamaduni",
    description: "Cultural Explorer",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    acquired: true,
    color: "from-orange-500 to-yellow-500",
    date: "June 5, 2023"
  },
  {
    id: 2,
    name: "Kiongozi wa Afrika",
    description: "African Leadership",
    image: "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?ixlib=rb-1.2.1&auto=format&fit=crop&w=1567&q=80",
    acquired: true,
    color: "from-blue-500 to-indigo-500",
    date: "May 23, 2023"
  },
  {
    id: 3,
    name: "Mjenzi wa Timu",
    description: "Team Builder",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    acquired: false,
    progress: 65,
    color: "from-emerald-500 to-green-500",
    requirements: ["Complete Team Building course", "Participate in 2 group activities", "Submit final reflection"]
  },
  {
    id: 4,
    name: "Mwanafunzi wa Lugha",
    description: "Language Learner",
    image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    acquired: false,
    progress: 30,
    color: "from-purple-500 to-pink-500",
    requirements: ["Complete language basics course", "Pass vocabulary assessment", "Record conversation practice"]
  }
];

const certifications = [
  {
    id: 1,
    title: "Cultural Immersion Specialist",
    issueDate: "June 10, 2023",
    expiry: "June 10, 2025",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    description: "Recognizes proficiency in understanding and navigating diverse cultural contexts across Africa.",
    badgesRequired: ["Msafiri wa Utamaduni", "Mwanafunzi wa Lugha"]
  },
  {
    id: 2,
    title: "Cross-Cultural Leadership",
    issueDate: "May 25, 2023",
    expiry: "May 25, 2025",
    image: "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    description: "Certifies excellence in leading diverse teams and projects across cultural boundaries.",
    badgesRequired: ["Kiongozi wa Afrika", "Mjenzi wa Timu"]
  }
];

const Certifications = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Badges & Certifications</h2>
        <Button variant="outline">
          <Share2 className="mr-2 h-4 w-4" />
          Share Achievements
        </Button>
      </div>
      
      {/* Badges Section */}
      <div className="mb-10">
        <h3 className="text-lg font-medium mb-4">Your Badges</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((badge) => (
            <Card key={badge.id} className={`overflow-hidden ${badge.acquired ? 'card-hover' : 'opacity-80'}`}>
              <div className="relative">
                <div className={`absolute inset-0 bg-gradient-to-r ${badge.color} opacity-20`}></div>
                <div className="aspect-square relative flex flex-col items-center justify-center p-6">
                  <div className={`w-24 h-24 rounded-full mb-3 bg-gradient-to-r ${badge.color} flex items-center justify-center shadow-lg`}>
                    {badge.acquired ? (
                      <Award className="h-12 w-12 text-white" />
                    ) : (
                      <GraduationCap className="h-12 w-12 text-white/80" />
                    )}
                  </div>
                  <h4 className="font-bold text-center mb-1">{badge.name}</h4>
                  <p className="text-sm text-gray-500 text-center">{badge.description}</p>
                  
                  {badge.acquired ? (
                    <Badge className="mt-3 bg-green-100 text-green-800 border-none">
                      Acquired on {badge.date}
                    </Badge>
                  ) : (
                    <div className="mt-3 w-full">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-500">Progress</span>
                        <span className="text-xs font-medium">{badge.progress}%</span>
                      </div>
                      <Progress value={badge.progress} className="h-1.5" />
                    </div>
                  )}
                </div>
              </div>
              
              {!badge.acquired && badge.requirements && (
                <>
                  <Separator />
                  <CardContent className="p-3">
                    <p className="text-xs text-gray-500 mb-2">Requirements:</p>
                    <ul className="text-xs space-y-1">
                      {badge.requirements.map((req, i) => (
                        <li key={i} className="flex items-start">
                          <span className="inline-block w-1 h-1 bg-gray-400 rounded-full mt-1.5 mr-2"></span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </>
              )}
            </Card>
          ))}
        </div>
      </div>
      
      {/* Certifications Section */}
      <div>
        <h3 className="text-lg font-medium mb-4">Your Certifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certifications.map((cert) => (
            <Card key={cert.id} className="overflow-hidden card-hover">
              <div className="aspect-video relative">
                <img
                  src={cert.image}
                  alt={cert.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-bold text-xl mb-1">{cert.title}</h3>
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>Issued: {cert.issueDate}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>Expires: {cert.expiry}</span>
                    </div>
                  </div>
                </div>
                
                <div className="absolute top-4 right-4">
                  <Badge className="bg-white/80 text-black hover:bg-white/90 border-none">
                    <Trophy className="h-3 w-3 mr-1 text-bantu-orange" />
                    Certified
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-4">
                <p className="text-sm text-gray-600 mb-4">{cert.description}</p>
                
                <div>
                  <p className="text-sm font-medium mb-2">Required Badges:</p>
                  <div className="flex gap-2">
                    {cert.badgesRequired.map((badge, i) => (
                      <Badge key={i} variant="outline" className="bg-gray-50">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="border-t px-4 py-3 bg-gray-50">
                <div className="w-full flex justify-between items-center">
                  <p className="text-xs text-gray-500">
                    Mafunzo Learning Platform
                  </p>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
          
          <Card className="border-dashed border-2 flex flex-col items-center justify-center p-8">
            <div className="text-center mb-4">
              <div className="bg-gray-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <Award className="h-8 w-8 text-gray-400" />
              </div>
              <h4 className="font-medium mb-2">Earn More Certifications</h4>
              <p className="text-sm text-gray-500">Complete courses and earn badges to unlock new certifications</p>
            </div>
            <Button variant="outline">
              Explore Available Certifications
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Certifications;
