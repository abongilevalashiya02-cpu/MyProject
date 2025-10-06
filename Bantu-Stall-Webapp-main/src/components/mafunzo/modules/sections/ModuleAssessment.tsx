
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Award, FileText, ExternalLink, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ModuleAssessmentProps {
  onNext: () => void;
  onPrevious: () => void;
}

const ModuleAssessment: React.FC<ModuleAssessmentProps> = ({ onNext, onPrevious }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: number]: number}>({});
  const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [score, setScore] = useState(0);

  const assessmentQuestions = [
    {
      question: "Which of the following is a key characteristic of tourism in North Africa?",
      options: [
        "Focus primarily on wildlife safaris", 
        "Strong emphasis on cultural and historical sites", 
        "Limited tourism infrastructure development", 
        "Predominantly rainforest-based attractions"
      ],
      correctAnswer: 1
    },
    {
      question: "What was the approximate contribution of tourism to African GDP in 2019?",
      options: ["$69 billion", "$169 billion", "$269 billion", "$369 billion"],
      correctAnswer: 1
    },
    {
      question: "Which region in Africa is known for the Great Migration of wildebeest?",
      options: ["Southern Africa", "West Africa", "East Africa", "North Africa"],
      correctAnswer: 2
    },
    {
      question: "What is a significant challenge for tourism development in many African countries?",
      options: [
        "Lack of natural attractions", 
        "Insufficient cultural diversity", 
        "Infrastructure limitations", 
        "Overabundance of tourists"
      ],
      correctAnswer: 2
    },
    {
      question: "Which of the following is an emerging trend in African tourism?",
      options: [
        "Decreasing interest in eco-tourism", 
        "Declining domestic tourism", 
        "Growth in sustainable and responsible tourism", 
        "Reduced digital booking platforms"
      ],
      correctAnswer: 2
    }
  ];

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: answerIndex
    });
  };

  const moveToNextQuestion = () => {
    if (currentQuestion < assessmentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const moveToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitAssessment = () => {
    setIsSubmitting(true);
    
    // Calculate score
    let correctAnswers = 0;
    for (let i = 0; i < assessmentQuestions.length; i++) {
      if (selectedAnswers[i] === assessmentQuestions[i].correctAnswer) {
        correctAnswers++;
      }
    }
    
    const percentage = Math.round((correctAnswers / assessmentQuestions.length) * 100);
    
    // Simulate API call delay
    setTimeout(() => {
      setScore(percentage);
      setAssessmentSubmitted(true);
      setIsSubmitting(false);
    }, 1500);
  };

  const answeredQuestionsCount = Object.keys(selectedAnswers).length;
  const progressPercentage = (answeredQuestionsCount / assessmentQuestions.length) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-blue-900">
          Module 1 Assessment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!assessmentSubmitted ? (
          <>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="font-bold">Final Assessment</h3>
                  <p className="text-sm text-gray-600">Complete all questions to receive your certification</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{answeredQuestionsCount} of {assessmentQuestions.length} answered</p>
                  <p className="text-sm text-gray-600">Question {currentQuestion + 1} of {assessmentQuestions.length}</p>
                </div>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>

            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-xl font-medium mb-6">{assessmentQuestions[currentQuestion].question}</h3>
              
              <div className="space-y-3 mb-8">
                {assessmentQuestions[currentQuestion].options.map((option, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors
                      ${selectedAnswers[currentQuestion] === index ? 'border-bantu-orange bg-bantu-orange/5' : 'hover:bg-gray-50'}
                    `}
                    onClick={() => handleAnswerSelect(currentQuestion, index)}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                      ${selectedAnswers[currentQuestion] === index ? 'border-bantu-orange' : 'border-gray-300'}
                    `}>
                      {selectedAnswers[currentQuestion] === index && (
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
                    disabled={currentQuestion === 0}
                    onClick={moveToPreviousQuestion}
                  >
                    Previous
                  </Button>
                  {currentQuestion < assessmentQuestions.length - 1 ? (
                    <Button 
                      variant="outline" 
                      onClick={moveToNextQuestion}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button 
                      className="bg-bantu-orange hover:bg-bantu-orange/90"
                      disabled={answeredQuestionsCount < assessmentQuestions.length || isSubmitting}
                      onClick={handleSubmitAssessment}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        'Submit Assessment'
                      )}
                    </Button>
                  )}
                </div>
                
                {currentQuestion < assessmentQuestions.length - 1 && (
                  <Button 
                    className="bg-bantu-orange hover:bg-bantu-orange/90"
                    disabled={answeredQuestionsCount < assessmentQuestions.length || isSubmitting}
                    onClick={handleSubmitAssessment}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Assessment'
                    )}
                  </Button>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center p-4 bg-green-100 rounded-full mb-4">
              <Award className="h-12 w-12 text-bantu-orange" />
            </div>
            
            <h2 className="text-2xl font-bold mb-2">Assessment Complete!</h2>
            <p className="text-gray-600 mb-6">Congratulations on completing the module assessment</p>
            
            <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto mb-8">
              <h3 className="font-bold mb-4">Your Results</h3>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Score</span>
                  <span className="font-medium">{score}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div 
                    className={`h-2 rounded-full ${score >= 70 ? 'bg-green-500' : 'bg-amber-500'}`} 
                    style={{ width: `${score}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="text-center">
                {score >= 70 ? (
                  <div className="flex items-center justify-center gap-2 text-green-600 font-medium">
                    <CheckCircle className="h-5 w-5" />
                    <span>Passed</span>
                  </div>
                ) : (
                  <p className="text-amber-600 font-medium">
                    Almost there! You need 70% to pass.
                  </p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {score >= 70 ? (
                <Card className="text-left">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <FileText className="h-5 w-5 text-bantu-orange" />
                      <h3 className="font-bold">Certificate Available</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Your certificate of completion for Module 1 is now available to download or share.
                    </p>
                    <div className="flex gap-2">
                      <Button className="flex-1">
                        Download
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Share
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="text-left">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <FileText className="h-5 w-5 text-amber-500" />
                      <h3 className="font-bold">Retry Assessment</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Review the module materials and try the assessment again to earn your certificate.
                    </p>
                    <Button onClick={() => {
                      setAssessmentSubmitted(false);
                      setSelectedAnswers({});
                      setCurrentQuestion(0);
                    }}>
                      Retry Assessment
                    </Button>
                  </CardContent>
                </Card>
              )}
              
              <Card className="text-left">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <ExternalLink className="h-5 w-5 text-blue-600" />
                    <h3 className="font-bold">Continue Learning</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Move on to Module 2 to continue your journey in African Tourism.
                  </p>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Next Module
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </CardContent>

      {!assessmentSubmitted && (
        <div className="flex justify-between p-6">
          <Button variant="outline" onClick={onPrevious}>
            Previous: Interactive Activities
          </Button>
        </div>
      )}
    </Card>
  );
};

export default ModuleAssessment;
