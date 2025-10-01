import { ThemeProvider } from '@mui/material/styles';
import theme from '../app/theme';

export const MuiThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
};