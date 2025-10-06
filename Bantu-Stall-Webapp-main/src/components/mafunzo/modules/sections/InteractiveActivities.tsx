
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, X, Map, FileText, Video, Gamepad2 } from "lucide-react";

interface InteractiveActivitiesProps {
  onNext: () => void;
  onPrevious: () => void;
}

const InteractiveActivities: React.FC<InteractiveActivitiesProps> = ({ onNext, onPrevious }) => {
  const [activeQuiz, setActiveQuiz] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: number]: number}>({});
  const [showResults, setShowResults] = useState(false);

  const quizQuestions = [
    {
      question: "Which African country is home to the Great Migration?",
      options: ["Kenya", "Tanzania", "Both Kenya and Tanzania", "South Africa"],
      correctAnswer: 2
    },
    {
      question: "What percentage of Africa's GDP comes from tourism (pre-pandemic)?",
      options: ["2.9%", "5.6%", "8.5%", "12.1%"],
      correctAnswer: 1
    },
    {
      question: "Which of these is NOT one of the major tourism regions in Africa?",
      options: ["North Africa", "Central Africa", "East Africa", "Southern Africa"],
      correctAnswer: 1
    }
  ];

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: answerIndex
    });
  };

  const checkResults = () => {
    setShowResults(true);
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setShowResults(false);
  };

  const moveToNextQuiz = () => {
    if (activeQuiz < quizQuestions.length - 1) {
      setActiveQuiz(activeQuiz + 1);
      setShowResults(false);
    }
  };

  const moveToPreviousQuiz = () => {
    if (activeQuiz > 0) {
      setActiveQuiz(activeQuiz - 1);
      setShowResults(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-blue-900">
          5. Interactive Activities
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-gray-600">
          Test your knowledge and engage with the material through these interactive activities.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-100 p-2 rounded-full">
                  <Map className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="font-bold">Destination Mapping</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Interactive map activity where you can identify key tourist destinations 
                across Africa and learn about their unique features.
              </p>
              <Button className="w-full">Launch Activity</Button>
            </CardContent>
          </Card>

          <Card className="border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-2 rounded-full">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-bold">Case Study Analysis</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Analyze real-world case studies of successful tourism initiatives 
                in different African regions and identify key success factors.
              </p>
              <Button className="w-full">Start Analysis</Button>
            </CardContent>
          </Card>

          <Card className="border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-amber-100 p-2 rounded-full">
                  <Video className="h-5 w-5 text-amber-600" />
                </div>
                <h3 className="font-bold">Virtual Tour Experience</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Take a virtual tour of famous African landmarks and tourist 
                destinations with interactive 360° video technology.
              </p>
              <Button className="w-full">Begin Tour</Button>
            </CardContent>
          </Card>

          <Card className="border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-100 p-2 rounded-full">
                  <Gamepad2 className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="font-bold">Tourism Simulation</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Run a simulated tourism business in Africa, making strategic decisions 
                about attractions, marketing, and sustainability.
              </p>
              <Button className="w-full">Play Simulation</Button>
            </CardContent>
          </Card>
        </div>

        <div className="border rounded-lg overflow-hidden mb-6">
          <div className="bg-gray-50 p-4 border-b">
            <h3 className="font-bold flex items-center gap-2">
              <Gamepad2 className="h-5 w-5 text-bantu-orange" />
              Knowledge Quiz
            </h3>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Test your understanding of key concepts</span>
              <span>Question {activeQuiz + 1} of {quizQuestions.length}</span>
            </div>
          </div>
          
          <div className="p-6">
            <h4 className="font-medium text-lg mb-4">{quizQuestions[activeQuiz].question}</h4>
            <div className="space-y-3 mb-6">
              {quizQuestions[activeQuiz].options.map((option, index) => (
                <div 
                  key={index} 
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors
                    ${selectedAnswers[activeQuiz] === index ? 'border-bantu-orange bg-bantu-orange/5' : 'hover:bg-gray-50'}
                    ${showResults && index === quizQuestions[activeQuiz].correctAnswer ? 'border-green-500 bg-green-50' : ''}
                    ${showResults && selectedAnswers[activeQuiz] === index && index !== quizQuestions[activeQuiz].correctAnswer ? 'border-red-500 bg-red-50' : ''}
                  `}
                  onClick={() => !showResults && handleAnswerSelect(activeQuiz, index)}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                    ${selectedAnswers[activeQuiz] === index ? 'border-bantu-orange' : 'border-gray-300'}
                    ${showResults && index === quizQuestions[activeQuiz].correctAnswer ? 'border-green-500' : ''}
                    ${showResults && selectedAnswers[activeQuiz] === index && index !== quizQuestions[activeQuiz].correctAnswer ? 'border-red-500' : ''}
                  `}>
                    {showResults && index === quizQuestions[activeQuiz].correctAnswer && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                    {showResults && selectedAnswers[activeQuiz] === index && index !== quizQuestions[activeQuiz].correctAnswer && (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                    {!showResults && selectedAnswers[activeQuiz] === index && (
                      <div className="w-3 h-3 rounded-full bg-bantu-orange"></div>
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between">
              <div className="space-x-2">
                <Button 
                  variant="outline" 
                  disabled={activeQuiz === 0}
                  onClick={moveToPreviousQuiz}
                >
                  Previous
                </Button>
                <Button 
                  variant="outline" 
                  disabled={activeQuiz === quizQuestions.length - 1}
                  onClick={moveToNextQuiz}
                >
                  Next
                </Button>
              </div>
              
              {!showResults ? (
                <Button onClick={checkResults} disabled={selectedAnswers[activeQuiz] === undefined}>
                  Check Answer
                </Button>
              ) : (
                <Button onClick={resetQuiz}>
                  Try Again
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-bantu-orange/10 p-6 rounded-lg">
          <h3 className="font-bold text-lg mb-4">Reflection Exercise</h3>
          <p className="mb-4">
            Take a moment to reflect on what you've learned about African tourism and how 
            you might apply these insights in your work or travels.
          </p>
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-2">
                What was the most surprising fact you learned about African tourism?
              </label>
              <textarea 
                className="w-full p-3 border rounded-md" 
                rows={3}
                placeholder="Share your thoughts..."
              ></textarea>
            </div>
            <div>
              <label className="block font-medium mb-2">
                How might you incorporate what you've learned into your professional practice?
              </label>
              <textarea 
                className="w-full p-3 border rounded-md" 
                rows={3}
                placeholder="Describe your approach..."
              ></textarea>
            </div>
          </div>
        </div>
      </CardContent>

      <div className="flex justify-between p-6">
        <Button variant="outline" onClick={onPrevious}>
          Previous: Tourism Statistics
        </Button>
        <Button onClick={onNext} className="bg-bantu-orange hover:bg-bantu-orange/90">
          Next: Module Assessment
        </Button>
      </div>
    </Card>
  );
};

export default InteractiveActivities;
