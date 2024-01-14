import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://3.93.164.156/todolist/'; // Replace with your API URL

async function fetchCsrfToken() {
  try {
    const response = await fetch(`http://3.93.164.156/accounts/csrf-token/`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    await AsyncStorage.setItem('csrfToken', data.csrfToken);
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
  }
}

export async function fetchTodoLists() {
  try {
    await fetchCsrfToken();

    const csrfToken = await AsyncStorage.getItem('csrfToken');
    const session_id = await AsyncStorage.getItem('session_id'); // Get the session ID from AsyncStorage
    
    const response = await fetch(`${API_URL}viewall/`, {
      headers: {
        'X-CSRFToken': csrfToken,
        'Authorization': `Bearer ${session_id}`,
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

  try {
    await fetchCsrfToken();

    const csrfToken = await AsyncStorage.getItem('csrfToken');
    const session_id = await AsyncStorage.getItem('session_id'); // Get the session ID from AsyncStorage

    const response = await fetch(`${API_URL}create/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
        'Authorization': `Bearer ${session_id}`, // Add authentication token
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
  await fetchCsrfToken();

  const csrfToken = await AsyncStorage.getItem('csrfToken');
  const session_id = await AsyncStorage.getItem('session_id'); // Get the session ID from AsyncStorage
  try {
    const response = await fetch(`${API_URL}mark/${todoId}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
        'Authorization': `Bearer ${session_id}`, // Add authentication token
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
  await fetchCsrfToken();

  const csrfToken = await AsyncStorage.getItem('csrfToken');
  const session_id = await AsyncStorage.getItem('session_id'); // Get the session ID from AsyncStorage

  try {
    const response = await fetch(`${API_URL}delete/${todoId}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
        'Authorization': `Bearer ${session_id}`, // Add authentication token
      },
    });

    if (response.status === 200 || response.status === 201) {
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