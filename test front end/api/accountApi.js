// api.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.0.154:8081/user';

export const login = async (email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.status === 200) {
      const token = data['jwt token']; // or data.jwt_token, if the key is in this format
      if (token) {
        await AsyncStorage.setItem('userToken', token);
        return { success: true };
      } else {
        // Token not found in response
        return { success: false, message: 'Login succeeded but no token received' };
      }
    } else {
      return { success: false, message: 'Wrong username or password' };
    }
  } catch (error) {
    console.error('Login error', error);
    return { success: false, message: 'An error occurred during login' };
  }
};

export const fetchUserData = async () => {
  try {
    const response = await fetch(`${BASE_URL}/profile/`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error; // Rethrow to handle it in the component
  }
};

export const logoutUser = async () => {
  try {
    const response = await fetch(`${BASE_URL}/logout/`, {
      method: 'POST',
      // Include headers, authentication tokens, etc., if required
    });
    return response.status === 200;
  } catch (error) {
    console.error('Logout error', error);
    throw error; // Rethrow to handle it in the component
  }
};

export const changePassword = async (current_password, new_password) => {
  try {
    // Retrieve the token from AsyncStorage
    const token = await AsyncStorage.getItem('userToken');
    console.log(token)
    // Check if the token is available
    if (!token) {
      return { success: false, message: 'Authentication token not found' };
    }
    
    const response = await fetch(`${BASE_URL}/change-password/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'jwt': `Bearer ${token}`, // Include the token in the Authorization header
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

