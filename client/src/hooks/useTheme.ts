// hooks/useTheme.ts
import { useState, useEffect } from 'react';

const themes = ['light', 'dark', 'retro', 'cyberpunk', 'valentine', 'aqua'];

export const useTheme = () => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const changeTheme = (newTheme: string) => {
    if (themes.includes(newTheme)) {
      setTheme(newTheme);
      localStorage.setItem('theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
    }
  };

  return { theme, changeTheme, themes };
};