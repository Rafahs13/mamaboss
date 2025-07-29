import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';


// Tema personalizado do MamaBoss
const theme = extendTheme({
  colors: {
    brand: {
      pink: '#ec4899',
      purple: '#8b5cf6',
      rose: '#f43f5e',
      pink50: '#fdf2f8',
      pink100: '#fce7f3',
      pink400: '#f472b6',
      purple50: '#faf5ff',
      purple100: '#f3e8ff',
      purple400: '#a78bfa',
      gray50: '#f9fafb',
      gray100: '#f3f4f6',
      gray500: '#6b7280',
      gray700: '#374151',
      gray800: '#1f2937',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
  },
  fonts: {
    heading: 'Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
  },
  styles: {
    global: {
      body: {
        bg: 'brand.gray50',
        color: 'brand.gray800',
      },
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'pink',
      },
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <ChakraProvider theme={theme}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ChakraProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
