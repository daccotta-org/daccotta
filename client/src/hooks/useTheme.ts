// hooks/useTheme.ts
import { useState, useEffect } from 'react';

const themes = ['retro', 'cyberpunk', 'valentine','Ashu'];

export const useTheme = () => {
  const [theme, setTheme] = useState('Ashu');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'Ashu';
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