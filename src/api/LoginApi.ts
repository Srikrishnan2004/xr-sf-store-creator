import LoginCredentials from "../Types/LoginCredentials";
import { CLOUD_RUN_ENDPOINTS } from "./cloudUtils";

const API_ENDPOINTS = {
  LOGIN_USER: CLOUD_RUN_ENDPOINTS.LOGIN.LOGIN_USER,
  OAUTH_LOGIN: CLOUD_RUN_ENDPOINTS.LOGIN.OAUTH_LOGIN,
  GOOGLE_USER_INFO: CLOUD_RUN_ENDPOINTS.LOGIN.GOOGLE_USER_INFO,
};

export const loginUser = async (credentials: LoginCredentials) => {
    try {
      const response = await fetch(API_ENDPOINTS.LOGIN_USER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          region:"india"
        }),
      });

      // Parse the response data regardless of status code
      const data = await response.json();
      
      // For 401 (Unauthorized) and other expected error responses, return the data
      // Let the component handle success/failure based on the response content
      if (response.status === 401 || response.status === 400 || response.status === 422) {
        return data; // Return error response data to component
      }

      // Only throw for unexpected server errors (5xx) or network issues
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Return successful response data
      return data;
    } catch (error) {
      // Only throw for actual network/fetch errors, not business logic errors
      if (error instanceof Error && error.message.includes('HTTP error!')) {
        throw error; // Re-throw HTTP errors
      }
      
      throw new Error(
        `Network error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
};

export const getGoogleUserInfo = async (accessToken: string) => {
    const response = await fetch(API_ENDPOINTS.GOOGLE_USER_INFO, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.json();
};

export const checkGoogleOauth = async (
  email: string,
  oauthProviderId: string,
  name: string
) => {
  try {
    const backendResponse = await fetch(API_ENDPOINTS.OAUTH_LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          oauth_provider_id: oauthProviderId,
          name: name,
          region:"india"
        }),
      });
      
      // Parse the response data regardless of status code
      const data = await backendResponse.json();
      
      // For 401 (Unauthorized) and other expected error responses, return the data
      // Let the component handle success/failure based on the response content
      if (backendResponse.status === 401 || backendResponse.status === 400 || backendResponse.status === 422 || backendResponse.status === 409 || backendResponse.status === 500) {
        return data; // Return error response data to component
      }

      // Only throw for unexpected server errors (5xx) or network issues
      if (!backendResponse.ok) {
        throw new Error(`HTTP error! status: ${backendResponse.status}`);
      }

      return data;
} catch (error) {
    // Only throw for actual network/fetch errors, not business logic errors
    if (error instanceof Error && error.message.includes('HTTP error!')) {
      throw error; // Re-throw HTTP errors
    }
    
    throw new Error(
        `OAuth login failed: ${
            error instanceof Error ? error.message : "Unknown error"
        }`
    );
}
};