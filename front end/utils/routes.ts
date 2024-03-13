import axios from 'axios'
import { useAppSelector } from '../store'

const gmailAxios = axios.create({
    baseURL: 'https://gmail.googleapis.com/gmail/v1/users/me',
})

const backendAxios = axios.create({
    baseURL: `http://3.93.164.156`,
})

backendAxios.interceptors.request.use(async(config:any) => {
    const data = await getCSRFToken();
    config.headers["X-CSRFToken"] = data?.csrfToken
    return config;
})

export const getCSRFToken = async() => {
    const res = await axios.get("http://3.93.164.156/accounts/csrf-token");
    return res.data;
}

export const getEmails = async (token: string, pageToken = '') => {
    const emails = await gmailAxios.get(
        `/messages?pageToken=${pageToken}&q=in:inbox&maxResults=10`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )

    const emailsData = await emails.data

    return {
        messages: await Promise.all(
            emailsData?.messages?.map(async (email: any) => {
                const data = await getEmailById(token, email?.id)
                return data
            })
        ),
        nextPageToken: emailsData?.nextPageToken,
    }
}

export const getEmailById = async (token: string, id: string) => {
    const emails = await gmailAxios.get(`/messages/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    return await emails.data
}

export const getEmailRawById = async (token: string, id: string) => {
    const emails = await gmailAxios.get(`/messages/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            format: 'raw',
        },
    })

    return await emails.data
}

















//////////////////////////////////////////account

//done
export const loginUser = async (username: string, password: string) => {
    try {
        const res = await backendAxios.post(`/accounts/login2/`, {
            username,
            password,
        });
        const data = await res.data;
        console.log(data);
        return data;
    } catch (error) {
        console.error("An error occurred while logging in:", error);
        throw error;
    }
};

//done
export const verifyOTP = async (otp: string, sessionId: string) => {
    try {
        const res = await backendAxios.post(`accounts/register/verify-otp/`, {
            otp,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionId}`,
            }
        });
        return res.data;
    } catch (error) {
        // Handle error
        console.error('Error verifying OTP:', error);
        throw error;
    }
};
//done
export const registerUser = async (
    email: string,
    username: string,
    name: string,
    phone: string,
    profession: string,
    password: string,
) => {
    try {
        const res = await backendAxios.post(`/accounts/register/`, {
            email,
            username,
            name,
            phone,
            profession,
            password,
        }, {
            headers: {
                'Content-Type': 'application/json',   
            },
        });
        return res.data;
    } catch (error: any) { // Explicitly type 'error' as 'any'
        // Handle the error here
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Response error:', error.response.data);
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
            // You might want to throw the error again to let the caller handle it
            throw new Error('Failed to register user. Please try again later.');
        } else if (error.request) {
            // The request was made but no response was received
            console.error('Request error:', error.request);
            // You might want to throw the error again to let the caller handle it
            throw new Error('Failed to register user. No response received.');
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Other error:', error.message);
            // You might want to throw the error again to let the caller handle it
            throw new Error('Failed to register user. An unexpected error occurred.');
        }
    }
};

//done
export const resetPassword = async (email: string) => {
    try {
  
      const response = await backendAxios.post(`accounts/password/reset/`, { email }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
  
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: `Error: ${error}` };
    }
  };


//done
export const fetchUserData = async (sessionId:string) => {
    try {
        const response = await backendAxios.get(`accounts/profile/`, {
            headers: {
                'Authorization': `Bearer ${sessionId}`, 
            },
        });

        const data = response.data;
        return data;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error; // Rethrow to handle it in the component
    }
};

  
  
//done
export const logoutUser = async () => {
    try {
      const response = await backendAxios.post(`accounts/logout/`, null, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      });
      return response.status === 200;
    } catch (error) {
      console.error('Logout error', error);
    }
};


export const changeEmail = async (newEmail: string) => {
    try {

        const { sessionId } = useAppSelector((state) => state.saved.master)
        const response = await backendAxios.post(`accounts/change-email/`, { new_Email: newEmail }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionId}`,
            },
        });

        if (response.status === 200) {
            return { success: true, message: response.data.success };
        } else {
            return { success: false, message: response.data.error || 'An error occurred' };
        }
    } catch (error) {
        console.error('Change email error', error);
        return { success: false, message: 'An error occurred while changing the email' };
    }
};

