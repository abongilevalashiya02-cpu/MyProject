import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, X, Send, Bot, User, Loader2, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  type: 'user' | 'bot' | 'system';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface ConversationContext {
  messages: Message[];
  userInfo?: {
    email?: string;
    name?: string;
    interests?: string[];
  };
}

const preloadedQuestions = [
  "What services does Bantu Stall offer?",
  "How do I book a retreat or venue?",
  "What are your pricing options?",
  "Do you offer corporate team building?",
  "What destinations are available?",
  "How do I become a service provider?",
  "What is included in retreat packages?",
  "Can I customize my booking experience?"
];

const faqResponses = {
  "What services does Bantu Stall offer?": "Bantu Stall offers comprehensive retreat planning, venue bookings, cultural experiences, team building activities, and connects you with local service providers across Africa for authentic travel experiences.",
  "How do I book a retreat or venue?": "You can book through our quotation system by selecting your preferences and submitting a request. Our team will provide personalized quotes within 24 hours.",
  "What are your pricing options?": "Our pricing varies based on group size, duration, venue type, and services. Request a custom quote for detailed pricing through our quotation system.",
  "Do you offer corporate team building?": "Yes! We specialize in corporate retreats and team building experiences across various African destinations, combining professional development with cultural immersion.",
  "What destinations are available?": "We offer experiences across multiple African countries including South Africa, Kenya, Tanzania, Ghana, and more. Each destination features unique cultural experiences and venues.",
  "How do I become a service provider?": "Visit our 'List Property' page to apply as a service provider. We welcome accommodations, activity providers, facilitators, and local experience creators.",
  "What is included in retreat packages?": "Packages typically include accommodation, meals, activities, local transportation, cultural experiences, and dedicated support. Specific inclusions vary by package and can be customized.",
  "Can I customize my booking experience?": "Absolutely! We specialize in creating personalized experiences. Share your requirements through our quotation system, and we'll tailor everything to your needs."
};

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showChatArea, setShowChatArea] = useState(true); // Always show chat area
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi there! 👋 I'm your Bantu Stall assistant. I'm here to help you with bookings, destinations, and any questions about our services. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState(preloadedQuestions.slice(0, 3));
  const [conversationHistory, setConversationHistory] = useState<{ role: string; content: string }[]>([]);
  const [showHandoffOption, setShowHandoffOption] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateTyping = (content: string): Promise<void> => {
    return new Promise((resolve) => {
      setIsTyping(true);
      // Simulate human-like typing speed
      const typingDuration = Math.min(content.length * 50, 3000);
      setTimeout(() => {
        setIsTyping(false);
        resolve();
      }, typingDuration);
    });
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setConversationHistory(prev => [...prev, { role: 'user', content }]);
    setInputValue('');

    // Check for pre-loaded response first
    if (faqResponses[content as keyof typeof faqResponses]) {
      await simulateTyping(faqResponses[content as keyof typeof faqResponses]);
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: faqResponses[content as keyof typeof faqResponses],
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setConversationHistory(prev => [...prev, { role: 'assistant', content: botResponse.content }]);
      
      // Update suggested questions
      const remaining = preloadedQuestions.filter(q => q !== content);
      setSuggestedQuestions(remaining.slice(0, 3));
      return;
    }

    // For dynamic questions, call AI service with full conversation context
    try {
      await simulateTyping("Let me help you with that...");
      
      const response = await supabase.functions.invoke('chat-support', {
        body: { 
          message: content,
          conversationHistory: conversationHistory.slice(-10) // Keep last 10 exchanges for context
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const data = response.data;
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: data.response || "I apologize, but I'm having trouble processing your request right now. Please try again or contact our support team directly.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setConversationHistory(prev => [...prev, { role: 'assistant', content: botResponse.content }]);

      // Check if bot suggests human handoff
      const shouldShowHandoff = data.response?.toLowerCase().includes('specialist') || 
                               data.response?.toLowerCase().includes('complex') ||
                               data.response?.toLowerCase().includes('connect you') ||
                               conversationHistory.length > 8; // Show after extended conversation

      setShowHandoffOption(shouldShowHandoff);

      // Generate new suggested questions based on conversation context
      generateContextualSuggestions(data.response);
      
    } catch (error) {
      console.error('Chat error:', error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "I'm experiencing technical difficulties. Please try again later or contact our support team at nontombi@bantustall.com for immediate assistance.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    }
  };

  const requestHumanHandoff = async () => {
    try {
      await supabase.functions.invoke('chat-support', {
        body: { 
          message: "Please connect me with a human specialist",
          conversationHistory,
          requestHandoff: true
        }
      });

      const handoffMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: "Perfect! I'm connecting you with one of our African travel specialists right now. They'll receive our entire conversation and will reach out to you shortly with personalized assistance. You can also email us directly at nontombi@bantustall.com if you prefer.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, handoffMessage]);
      setShowHandoffOption(false);
      
      // Here you could also trigger an email to the support team with conversation history
      
    } catch (error) {
      console.error('Handoff error:', error);
    }
  };

  const generateContextualSuggestions = (botResponse: string) => {
    const contextualQuestions = [
      "Tell me more about pricing options",
      "What destinations would you recommend?",
      "Can you help me plan a custom experience?",
      "What's the booking process like?",
      "Do you have group discounts?",
      "What cultural activities are included?"
    ];
    
    setSuggestedQuestions(contextualQuestions.slice(0, 3));
  };

  const handleSuggestedQuestion = (question: string) => {
    sendMessage(question);
  };

  return (
    <>
      {/* Chat Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20,
          delay: 1
        }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "h-14 w-14 rounded-full shadow-2xl transition-all duration-300",
            "bg-gradient-to-r from-bantu-orange to-bantu-coral",
            "hover:shadow-[0_0_30px_rgba(255,107,53,0.6)]",
            "border-2 border-white/20"
          )}
          size="icon"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-6 w-6 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <MessageCircle className="h-6 w-6 text-white" />
                <motion.div
                  className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.8, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-20 right-4 md:right-6 z-[60] w-[calc(100vw-2rem)] md:w-96 max-w-sm h-[65vh] md:h-[480px] max-h-[calc(100vh-140px)] bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.2)'
            }}
            initial={{ 
              opacity: 0, 
              scale: 0.8,
              y: 60,
              x: 30,
              rotateY: 15
            }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: 0,
              x: 0,
              rotateY: 0
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.8,
              y: 60,
              x: 30,
              rotateY: -15
            }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 25,
              duration: 0.4
            }}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-bantu-orange via-bantu-coral to-purple-500 p-4 text-white overflow-hidden">
              {/* Glassmorphism overlay */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              
              {/* Animated background particles */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-white/20 rounded-full"
                    animate={{
                      x: [0, 100, 0],
                      y: [0, -50, 0],
                      opacity: [0.2, 0.8, 0.2],
                      scale: [0.5, 1.2, 0.5]
                    }}
                    transition={{
                      duration: 3 + i * 0.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.3
                    }}
                    style={{
                      left: `${10 + i * 15}%`,
                      top: `${20 + (i % 3) * 20}%`
                    }}
                  />
                ))}
              </div>
              
              <div className="relative flex items-center gap-3">
                <motion.div
                  className="h-10 w-10 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30"
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  <Bot className="h-5 w-5" />
                </motion.div>
                <div>
                  <motion.h3 
                    className="font-bold text-base"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Bantu Stall AI
                  </motion.h3>
                  <motion.p 
                    className="text-xs opacity-90 flex items-center gap-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <motion.div
                      className="w-2 h-2 bg-green-400 rounded-full"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    Online & Ready
                  </motion.p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-white/50 to-white/80 backdrop-blur-sm" style={{ height: 'calc(100% - 220px)' }}>
              <div className="space-y-4">
                {/* Welcome message with immediate chat area */}
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
                  className="relative bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm p-4 rounded-2xl border border-blue-200/50 shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)',
                  }}
                >
                  {/* Floating orb animation */}
                  <motion.div
                    className="absolute top-2 right-2 w-3 h-3 bg-gradient-to-r from-bantu-orange to-bantu-coral rounded-full opacity-70"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  <p className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-3">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    >
                      <MessageCircle className="h-4 w-4 text-bantu-orange" />
                    </motion.div>
                    Ask me anything about Bantu Stall
                  </p>
                  <div className="space-y-3">
                    <p className="text-xs text-gray-600 font-medium">✨ Popular questions:</p>
                    <div className="grid grid-cols-1 gap-2">
                      {suggestedQuestions.slice(0, 3).map((question, index) => (
                        <motion.div
                          key={question}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                        >
                          <Badge
                            variant="outline"
                            className="w-full justify-start cursor-pointer hover:bg-gradient-to-r hover:from-bantu-orange hover:to-bantu-coral hover:text-white hover:border-transparent hover:shadow-lg transition-all duration-300 text-xs py-2 px-3 rounded-xl border-blue-300/60 text-blue-700 bg-white/60 backdrop-blur-sm"
                            onClick={() => handleSuggestedQuestion(question)}
                          >
                            <motion.span
                              whileHover={{ scale: 1.02 }}
                              className="truncate"
                            >
                              {question}
                            </motion.span>
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ 
                      opacity: 0, 
                      y: 30,
                      scale: 0.8 
                    }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      scale: 1 
                    }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 400, 
                      damping: 25,
                      delay: index * 0.1
                    }}
                    className={cn(
                      "flex gap-3 items-end",
                      message.type === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    {message.type === 'bot' && (
                      <motion.div 
                        className="h-8 w-8 bg-gradient-to-r from-bantu-orange to-bantu-coral rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg border-2 border-white/50"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Bot className="h-4 w-4 text-white" />
                      </motion.div>
                    )}
                    <motion.div
                      className={cn(
                        "max-w-[80%] p-3 text-sm leading-relaxed shadow-lg backdrop-blur-sm border",
                        message.type === 'user'
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl rounded-br-md border-blue-300/50"
                          : "bg-white/80 text-gray-800 rounded-2xl rounded-bl-md border-gray-200/50"
                      )}
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {message.content}
                    </motion.div>
                    {message.type === 'user' && (
                      <motion.div 
                        className="h-8 w-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg border-2 border-white/50"
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <User className="h-4 w-4 text-white" />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex gap-3 justify-start items-end"
                  >
                    <motion.div 
                      className="h-8 w-8 bg-gradient-to-r from-bantu-orange to-bantu-coral rounded-2xl flex items-center justify-center shadow-lg border-2 border-white/50"
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Bot className="h-4 w-4 text-white" />
                    </motion.div>
                    <div className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl rounded-bl-md border border-gray-200/50 shadow-lg">
                      <motion.div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 bg-gradient-to-r from-bantu-orange to-bantu-coral rounded-full"
                            animate={{ 
                              y: [0, -8, 0],
                              scale: [1, 1.2, 1],
                              opacity: [0.6, 1, 0.6]
                            }}
                            transition={{ 
                              duration: 1,
                              repeat: Infinity,
                              delay: i * 0.2,
                              ease: "easeInOut"
                            }}
                          />
                        ))}
                      </motion.div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Human Handoff Option */}
            {showHandoffOption && (
              <motion.div 
                className="px-4 py-3 border-t border-white/30 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  className="relative bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-blue-200/50 shadow-lg overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {/* Animated background gradient */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-50"
                    animate={{
                      x: [-100, 100, -100],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  <p className="relative text-sm text-gray-700 mb-3 font-medium">
                    🌟 Need personalized assistance? Connect with our specialists!
                  </p>
                  <Button
                    onClick={requestHumanHandoff}
                    variant="outline"
                    size="sm"
                    className="relative w-full bg-white/80 hover:bg-gradient-to-r hover:from-bantu-orange hover:to-bantu-coral hover:text-white border-blue-300/60 text-blue-700 text-sm h-10 font-medium transition-all duration-300 hover:shadow-lg hover:border-transparent backdrop-blur-sm"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Talk to Expert
                  </Button>
                </motion.div>
              </motion.div>
            )}


            {/* Input Section */}
            <div className="border-t border-white/30 bg-gradient-to-r from-white/60 to-white/40 backdrop-blur-xl">
              <div className="p-4">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Type your message..."
                      onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage(inputValue)}
                      className="w-full border-white/50 focus:border-bantu-orange focus:ring-bantu-orange/30 rounded-2xl text-sm h-12 bg-white/70 backdrop-blur-sm shadow-lg placeholder:text-gray-500 transition-all duration-300 focus:shadow-xl"
                      disabled={isTyping}
                    />
                    {/* Animated input glow */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl bg-gradient-to-r from-bantu-orange/20 to-bantu-coral/20 opacity-0 -z-10"
                      animate={inputValue ? { opacity: [0, 1, 0] } : { opacity: 0 }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={() => sendMessage(inputValue)}
                      size="icon"
                      className="bg-gradient-to-r from-bantu-orange to-bantu-coral hover:from-bantu-coral hover:to-purple-500 shadow-xl rounded-2xl h-12 w-12 transition-all duration-300 hover:shadow-2xl disabled:opacity-50 border-2 border-white/50"
                      disabled={!inputValue.trim() || isTyping}
                    >
                      <AnimatePresence mode="wait">
                        {isTyping ? (
                          <motion.div
                            key="loading"
                            initial={{ opacity: 0, rotate: -180 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: 180 }}
                          >
                            <Loader2 className="h-5 w-5 animate-spin text-white" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="send"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            whileHover={{ rotate: 15 }}
                          >
                            <Send className="h-5 w-5 text-white" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Button>
                  </motion.div>
                </div>
                
                {/* Additional suggested questions */}
                {suggestedQuestions.length > 3 && (
                  <motion.div 
                    className="mt-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex flex-wrap gap-2">
                      {suggestedQuestions.slice(3, 5).map((question, index) => (
                        <motion.div
                          key={question}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <Badge
                            variant="outline"
                            className="cursor-pointer hover:bg-gradient-to-r hover:from-bantu-orange hover:to-bantu-coral hover:text-white hover:border-transparent transition-all duration-300 text-xs py-1.5 px-3 rounded-xl border-gray-300/60 text-gray-600 bg-white/60 backdrop-blur-sm hover:shadow-lg"
                            onClick={() => handleSuggestedQuestion(question)}
                          >
                            {question.length > 20 ? question.substring(0, 20) + "..." : question}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}