import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

/**
 * @typedef {Object} PasswordInputProps
 * @property {string} [className]
 * @property {string} [id]
 */

/**
 * A specialized Input component for passwords with a visibility toggle.
 * @type {React.ForwardRefExoticComponent<PasswordInputProps & React.InputHTMLAttributes<HTMLInputElement> & React.RefAttributes<HTMLInputElement>>}
 */
export const PasswordInput = React.forwardRef(({ className, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        type={showPassword ? 'text' : 'password'}
        className={`pr-10 ${className}`}
        ref={ref}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
        onClick={() => setShowPassword((prev) => !prev)}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4 text-muted-foreground" />
        ) : (
          <Eye className="h-4 w-4 text-muted-foreground" />
        )}
      </Button>
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';
