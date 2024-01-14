// api.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://3.93.164.156/accounts';

import { Linking } from 'react-native';


export const loginWithGitHub = async () => {
  try {
    // Define the GitHub login URL
    const githubLoginUrl = `${BASE_URL}/github/login/?process=login`;

    // Open the URL in the user's browser
    const canOpen = await Linking.canOpenURL(githubLoginUrl);
    if (!canOpen) {
      throw new Error('Unable to open GitHub login URL');
    }

    await Linking.openURL(githubLoginUrl);


  } catch (error) {
    console.error('Error during GitHub login:', error);
    throw error; // Rethrow to handle it in the component
  }
};



async function fetchCsrfToken() {
  try {
    const response = await fetch(`${BASE_URL}/csrf-token/`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    await AsyncStorage.setItem('csrfToken', data.csrfToken);
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
  }
}

export const login = async (username, password) => {
  try {
    // Fetch CSRF token
    await fetchCsrfToken();
    const csrfToken = await AsyncStorage.getItem('csrfToken');

    // Send a POST request to the login endpoint
    const response = await fetch(`${BASE_URL}/login2/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.status === 200) {
      // Assuming the response is a JSON object with a success and session_id property
      const data = await response.json();

      // Save the session_id to AsyncStorage
      await AsyncStorage.setItem('session_id', data.session_id);

      // Console.log the session_id

      return { success: data.success, message: data.message };
    } else if (response.status === 401) {
      // Handle authentication failure
      return { success: false, message: 'Invalid credentials' };
    } else {
      // Handle other HTTP errors
      return { success: false, message: `HTTP error: ${response.status}` };
    }

  } catch (error) {
    // Handle network or other errors
    return { success: false, message: `Error: ${error.message}` };
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${BASE_URL}/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log('Error Data:', errorData);
      return errorData;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error during user registration:', error);
    throw error;
  }
};

export const fetchUserData = async () => {

  try {
    // Fetch CSRF token first
    await fetchCsrfToken();

    const csrfToken = await AsyncStorage.getItem('csrfToken');
    const session_id = await AsyncStorage.getItem('session_id'); // Get the session ID from AsyncStorage

    const response = await fetch(`${BASE_URL}/profile/`, {
      headers: {
        'X-CSRFToken': csrfToken,
        'Authorization': `Bearer ${session_id}`, // Add authentication token
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error; // Rethrow to handle it in the component
  }
};

export const changePassword = async (current_password, new_password) => {
  try {

    await fetchCsrfToken();

    const csrfToken = await AsyncStorage.getItem('csrfToken');
    const session_id = await AsyncStorage.getItem('session_id'); // Get the session ID from AsyncStorage
    
    const response = await fetch(`${BASE_URL}/change-password/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
        'Authorization': `Bearer ${session_id}`, // Add authentication token
      },
      body: JSON.stringify({ current_password, new_password }),
    });

    const data = await response.json();

    if (response.status === 200) {
      return { success: true, message: data.success };
    } else {
      return { success: false, message: data.error || 'An error occurred' };
    }
  } catch (error) {
    console.error('Change password error', error);
    return { success: false, message: 'An error occurred while changing the password' };
  }
};

export const verifyOTP = async (otp) => {
  try {
    const response = await fetch(`${BASE_URL}/register/verify-otp/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ otp }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error during OTP verification:', error);
    throw error; // Rethrow to handle it in the component
  }
};


export const logoutUser = async () => {
  await fetchCsrfToken();
  const csrfToken = await AsyncStorage.getItem('csrfToken');
  try {
    const response = await fetch(`${BASE_URL}/logout/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-CSRFToken': csrfToken,
      },
    });
    return response.status === 200;
  } catch (error) {
    console.error('Logout error', error);
    throw error; // Rethrow to handle it in the component
  }
};


export const changeEmail = async (newEmail) => {
  try {
    await fetchCsrfToken(); // Replace with your CSRF token logic

    const csrfToken = await AsyncStorage.getItem('csrfToken');
    const session_id = await AsyncStorage.getItem('session_id');

    const response = await fetch(`${BASE_URL}/change-email/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
        'Authorization': `Bearer ${session_id}`,
      },
      body: JSON.stringify({ new_Email: newEmail }),
    });

    const data = await response.json();

    if (response.status === 200) {
      return { success: true, message: data.success };
    } else {
      return { success: false, message: data.error || 'An error occurred' };
    }
  } catch (error) {
    console.error('Change email error', error);
    return { success: false, message: 'An error occurred while changing the email' };
  }
};


// Function to change user's profession
export const changeProfession = async (newProfession) => {
  try {
    await fetchCsrfToken(); 

    const csrfToken = await AsyncStorage.getItem('csrfToken');
    const session_id = await AsyncStorage.getItem('session_id');

    const response = await fetch(`${BASE_URL}/change-profession/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
        'Authorization': `Bearer ${session_id}`,
      },
      body: JSON.stringify({ new_Profession: newProfession }),
    });

    const data = await response.json();

    if (response.status === 200) {
      return { success: true, message: data.success };
    } else {
      return { success: false, message: data.error || 'An error occurred' };
    }
  } catch (error) {
    console.error('Change profession error', error);
    return { success: false, message: 'An error occurred while changing the profession' };
  }
};


// Function to change user's phone number
export const changePhone = async (newPhone) => {
  try {
    await fetchCsrfToken(); // Replace with your CSRF token logic

    const csrfToken = await AsyncStorage.getItem('csrfToken');
    const session_id = await AsyncStorage.getItem('session_id');

    const response = await fetch(`${BASE_URL}/change-phone/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
        'Authorization': `Bearer ${session_id}`,
      },
      body: JSON.stringify({ new_Phone: newPhone }),
    });

    const data = await response.json();

    if (response.status === 200) {
      return { success: true, message: data.success };
    } else {
      return { success: false, message: data.error || 'An error occurred' };
    }
  } catch (error) {
    console.error('Change phone number error', error);
    return { success: false, message: 'An error occurred while changing the phone number' };
  }
};


import axios from 'axios';
import qs from 'qs';

export const resetPassword = async (email) => {
  try {
    await fetchCsrfToken();
    const csrfToken = await AsyncStorage.getItem('csrfToken');

    const response = await axios.post(`${BASE_URL}/password/reset/`, { email }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-CSRFToken': csrfToken,
      },
    });

    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: `Error: ${error.message}` };
  }
};
