import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.0.154:8081/todolist/'; // Replace with your API URL

// Helper function to get the authentication token
const getToken = async () => {
  const token = await AsyncStorage.getItem('userToken');
  return token;
};

// Function to fetch to-do lists
export async function fetchTodoLists() {
  try {
    // Retrieve the token from AsyncStorage
    const token = await AsyncStorage.getItem('userToken');
    // Check if the token is available
    if (!token) {
      return { success: false, message: 'Authentication token not found' };
    }
    const response = await fetch(`${API_URL}viewall/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'jwt': `Bearer ${token}` // Include the token in the Authorization header
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching to-do lists:', error);
    throw error;
  }
}

// Function to create a new to-do list
export const createTodoList = async (newTodoListData) => {
  const token = await getToken(); // Make sure getToken() is defined and retrieves the JWT token

  try {
    const response = await fetch(`${API_URL}create/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'jwt': `Bearer ${token}` // Changed to 'Authorization' for standard JWT usage
      },
      body: JSON.stringify(newTodoListData),
    });

    const data = await response.json();

    if (response.status === 200 || response.status === 201) { // Assuming 200 or 201 for success
      return { success: true, data: data };
    } else {
      return { success: false, message: data.error || 'Error creating to-do list' };
    }
  } catch (error) {
    console.error('Error creating to-do list:', error);
    return { success: false, message: 'An error occurred during the creation of the to-do list' };
  }
}

export const markTodoList = async (todoId) => {
  const token = await getToken(); // Retrieve the authentication token

  try {
    const response = await fetch(`${API_URL}mark/${todoId}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'jwt': `Bearer ${token}` // Include the token in the Authorization header
      },
      body: JSON.stringify({}), // Sending an empty JSON object
    });

    if (response.ok) {
      return { success: true, message: 'To-do list marked successfully' };
    } else {
      const errorData = await response.json();
      return { success: false, message: errorData.error || 'Error marking to-do list' };
    }
  } catch (error) {
    console.error('Error marking to-do list:', error);
    return { success: false, message: 'An error occurred while marking the to-do list' };
  }
}

export const deleteTodoList = async (todoId) => {
  const token = await getToken(); // Retrieve the authentication token

  try {
    const response = await fetch(`${API_URL}delete/${todoId}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'jwt': `Bearer ${token}` // Include the token in the Authorization header
      },
    });

    if (response.ok) {
      return { success: true, message: 'To-do list deleted successfully' };
    } else {
      const errorData = await response.json();
      return { success: false, message: errorData.error || 'Error deleting to-do list' };
    }
  } catch (error) {
    console.error('Error deleting to-do list:', error);
    return { success: false, message: 'An error occurred while deleting the to-do list' };
  }
}