export const changePassword = async (current_password: string, new_password: string) => {
    try {
  
    const { sessionId } = useAppSelector((state) => state.saved.master)
  
      const response = await backendAxios.post(`accounts/change-password/`, { current_password, new_password }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionId}`, 
        },
      });
  
      if (response.status === 200) {
        return { success: true, message: response.data.success };
      } else {
        return { success: false, message: response.data.error || 'An error occurred' };
      }
    } catch (error) {
      console.error('Change password error', error);
      return { success: false, message: 'An error occurred while changing the password' };
    }
  };








/////////////////////////////////////email


//done
export const fetchEmails = async (sessionId:string) => {
    try {
  
      const response = await backendAxios.get(`email/view/`, {
        headers: {
          'Authorization': `Bearer ${sessionId}`, // Add authentication token
        },
      });
  
      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      return response.data;
    } catch (error) {
      console.error('Error fetching email data:', error);
      throw error;
    }
  };

//done
export const fetchEmailsNoRefresh = async (sessionId:string) => {
    try {

  
      const response = await backendAxios.get(`email/view-database/`, {
        headers: {
          'Authorization': `Bearer ${sessionId}`, // Add authentication token
        },
      });
  
      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      return response.data;
    } catch (error) {
      console.error('Error fetching email data:', error);
      throw error;
    }
};


export const fetchPriorityEmails = async () => {
    try {
    const { sessionId } = useAppSelector((state) => state.saved.master)
  
      const response = await backendAxios.get(`email/view-priority-emails/`, {
        headers: {
          'Authorization': `Bearer ${sessionId}`,
        },
      });
  
      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      return response.data;
    } catch (error) {
      console.error('Error fetching priority emails:', error);
      throw error;
    }
  };

  export const addPriorityEmail = async (emailAddress:string) => {
    try {
        const { sessionId } = useAppSelector((state) => state.saved.master)

  
      const response = await backendAxios.post(
        `email/add-priority-email/`,
        { EmailAddress: emailAddress },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionId}`,
          },
        }
      );
  
      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      return response.data;
    } catch (error) {
      console.error('Error adding priority email:', error);
      throw error;
    }
  };


  export const deletePriorityEmail = async (priorityId:string) => {
    try {
        const { sessionId } = useAppSelector((state) => state.saved.master)

  
      const response = await backendAxios.delete(`email/delete-priority-email/${priorityId}/`, {
        headers: {
          'Authorization': `Bearer ${sessionId}`,
        },
      });
  
      console.log('Response Status:', response.status);
      console.log('Response Data:', response.data);
  
      if (response.status === 204) {
        // Handle the 204 status code as a successful deletion
        console.log('Priority email deleted successfully.');
      } else if (response.status !== 204 && response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
    } catch (error) {
      console.error('Error deleting priority email:', error);
      throw error;
    }
  };

  export const deleteEmail = async (emailId:string) => {
    try {
        const { sessionId } = useAppSelector((state) => state.saved.master)
  
      const response = await backendAxios.delete(`email/delete/${emailId}/`, {
        headers: {
          'Authorization': `Bearer ${sessionId}`,
        },
      });
  
      console.log('Response Status:', response.status);
  
      if (response.status === 204) {
        console.log('Email deleted successfully.');
        // No need to return a response since there's no content (204)
      } else {
        // Handle other status codes if necessary
        const responseData = response.data;
        console.log('Response Data:', responseData);
      }
    } catch (error) {
      console.error('Error deleting email:', error);
      // Handle errors or rethrow as needed
      throw error;
    }
  };

  export const changeEmailPriority = async (email_id:string, newIsPriority:String) => {
    try {
        const { sessionId } = useAppSelector((state) => state.saved.master)
  
      const response = await backendAxios.post(
        `email/change-priority/${email_id}/`,
        { new_IsPriority: newIsPriority },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionId}`,
          },
        }
      );
  
      if (response.status === 200) {
        return { success: true, message: response.data.success };
      } else {
        return { success: false, message: response.data.error || 'An error occurred' };
      }
    } catch (error) {
      console.error('Change email priority error', error);
      return { success: false, message: 'An error occurred while changing the email priority' };
    }
  };

  export const fetchUniqueEmails = async (email_id:string) => {
    try {
      // Fetch CSRF token first
      const { sessionId } = useAppSelector((state) => state.saved.master)
  
      const response = await backendAxios.get(`email/${email_id}/`, {
        headers: {
          'Authorization': `Bearer ${sessionId}`, // Add authentication token
        },
      });
  
      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      return response.data;
    } catch (error) {
      console.error('Error fetching email data:', error);
      throw error;
    }
  };


  //done
  export const StatisticsEmail = async (sessionId:string) => {
    try {
      // Fetch CSRF token first
  
      const response = await backendAxios.get(`email/status-todays-emails/`, {
        headers: {
          'Authorization': `Bearer ${sessionId}`, // Add authentication token
        },
      });
  
      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      return response.data;
    } catch (error) {
      console.error('Error fetching email data status ', error);
      throw error;
    }
  };

  export const OpenEmails = async (email_id:string) => {
    try {
    const { sessionId } = useAppSelector((state) => state.saved.master)
  
      const response = await backendAxios.post(`email/open/${email_id}/`, {}, {
        headers: {
          'Content-Type': 'application/json', // Specify content type as JSON
          'Authorization': `Bearer ${sessionId}`, // Add authentication token
        }
      });
  
      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // Include the status code in the response object
      return { status: response.status, data: response.data };
    } catch (error) {
      console.error('Error posting data:', error);
      // Handle error here
      throw error;
    }
  };



//////////////////////////////calendar

//done
export async function fetchEvents(sessionId:string) {
    try {

  
      const response = await backendAxios.get(`calendar/view/`, {
        headers: {
          'Authorization': `Bearer ${sessionId}`,
        },
      });
  
      if (response.status !== 200) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      return response.data;
    } catch (error) {
      console.error('Error fetching to-do lists:', error);
      throw error;
    }
  }

  export const deleteEvent = async (EventId:string,session_id:string) => {

  
    try {
      const response = await backendAxios.delete(`calendar/delete/${EventId}/`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session_id}`,
        },
      });
  
      if (response.status === 200 || response.status === 201) {
        return { success: true, message: 'Event deleted successfully' };
      } else {
        return { success: false, message: 'Error deleting the Event' };
      }
    } catch (error) {
      console.error('Error deleting the Event:', error);
      return { success: false, message: 'An error occurred while deleting the Event' };
    }
  }

  export const createEvent = async (newEventData:string,session_id:string) => {
    try {

  
      const response = await backendAxios.post(`calendar/create/`, newEventData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session_id}`,
        },
      });
  
      if (response.status === 200 || response.status === 201) {
        return { success: true, data: response.data };
      } else {
        return { success: false, message: response.data.error || 'Error creating the event' };
      }
    } catch (error) {
      console.error('Error creating the event:', error);
      return { success: false, message: 'An error occurred during the creation of the event' };
    }
  }


//done


export async function StatisticsCalendar(session_id:string) {
    try {

  
      const response = await backendAxios.get(`calendar/status-events-today/`, {
        headers: {
          'Authorization': `Bearer ${session_id}`,
        },
      });
  
      if (response.status !== 200) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      return response.data;
    } catch (error) {
      console.error('Error fetching status to-do lists:', error);
      throw error;
    }
}
///////////////////////////////todolist


//done
export async function StatisticsToDoList(session_id:string) {
    try {

  
      const response = await backendAxios.get(`todolist/status-todos-count/`, {
        headers: {
          'Authorization': `Bearer ${session_id}`,
        },
      });
  
      if (response.status !== 200) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      return response.data;
    } catch (error) {
      console.error('Error fetching to-do lists:', error);
      throw error;
    }
  }

  export async function fetchTodoLists(session_id:string) {
    try {

      
      const response = await backendAxios.get(`todolist/viewall/`, {
        headers: {
          'Authorization': `Bearer ${session_id}`,
        },
      });
  
      if (response.status !== 200) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      return response.data;
    } catch (error) {
      console.error('Error fetching to-do lists:', error);
      throw error;
    }
  }
