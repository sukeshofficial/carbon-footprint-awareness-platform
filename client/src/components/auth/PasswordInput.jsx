import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

/**
 * @typedef {Object} PasswordInputProps
 * @property {string} [className]
 */

/**
 * A polished Password Input component with visibility toggle.
 * @type {React.ForwardRefExoticComponent<PasswordInputProps & React.InputHTMLAttributes<HTMLInputElement> & React.RefAttributes<HTMLInputElement>>}
 */
export const PasswordInput = React.forwardRef(({ className, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative group">
      <Input
        type={showPassword ? 'text' : 'password'}
        className={cn(
          "pr-12 transition-all duration-200 focus:ring-2 focus:ring-primary/20",
          className
        )}
        ref={ref}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-transparent transition-colors z-10"
        onClick={() => setShowPassword((prev) => !prev)}
      >
        {showPassword ? (
          <EyeOff className="h-[1.1rem] w-[1.1rem]" />
        ) : (
          <Eye className="h-[1.1rem] w-[1.1rem]" />
        )}
      </Button>
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';

PasswordInput.propTypes = {
  className: PropTypes.string,
};
