import { DateRange } from '../types';

const PC_APP_ID = import.meta.env.VITE_PC_APP_ID;
const PC_SECRET = import.meta.env.VITE_PC_SECRET;
const BASE_URL = 'https://api.planningcenteronline.com';

// Store the access token in memory
let accessToken: string | null = null;
let refreshToken: string | null = null;
let tokenExpiry: number | null = null;

export function initiateOAuth() {
  // Clear any existing tokens before starting new auth flow
  localStorage.removeItem('pc_access_token');
  localStorage.removeItem('pc_refresh_token');
  localStorage.removeItem('pc_token_expiry');

  const redirectUri = `${window.location.origin}/auth/callback`;
  const scope = encodeURIComponent('people check_ins services'); 
  const authUrl = `${BASE_URL}/oauth/authorize?client_id=${PC_APP_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}`;
  window.location.href = authUrl;
  console.log('Auth URL:', authUrl);
}

// Function to handle the OAuth callback
export async function handleOAuthCallback(code: string) {
  try {
    console.log('Starting token exchange...');
    const redirectUri = `${window.location.origin}`;
    const response = await fetch(`${BASE_URL}/oauth/token`, {
      method: 'POST',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code: code,
        client_id: PC_APP_ID,
        client_secret: PC_SECRET,
        redirect_uri: redirectUri,
      }),
    });

    console.log('OAuth response:', response);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Token exchange failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Failed to exchange code for token: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('OAuth response data:',data);
    console.log('Token exchange successful');

    accessToken = data?.access_token;
    refreshToken = data?.refresh_token;
    tokenExpiry = (data?.created_at + data?.expires_in) * 1000;
    
    // Store tokens in localStorage for persistence
    if (accessToken) {
      localStorage.setItem('pc_access_token', accessToken);
    }
    if (refreshToken) {
      localStorage.setItem('pc_refresh_token', refreshToken);
    }
    if (tokenExpiry !== null) {
      localStorage.setItem('pc_token_expiry', tokenExpiry.toString());
    }

    console.log('Tokens saved successfully:', {
      accessToken,
      refreshToken,
      tokenExpiry,
    });
    return true;
  } catch (error) {
    console.error('Error in OAuth callback:', error);
    throw error;
  }
}

async function getAccessToken() {
  // Try to load tokens from localStorage
  if (!accessToken) {
    accessToken = localStorage.getItem('pc_access_token');
    refreshToken = localStorage.getItem('pc_refresh_token');
    const storedExpiry = localStorage.getItem('pc_token_expiry');
    tokenExpiry = storedExpiry ? parseInt(storedExpiry, 10) : null;

    console.log('Loaded tokens from localStorage:', {
      accessToken,
      refreshToken,
      tokenExpiry,
    });
  }

  // Check if the access token is still valid
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    console.log('Access token is valid');
    return accessToken;
  }

  // If we have a refresh token, try to refresh
  if (refreshToken) {
    try {
      const response = await fetch(`${BASE_URL}/oauth/token`, {
        method: 'POST',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: PC_APP_ID,
          client_secret: PC_SECRET,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Token exchange successful:', data);

        // Save tokens to global variables and localStorage
        accessToken = data.access_token;
        refreshToken = data.refresh_token;
        tokenExpiry = (data.created_at + data.expires_in) * 1000;

        // Update stored tokens
        if (accessToken) {
          localStorage.setItem('pc_access_token', accessToken);
        }
        if (refreshToken) {
          localStorage.setItem('pc_refresh_token', refreshToken);
        }
        if (tokenExpiry !== null) {
          localStorage.setItem('pc_token_expiry', tokenExpiry.toString());
        }

        console.log('Access token refreshed successfully');
        return accessToken;
      } else {
        const errorData = await response.json();
        throw new Error(`Token refresh failed: ${errorData.error_description || response.statusText}`);
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
    }
  }

  // If no valid tokens, initiate re-authentication
  console.error('No valid tokens found. Please authenticate again.');
  initiateOAuth();
  throw new Error('Authentication required');
}

async function fetchFromPC(endpoint: string) {
  try {
    const token = await getAccessToken();
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Planning Center API error: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    if (error instanceof Error && error.message === 'Authentication required') {
      // Let the error propagate up to trigger OAuth flow
      throw error;
    }
    console.error('Error fetching from Planning Center:', error);
    throw error;
  }
}

export async function getServiceAttendance(dateRange: DateRange) {
  const { start, end } = dateRange;
  const endpoint = `/services/v2/service_times?where[starts_at][gte]=${start.toISOString()}&where[starts_at][lte]=${end.toISOString()}`;
  return fetchFromPC(endpoint);
}

export async function getCheckIns(dateRange: DateRange) {
  const { start, end } = dateRange;
  const endpoint = `/check-ins/v2/check_ins?where[created_at][gte]=${start.toISOString()}&where[created_at][lte]=${end.toISOString()}`;
  return fetchFromPC(endpoint);
}

export async function getPeople() {
  const endpoint = '/people/v2/people';
  return fetchFromPC(endpoint);
}

export async function getEvents(dateRange: DateRange) {
  const { start, end } = dateRange;
  const endpoint = `/calendar/v2/events?where[starts_at][gte]=${start.toISOString()}&where[starts_at][lte]=${end.toISOString()}`;
  return fetchFromPC(endpoint);
}