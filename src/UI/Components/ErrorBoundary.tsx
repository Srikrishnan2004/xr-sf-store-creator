import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, styled } from '@mui/material';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
} 

interface State {
  hasError: boolean;
  error?: Error;
}

// Styled components matching the app theme
const ErrorContainer = styled(Box)(({ theme }) => ({
  padding: '20px',
  color: 'white',
  background: 'rgba(255, 0, 0, 0.1)',
  border: '1px solid rgba(255, 0, 0, 0.3)',
  borderRadius: '12px',
  margin: '10px',
  maxWidth: '400px',
  textAlign: 'center',
  backdropFilter: 'blur(16px)',
}));

const ErrorButton = styled(Button)(({ theme }) => ({
  background: '#FF7F32',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: 600,
  textTransform: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: '#e66a2b',
    transform: 'translateY(-1px)',
  },
}));

const SecondaryButton = styled(Button)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.1)',
  color: 'white',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  padding: '10px 20px',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: 600,
  textTransform: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'rgba(255, 255, 255, 0.5)',
    transform: 'translateY(-1px)',
  },
}));

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <ErrorContainer>
          <Typography
            variant="h6"
            sx={{
              marginBottom: '15px',
              color: '#FF7F32',
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              fontSize: '18px',
            }}
          >
            ⚠️ Device Performance Limit Reached
          </Typography>
          <Typography
            sx={{
              marginBottom: '15px',
              lineHeight: '1.5',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            You have overloaded the environment. This doesn't currently render properly on your device specifications.
          </Typography>
          <Typography
            sx={{
              marginBottom: '20px',
              fontSize: '12px',
              opacity: '0.8',
              fontFamily: "'DM Sans', sans-serif",
              color: 'rgba(255, 255, 255, 0.7)',
            }}
          >
            Try using a more performant device with better graphics capabilities.
          </Typography>
          <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <ErrorButton
              onClick={() => this.setState({ hasError: false })}
            >
              Try Again
            </ErrorButton>
            <SecondaryButton
              onClick={() => window.location.reload()}
            >
              Reload Page
            </SecondaryButton>
          </Box>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 