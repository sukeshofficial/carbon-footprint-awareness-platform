import { useState, useLayoutEffect } from "react";

/**
 * A custom hook to manage the lifecycle of ripples for a button.
 * @returns {Object} { ripples, onClick }
 */
export const useRipple = () => {
  const [ripples, setRipples] = useState([]);

  useLayoutEffect(() => {
    if (ripples.length > 0) {
      const timer = setTimeout(() => {
        setRipples((prevRipples) => prevRipples.slice(1));
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [ripples.length]);

  const addRipple = (event) => {
    const button = event.currentTarget.getBoundingClientRect();
    const size = Math.max(button.width, button.height);
    const x = event.clientX - button.left - size / 2;
    const y = event.clientY - button.top - size / 2;

    const newRipple = {
      x,
      y,
      size,
      key: Date.now(),
    };

    setRipples((prevRipples) => [...prevRipples, newRipple]);
  };

  return { ripples, addRipple };
};
