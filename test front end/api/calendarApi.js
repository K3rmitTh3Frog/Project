import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://3.93.164.156/calendar/'; // Replace with your API URL

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

export async function fetchEvents() {
    try {
      await fetchCsrfToken();
  
      const csrfToken = await AsyncStorage.getItem('csrfToken');
      const session_id = await AsyncStorage.getItem('session_id'); // Get the session ID from AsyncStorage
      
      const response = await fetch(`${API_URL}view/`, {
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


export const deleteEvent = async (EventId) => {
    await fetchCsrfToken();
  
    const csrfToken = await AsyncStorage.getItem('csrfToken');
    const session_id = await AsyncStorage.getItem('session_id'); // Get the session ID from AsyncStorage
  
    try {
      const response = await fetch(`${API_URL}delete/${EventId}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
          'Authorization': `Bearer ${session_id}`, 
        },
      });
  
      if (response.status === 200 || response.status === 201) {
        return { success: true, message: 'Event deleted successfully' };
      } else {
        const errorData = await response.json();
        return { success: false, message: errorData.error || 'Error deleting the Event' };
      }
    } catch (error) {
      console.error('Error deleting the Event:', error);
      return { success: false, message: 'An error occurred while deleting the Event' };
    }
}

export const createEvent = async (newEventData) => {
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
        body: JSON.stringify(newEventData),
      });
  
      const data = await response.json();
  
      if (response.status === 200 || response.status === 201) { // Assuming 200 or 201 for success
        return { success: true, data: data };
      } else {
        return { success: false, message: data.error || 'Error creating the event' };
      }
    } catch (error) {
      console.error('Error creating the event:', error);
      return { success: false, message: 'An error occurred during the creation of the event' };
    }
  }
  

  
