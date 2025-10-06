import { useState, useCallback } from 'react';
import { Eye, EyeOff, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { validatePasswordStrength } from '@/utils/security';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PasswordProtectionProps {
  password: string;
  onPasswordChange: (password: string) => void;
  showStrengthMeter?: boolean;
  requireStrong?: boolean;
}

export function PasswordProtection({
  password,
  onPasswordChange,
  showStrengthMeter = true,
  requireStrong = true
}: PasswordProtectionProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [touched, setTouched] = useState(false);

  const validation = validatePasswordStrength(password);
  const passwordsMatch = password === confirmPassword;

  const getStrengthColor = useCallback(() => {
    if (!password) return 'bg-muted';
    if (validation.errors.length > 3) return 'bg-destructive';
    if (validation.errors.length > 1) return 'bg-warning';
    if (validation.errors.length === 1) return 'bg-primary/60';
    return 'bg-success';
  }, [password, validation.errors.length]);

  const getStrengthText = useCallback(() => {
    if (!password) return 'Enter a password';
    if (validation.errors.length > 3) return 'Very Weak';
    if (validation.errors.length > 1) return 'Weak';
    if (validation.errors.length === 1) return 'Fair';
    return 'Strong';
  }, [password, validation.errors.length]);

  const getStrengthWidth = useCallback(() => {
    if (!password) return '0%';
    if (validation.errors.length > 3) return '25%';
    if (validation.errors.length > 1) return '50%';
    if (validation.errors.length === 1) return '75%';
    return '100%';
  }, [password, validation.errors.length]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Password Protection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Password Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Password</label>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                onPasswordChange(e.target.value);
                if (!touched) setTouched(true);
              }}
              placeholder="Enter a strong password"
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Confirm Password Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Confirm Password</label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          {confirmPassword && !passwordsMatch && (
            <p className="text-sm text-destructive">Passwords do not match</p>
          )}
          {confirmPassword && passwordsMatch && (
            <p className="text-sm text-success flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Passwords match
            </p>
          )}
        </div>

        {/* Password Strength Meter */}
        {showStrengthMeter && password && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Password Strength</span>
              <span className={`text-sm font-medium ${
                validation.isValid ? 'text-success' : 'text-destructive'
              }`}>
                {getStrengthText()}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
                style={{ width: getStrengthWidth() }}
              />
            </div>
          </div>
        )}

        {/* Password Requirements */}
        {touched && validation.errors.length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                <p className="font-medium">Password requirements not met:</p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {validation.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Success Message */}
        {validation.isValid && passwordsMatch && (
          <Alert className="border-success bg-success/10">
            <CheckCircle className="h-4 w-4 text-success" />
            <AlertDescription className="text-success">
              Password meets all security requirements and matches confirmation.
            </AlertDescription>
          </Alert>
        )}

        {/* Security Tips */}
        <div className="bg-muted/30 p-3 rounded-lg">
          <h4 className="text-sm font-medium mb-2">Security Tips:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Use a mix of uppercase, lowercase, numbers, and symbols</li>
            <li>• Avoid common words, names, or dictionary terms</li>
            <li>• Don't reuse passwords from other accounts</li>
            <li>• Consider using a password manager</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}