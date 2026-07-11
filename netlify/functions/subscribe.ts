import { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  // 1. Only allow secure POST requests from your frontend
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ error: 'Method not allowed' }) 
    };
  }

  // 2. Safely unpack the reader's email address
  const { email } = JSON.parse(event.body || '{}');

  if (!email || !email.includes('@')) {
    return { 
      statusCode: 400, 
      body: JSON.stringify({ error: 'A valid email address is required.' }) 
    };
  }

  try {
    // 3. Talk securely to Resend using the backend environment variable
    const response = await fetch('https://api.resend.com/contacts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        unsubscribed: false 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { 
        statusCode: response.status, 
        body: JSON.stringify({ error: errorData.message || 'Failed to subscribe.' }) 
      };
    }

    // 4. Return success back to your React app frontend
    return { 
      statusCode: 200, 
      body: JSON.stringify({ message: 'Successfully subscribed!' }) 
    };
  } catch (error) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: 'Internal server error' }) 
    };
  }
};