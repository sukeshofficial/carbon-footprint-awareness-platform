import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';

export const useThemeShortcut = () => {
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Shortcut: Alt + T
      if (e.altKey && e.key.toLowerCase() === 't') {
        e.preventDefault();

        const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);

        toast.info(`Theme switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} mode`, {
          duration: 500,
          description: 'Used shortcut Alt + T',
        });
      }
    };

    globalThis.addEventListener('keydown', handleKeyDown);
    return () => globalThis.removeEventListener('keydown', handleKeyDown);
  }, [setTheme, resolvedTheme]);
};
