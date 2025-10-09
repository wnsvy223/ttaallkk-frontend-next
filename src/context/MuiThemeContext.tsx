"use client";

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useTheme } from '@/context/ThemeContext';
import { useMemo } from 'react';

export const MuiThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { theme: mode } = useTheme();
  
  const muiTheme = useMemo(
    () =>
      createTheme({
        typography: {
          fontFamily: 'var(--font-roboto)',
        },
        palette: {
          mode: mode,
          ...(mode === 'light' ? { primary: { main: '#2196f3'}} : { primary: { main: '#03a9f4' }}),
        }
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={muiTheme}>
      {children}
    </ThemeProvider>
  );
};