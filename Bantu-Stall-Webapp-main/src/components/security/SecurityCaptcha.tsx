import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Shield } from 'lucide-react';

interface SecurityCaptchaProps {
  onVerify: (verified: boolean) => void;
  difficulty?: 'easy' | 'medium' | 'hard';
  className?: string;
}

const SecurityCaptcha: React.FC<SecurityCaptchaProps> = ({ 
  onVerify, 
  difficulty = 'medium',
  className = ''
}) => {
  const [challenge, setChallenge] = useState<string>('');
  const [answer, setAnswer] = useState<number>(0);
  const [userInput, setUserInput] = useState<string>('');
  const [verified, setVerified] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<number>(0);

  const generateChallenge = useCallback(() => {
    let num1: number, num2: number, operation: string, result: number;

    switch (difficulty) {
      case 'easy':
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        operation = '+';
        result = num1 + num2;
        break;
      case 'hard':
        num1 = Math.floor(Math.random() * 20) + 10;
        num2 = Math.floor(Math.random() * 20) + 10;
        const ops = ['+', '-', '*'];
        operation = ops[Math.floor(Math.random() * ops.length)];
        result = operation === '+' ? num1 + num2 : 
                operation === '-' ? num1 - num2 : num1 * num2;
        break;
      default: // medium
        num1 = Math.floor(Math.random() * 15) + 5;
        num2 = Math.floor(Math.random() * 15) + 5;
        operation = Math.random() > 0.5 ? '+' : '-';
        result = operation === '+' ? num1 + num2 : num1 - num2;
    }

    setChallenge(`${num1} ${operation} ${num2} = ?`);
    setAnswer(result);
    setUserInput('');
    setVerified(false);
  }, [difficulty]);

  useEffect(() => {
    generateChallenge();
  }, [generateChallenge]);

  const handleVerify = useCallback(() => {
    const userAnswer = parseInt(userInput);
    
    if (userAnswer === answer) {
      setVerified(true);
      onVerify(true);
    } else {
      setAttempts(prev => prev + 1);
      if (attempts >= 2) {
        generateChallenge(); // Generate new challenge after 3 failed attempts
        setAttempts(0);
      }
      onVerify(false);
    }
  }, [userInput, answer, attempts, onVerify, generateChallenge]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^-?\d*$/.test(value)) { // Allow negative numbers
      setUserInput(value);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleVerify();
    }
  };

  return (
    <div className={`space-y-4 p-4 border rounded-lg bg-background/50 ${className}`}>
      <div className="flex items-center gap-2">
        <Shield className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">Security Verification</span>
      </div>
      
      <div className="space-y-3">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Please solve this simple math problem to verify you're human:
          </p>
          <div className="text-lg font-mono bg-muted p-3 rounded border">
            {challenge}
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Your answer"
            className="flex-1 px-3 py-2 border rounded-md text-center font-mono"
            disabled={verified}
          />
          <Button 
            onClick={handleVerify}
            disabled={!userInput || verified}
            size="sm"
            variant={verified ? "default" : "outline"}
          >
            {verified ? '✓ Verified' : 'Verify'}
          </Button>
        </div>

        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>
            {attempts > 0 && !verified && `${attempts}/3 attempts`}
          </span>
          <Button
            onClick={generateChallenge}
            variant="ghost"
            size="sm"
            className="h-auto p-1"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            New Problem
          </Button>
        </div>

        {verified && (
          <div className="text-center text-sm text-green-600 font-medium">
            ✓ Security verification completed
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityCaptcha;