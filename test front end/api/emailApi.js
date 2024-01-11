import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://54.236.7.246/email'; // Replace with your Django API URL

async function fetchCsrfToken() {
  try {
    const response = await fetch(`http://54.236.7.246/accounts/csrf-token/`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    await AsyncStorage.setItem('csrfToken', data.csrfToken);
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
  }
}

export const fetchEmails = async () => {
  try {
    // Fetch CSRF token first
    await fetchCsrfToken();

    const csrfToken = await AsyncStorage.getItem('csrfToken');
    const session_id = await AsyncStorage.getItem('session_id'); // Get the session ID from AsyncStorage

    const response = await fetch(`${BASE_URL}/view/`, {
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
    console.error('Error fetching email data:', error);
    throw error;
  }
};

export const fetchEmailsNoRefresh = async () => {
  try {
    // Fetch CSRF token first
    await fetchCsrfToken();

    const csrfToken = await AsyncStorage.getItem('csrfToken');
    const session_id = await AsyncStorage.getItem('session_id'); // Get the session ID from AsyncStorage

    const response = await fetch(`${BASE_URL}/view-database/`, {
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
    console.error('Error fetching email data:', error);
    throw error;
  }
};

export const fetchPriorityEmails = async () => {
  try {
    await fetchCsrfToken();
    const csrfToken = await AsyncStorage.getItem('csrfToken');
    const session_id = await AsyncStorage.getItem('session_id');

    const response = await fetch(`${BASE_URL}/view-priority-emails/`, {
      headers: {
        'X-CSRFToken': csrfToken,
        'Authorization': `Bearer ${session_id}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching priority emails:', error);
    throw error;
  }
};

// Add Priority Email
export const addPriorityEmail = async (emailAddress) => {
  try {
    await fetchCsrfToken();
    const csrfToken = await AsyncStorage.getItem('csrfToken');
    const session_id = await AsyncStorage.getItem('session_id');

    const response = await fetch(`${BASE_URL}/add-priority-email/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
        'Authorization': `Bearer ${session_id}`,
      },
      body: JSON.stringify({ EmailAddress: emailAddress }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error adding priority email:', error);
    throw error;
  }
};

// Delete Priority Email
export const deletePriorityEmail = async (priorityId) => {
  try {
    await fetchCsrfToken();
    const csrfToken = await AsyncStorage.getItem('csrfToken');
    const session_id = await AsyncStorage.getItem('session_id');

    const response = await fetch(`${BASE_URL}/delete-priority-email/${priorityId}/`, {
      method: 'DELETE',
      headers: {
        'X-CSRFToken': csrfToken,
        'Authorization': `Bearer ${session_id}`,
      },
    });

    console.log('Response Status:', response.status);
    console.log('Response Text:', await response.text());

    if (response.status === 204) {
      // Handle the 204 status code as a successful deletion
      console.log('Priority email deleted successfully.');
      // No need to return a response since there's no content (204)
    } else if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

  } catch (error) {
    console.error('Error deleting priority email:', error);
    throw error;
  }
};


export const deleteEmail = async (emailId) => {
  try {
    await fetchCsrfToken();
    const csrfToken = await AsyncStorage.getItem('csrfToken');
    const session_id = await AsyncStorage.getItem('session_id');

    const response = await fetch(`${BASE_URL}/delete/${emailId}/`, {
      method: 'DELETE',
      headers: {
        'X-CSRFToken': csrfToken,
        'Authorization': `Bearer ${session_id}`,
      },
    });

    console.log('Response Status:', response.status);

    if (response.status === 204) {
      // Handle the 204 status code as a successful deletion
      console.log('Email deleted successfully.');
      // No need to return a response since there's no content (204)
    } else if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      // Parse and log the response body as JSON
      const responseData = await response.json();
      console.log('Response Data:', responseData);
    }
  } catch (error) {
    console.error('Error deleting email:', error);
    throw error;
  }
};


export const changeEmailPriority = async (email_id, newIsPriority) => {
  try {
    const csrfToken = await AsyncStorage.getItem('csrfToken');
    const session_id = await AsyncStorage.getItem('session_id');

    const response = await fetch(`${BASE_URL}/change-priority/${email_id}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
        'Authorization': `Bearer ${session_id}`,
      },
      body: JSON.stringify({ new_IsPriority: newIsPriority }),
    });

    const data = await response.json();

    if (response.status === 200) {
      return { success: true, message: data.success };
    } else {
      return { success: false, message: data.error || 'An error occurred' };
    }
  } catch (error) {
    console.error('Change email priority error', error);
    return { success: false, message: 'An error occurred while changing the email priority' };
  }
};
