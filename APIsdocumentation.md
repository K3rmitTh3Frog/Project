### fetchCsrfToken (done)
- **Purpose**: Retrieves a CSRF token from the server and stores it in AsyncStorage.
- **Method**: GET
- **Endpoint**: `/accounts/csrf-token/`
- **Headers**: None
- **Body**: None
- **Success Response**:
  - **Code**: 200 OK
  - **Content**: `{ csrfToken: string }`
- **Error Response**:
  - **Code**: 4XX/5XX (e.g., 404 NOT FOUND, 500 INTERNAL SERVER ERROR)
  - **Content**: Error message detailing the issue.

### fetchEmails (done)
- **Purpose**: Fetches a list of emails.
- **Method**: GET
- **Endpoint**: `/email/view/`
- **Headers**: X-CSRFToken, Authorization (Bearer token)
- **Body**: None
- **Success Response**:
  - **Code**: 200 OK
  - **Content**: Array of email objects.
- **Error Response**:
  - **Code**: 401 UNAUTHORIZED, 404 NOT FOUND, etc.
  - **Content**: Error message explaining the problem.

### fetchEmailsNoRefresh (done)
- **Purpose**: Fetches emails directly from the database without refreshing.
- **Method**: GET
- **Endpoint**: `/email/view-database/`
- **Headers**: X-CSRFToken, Authorization (Bearer token)
- **Body**: None
- **Success Response**:
  - **Code**: 200 OK
  - **Content**: Array of email objects from the database.
- **Error Response**:
  - **Code**: 401 UNAUTHORIZED, 404 NOT FOUND, etc.
  - **Content**: Error message explaining the failure.

### fetchPriorityEmails (done)
- **Purpose**: Retrieves a list of priority emails.
- **Method**: GET
- **Endpoint**: `/email/view-priority-emails/`
- **Headers**: X-CSRFToken, Authorization (Bearer token)
- **Body**: None
- **Success Response**:
  - **Code**: 200 OK
  - **Content**: Array of priority email objects.
- **Error Response**:
  - **Code**: 401 UNAUTHORIZED, 404 NOT FOUND, etc.
  - **Content**: Error message detailing the issue.

### addPriorityEmail (done)
- **Purpose**: Adds an email address to the priority list.
- **Method**: POST
- **Endpoint**: `/email/add-priority-email/`
- **Headers**: Content-Type (application/json), X-CSRFToken, Authorization (Bearer token)
- **Body**: JSON containing `EmailAddress`
- **Success Response**:
  - **Code**: 200 OK
  - **Content**: Confirmation message.
- **Error Response**:
  - **Code**: 400 BAD REQUEST, 401 UNAUTHORIZED, etc.
  - **Content**: Error message explaining the failure.

{
  "EmailAddress": "user@example.com"
}


### deletePriorityEmail (done)
- **Purpose**: Deletes an email from the priority list.
- **Method**: DELETE
- **Endpoint**: `/email/delete-priority-email/{priorityId}/`
- **Headers**: X-CSRFToken, Authorization (Bearer token)
- **Body**: None
- **Success Response**:
  - **Code**: 204 NO CONTENT (indicating successful deletion without a return body)
- **Error Response**:
  - **Code**: 400 BAD REQUEST, 401 UNAUTHORIZED, etc.
  - **Content**: Error message detailing the issue.

### deleteEmail (done)
- **Purpose**: Deletes an email.
- **Method**: DELETE
- **Endpoint**: `/email/delete/{emailId}/`
- **Headers**: X-CSRFToken, Authorization (Bearer token)
- **Body**: None
- **Success Response**:
  - **Code**: 204 NO CONTENT (indicating successful deletion without a return body)
- **Error Response**:
  - **Code**: 400 BAD REQUEST, 401 UNAUTHORIZED, etc.
  - **Content**: Error message explaining the failure.

### changeEmailPriority (done)
- **Purpose**: Changes the priority status of an email.
- **Method**: POST
- **Endpoint**: `/email/change-priority/{email_id}/`
- **Headers**: Content-Type (application/json), X-CSRFToken, Authorization (Bearer token)
- **Body**: JSON containing `new_IsPriority`
- **Success Response**:
  - **Code**: 200 OK
  - **Content**: `{ success: true, message: string }`
- **Error Response**:
  - **Code**: 400 BAD REQUEST, 401 UNAUTHORIZED, etc.
  - **Content**: `{ success: false, message: string }`

..........................................................................

### fetchTodoLists (done)
- **Purpose**: Fetches a list of to-do lists.
- **Method**: GET
- **Endpoint**: `/todolist/viewall/`
- **Headers**: X-CSRFToken, Authorization (Bearer token)
- **Body**: None
- **Success Response**:
  - **Code**: 200 OK
  - **Content**: Array of to-do list objects.
- **Error Response**:
  - **Code**: 4XX/5XX (e.g., 401 UNAUTHORIZED)
  - **Content**: Error message detailing the failure.

### createTodoList (done)
- **Purpose**: Creates a new to-do list.
- **Method**: POST
- **Endpoint**: `/todolist/create/`
- **Headers**: Content-Type (application/json), X-CSRFToken, Authorization (Bearer token)
- **Body**: JSON containing `newTodoListData`
- **Success Response**:
  - **Code**: 200 OK / 201 Created
  - **Content**: `{ success: true, data: object }`
- **Error Response**:
  - **Code**: 4XX/5XX (e.g., 400 BAD REQUEST, 401 UNAUTHORIZED)
  - **Content**: `{ success: false, message: string }`

{
  "Priority": 0,
  "Due": "2024-02-26T23:55:26.699Z",
  "Description": "string",
  "Category": "string",
  "Notes": "string",
  "Time_Estimate": "10:00",
  "Reminders": "2024-02-26T23:55:26.699Z",
  "Status": "In Progress"
}


### markTodoList (done)
- **Purpose**: Marks a specified to-do list item.
- **Method**: PATCH
- **Endpoint**: `/todolist/mark/${todoId}/`
- **Headers**: Content-Type (application/json), X-CSRFToken, Authorization (Bearer token)
- **Body**: Empty JSON object
- **Success Response**:
  - **Code**: 200 OK
  - **Content**: `{ success: true, message: 'To-do list marked successfully' }`
- **Error Response**:
  - **Code**: 4XX/5XX (e.g., 400 BAD REQUEST, 401 UNAUTHORIZED)
  - **Content**: `{ success: false, message: string }`

### deleteTodoList (done)
- **Purpose**: Deletes a specified to-do list item.
- **Method**: DELETE
- **Endpoint**: `/todolist/delete/${todoId}/`
- **Headers**: Content-Type (application/json), X-CSRFToken, Authorization (Bearer token)
- **Body**: None
- **Success Response**:
  - **Code**: 204
  - **Content**: `{ success: true, message: 'To-do list deleted successfully' }`
- **Error Response**:
  - **Code**: 4XX/5XX (e.g., 400 BAD REQUEST, 401 UNAUTHORIZED, 404 Not Found)
  - **Content**: `{ success: false, message: string }`

................................................................................................
### loginWithGitHub
- **Purpose**: Initiates GitHub login process.
- **Method**: GET (Browser Link Opening)
- **Endpoint**: `${BASE_URL}/github/login/?process=login`
- **Headers**: None (handled by browser)
- **Body**: None
- **Note**: The backend should handle the redirect after login and possibly send a deep link back to the app.


### login (done)
- **Purpose**: Authenticates user with username and password.
- **Method**: POST
- **Endpoint**: `/accounts//login2/`
- **Headers**: 'Content-Type': 'application/json', 'X-CSRFToken'
- **Body**: JSON containing `{ username, password }`
- **Success Response**: `{ success: boolean, message: string }`
- **Error Response**: `{ success: false, message: 'Invalid credentials' }` or other HTTP errors.

  {
    "username":"test",
    "password":"test"
}

### registerUser (done)
- **Purpose**: Registers a new user.
- **Method**: POST
- **Endpoint**: `/accounts/register/`
- **Headers**: 'Content-Type': 'application/json', 'X-CSRFToken'
- **Body**: JSON containing `userData`
- **Note**: Error and success handling based on response status.

{
  "email": "hadiwdidi@gmail.com",
  "username": "string",
  "name": "string",
  "phone": "string",
  "profession": "string",
  "password": "string"
}

### fetchUserData (done)
- **Purpose**: Fetches user profile data.
- **Method**: GET
- **Endpoint**: `/accounts/profile/`
- **Headers**: 'X-CSRFToken', 'Authorization' (Bearer token)
- **Body**: None
- **Note**: Error handling for non-200 responses.

### changePassword (done)
- **Purpose**: Changes the user's password.
- **Method**: POST
- **Endpoint**: `/accounts/change-password/`
- **Headers**: 'Content-Type': 'application/json', 'X-CSRFToken', 'Authorization' (Bearer token)
- **Body**: JSON containing `{ current_password, new_password }`
- **Success/Error Response**: Based on response status.

  {
  "current_password": "test",
  "new_password": "test"
}

### verifyOTP
- **Purpose**: Verifies OTP during registration.
- **Method**: POST
- **Endpoint**: `${BASE_URL}/register/verify-otp/`
- **Headers**: 'Content-Type': 'application/json'
- **Body**: JSON containing `{ otp }`
- **Note**: Error and success handling as per response.

### logoutUser (done)
- **Purpose**: Logs out the user.
- **Method**: POST
- **Endpoint**: `/accounts/logout/`
- **Headers**: 'Content-Type': 'text/html; charset=utf-8', 'X-CSRFToken'
- **Body**: None
- **Note**: success code 200 

### changeEmail (done)
- **Purpose**: Changes the user's email.
- **Method**: POST
- **Endpoint**: `/accounts/change-email/`
- **Headers**: 'Content-Type': 'application/json', 'X-CSRFToken', 'Authorization' (Bearer token)
- **Body**: JSON containing `{ new_Email: newEmail }`
- **Success/Error Response**: Based on response status. 200 success

{
  "new_Email": "hamzehm2003@gmail.com"
}

### changeProfession (done)
- **Purpose**: Changes the user's profession.
- **Method**: POST
- **Endpoint**: `/accounts/change-profession/`
- **Headers**: 'Content-Type': 'application/json', 'X-CSRFToken', 'Authorization' (Bearer token)
- **Body**: JSON containing `{ new_Profession: newProfession }`
- **Success/Error Response**: Based on response status.


{
  "new_Profession": "test"
}
  

### changePhone (done)
- **Purpose**: Changes the user's phone number.
- **Method**: POST
- **Endpoint**: `/accounts/change-phone/`
- **Headers**: 'Content-Type': 'application/json', 'X-CSRFToken', 'Authorization' (Bearer token)
- **Body**: JSON containing `{ new_Phone: newPhone }`
- **Success/Error Response**: Based on response status.

### resetPassword (done)
- **Purpose**: Initiates password reset process.
- **Method**: POST
- **Endpoint**: `/accounts/password/reset/`
- **Headers**: 'Content-Type': 'application/x-www-form-urlencoded', 'X-CSRFToken'
- **Body**: Form data containing `{ email }`, "email" is the key name and the value is the email address
- **Success/Error Response**: Based on response data or error message.
- 


......................................calendar.............................................

### listAllEvents
- **Method**: GET
- **Endpoint**: `/calendar/view/`
- **Headers**: 
  - 'Content-Type': 'application/json'
  - 'X-CSRFToken': (CSRF token value)
  - 'Authorization': 'Bearer (token)'
- **Success Response**:
  - **Status Code**: 200 OK
  - **Content**: List of calendar events in JSON format.
- **Error Response**:
  - **Status Code**: 401 Unauthorized
    - **Content**: `"detail": "Authentication credentials were not provided."`

### createEvent
- **Method**: POST
- **Endpoint**: `/calendar/create/`
- **Headers**:
  - 'Content-Type': 'application/json'
  - 'X-CSRFToken': (CSRF token value)
  - 'Authorization': 'Bearer (token)'
- **Body**: JSON data containing details of the new event.
- **Success Response**:
  - **Status Code**: 201 Created
- **Error Responses**:
  - **Status Code**: 400 Bad Request
    - **Content**: `"error": (error detail)`
  - **Status Code**: 401 Unauthorized
    - **Content**: `"detail": "Authentication credentials were not provided."`


### SpecificEventView
- **Purpose**: Retrieves details of a specific event.
- **Method**: GET
- **Endpoint**: `/calendar/<int:Event_id>/`
- **Headers**: 
  - `'Authorization': 'Bearer token'`
  - `'X-CSRFToken': CSRF token value`
- **URL Parameters**: 
  - `Event_id`: The unique identifier of the event to retrieve details for.
- **Query Parameters**: None
- **Success Response**:
  - **Code**: 200 OK
  - **Description**: Details of the requested event.
- **Error Response**:
  - **Code**: 401 Unauthorized
    - **Description**: Returned if the user is not authenticated or does not have permission to access the resource.
  - **Code**: 404 Not Found
    - **Description**: Returned if the specified event does not exist or is not associated with the authenticated user.
- **Request Body**: None


### calendar/deleteEvent

- **Method**: DELETE
- **Endpoint**: `/calendar/delete/{Event_id}/`
- **Headers**:
  - 'Content-Type': 'application/json'
  - 'X-CSRFToken': (CSRF token value)
  - 'Authorization': 'Bearer (token)'

#### Success Response:
- **Status Code**: 200
  - **Content**: {"success": "Event item deleted successfully"}

#### Error Responses:
- **Status Code**: 404 Not Found
  - **Content**: {"error": "Event item not found"}
- **Status Code**: 401 Unauthorized
  - **Content**: {"detail": "Authentication credentials were not provided."}



### calendar/changeTitle

- **Method**: POST
- **Endpoint**: `/calendar/changeTitle/{event_id}/`
- **Headers**:
  - 'Content-Type': 'application/json'
  - 'X-CSRFToken': (CSRF token value)
  - 'Authorization': 'Bearer (token)'

- **Body**: JSON data containing the new title.

#### Success Response:
- **Status Code**: 200 OK
  - **Content**: {"success": "Title updated successfully"}

#### Error Responses:
- **Status Code**: 404 Not Found
  - **Content**: {"error": "Event item not found"}
- **Status Code**: 401 Unauthorized
  - **Content**: {"detail": "Authentication credentials were not provided."}
- **Status Code**: 400 Bad Request
  - **Content**: {"error": (error detail)}
 

### calendar/changeEventDescription

- **Method**: POST
- **Endpoint**: `/calendar/changeEventDescription/{event_id}/`
- **Headers**:
  - 'Content-Type': 'application/json'
  - 'X-CSRFToken': (CSRF token value)
  - 'Authorization': 'Bearer (token)'

- **Body**: JSON data containing the new description.

#### Success Response:
- **Status Code**: 200 OK
  - **Content**: {"success": "Event description updated successfully"}

#### Error Responses:
- **Status Code**: 404 Not Found
  - **Content**: {"error": "Event item not found"}
- **Status Code**: 401 Unauthorized
  - **Content**: {"detail": "Authentication credentials were not provided."}
- **Status Code**: 400 Bad Request
  - **Content**: {"error": (error detail)}
 

### calendar/changeStartDate

- **Method**: POST
- **Endpoint**: `/calendar/changeStartDate/{event_id}/`
- **Headers**:
  - 'Content-Type': 'application/json'
  - 'X-CSRFToken': (CSRF token value)
  - 'Authorization': 'Bearer (token)'

- **Body**: JSON data containing the new start date.

#### Success Response:
- **Status Code**: 200 OK
  - **Content**: {"success": "Start date updated successfully"}

#### Error Responses:
- **Status Code**: 404 Not Found
  - **Content**: {"error": "Event item not found"}
- **Status Code**: 401 Unauthorized
  - **Content**: {"detail": "Authentication credentials were not provided."}
- **Status Code**: 400 Bad Request
  - **Content**: {"error": (error detail)}


### calendar/changeStartTime

- **Method**: POST
- **Endpoint**: `/calendar/changeStartTime/{event_id}/`
- **Headers**:
  - 'Content-Type': 'application/json'
  - 'X-CSRFToken': (CSRF token value)
  - 'Authorization': 'Bearer (token)'

- **Body**: JSON data containing the new start time.

#### Success Response:
- **Status Code**: 200 OK
  - **Content**: {"success": "Start time updated successfully"}

#### Error Responses:
- **Status Code**: 404 Not Found
  - **Content**: {"error": "Event item not found"}
- **Status Code**: 401 Unauthorized
  - **Content**: {"detail": "Authentication credentials were not provided."}
- **Status Code**: 400 Bad Request
  - **Content**: {"error": (error detail)}
  - 


### calendar/changeEndDate

- **Method**: POST
- **Endpoint**: `/calendar/changeEndDate/{event_id}/`
- **Headers**:
  - 'Content-Type': 'application/json'
  - 'X-CSRFToken': (CSRF token value)
  - 'Authorization': 'Bearer (token)'

- **Body**: JSON data containing the new end date.

#### Success Response:
- **Status Code**: 200 OK
  - **Content**: {"success": "End date updated successfully"}

#### Error Responses:
- **Status Code**: 404 Not Found
  - **Content**: {"error": "Event item not found"}
- **Status Code**: 401 Unauthorized
  - **Content**: {"detail": "Authentication credentials were not provided."}
- **Status Code**: 400 Bad Request
  - **Content**: {"error": (error detail)}
 

### calendar/changeEndTime

- **Method**: POST
- **Endpoint**: `/calendar/changeEndTime/{event_id}/`
- **Headers**:
  - 'Content-Type': 'application/json'
  - 'X-CSRFToken': (CSRF token value)
  - 'Authorization': 'Bearer (token)'

- **Body**: JSON data containing the new end time.

#### Success Response:
- **Status Code**: 200 OK
  - **Content**: {"success": "End time updated successfully"}

#### Error Responses:
- **Status Code**: 404 Not Found
  - **Content**: {"error": "Event item not found"}
- **Status Code**: 401 Unauthorized
  - **Content**: {"detail": "Authentication credentials were not provided."}
- **Status Code**: 400 Bad Request
  - **Content**: {"error": (error detail)}
 

### calendar/eventDurationCheck

- **Method**: GET
- **Endpoint**: `/calendar/event-duration/{event_id1}/{event_id2}/`
- **Headers**:
  - 'Content-Type': 'application/json'
  - 'X-CSRFToken': (CSRF token value)
  - 'Authorization': 'Bearer (token)'

#### Success Response:
- **Status Code**: 200 OK
  - **Content**: Duration between two events.

#### Error Responses:
- **Status Code**: 404 Not Found
  - **Content**: {"error": "One or both events not found"}
- **Status Code**: 401 Unauthorized
  - **Content**: {"detail": "Authentication credentials were not provided."}
- **Status Code**: 400 Bad Request
  - **Content**: {"error": "One or both events have no destination"}
 
### calendar/directions

- **Method**: GET
- **Endpoint**: `/calendar/directions/`
- **Headers**:
  - 'Content-Type': 'application/json'
  - 'X-CSRFToken': (CSRF token value)
  - 'Authorization': 'Bearer (token)'

- **Query Parameters**:
  - `origin`: The starting point of the directions.
  - `destination`: The destination point of the directions.
  - `mode`: The mode of transportation (e.g., "driving", "walking", "transit").

#### Success Response:
- **Status Code**: 200 OK
  - **Content**: Directions between the origin and destination.

#### Error Responses:
- **Status Code**: 400 Bad Request
  - **Content**: {"error": "Missing parameters"}
 - **Status Code**: 500 Internal Server Error
  - **Content**: {"error": "Error message"}
 

  ### calendar/duration

- **Method**: GET
- **Endpoint**: `/calendar/duration/`
- **Headers**:
  - 'Content-Type': 'application/json'
  - 'X-CSRFToken': (CSRF token value)
  - 'Authorization': 'Bearer (token)'

- **Query Parameters**:
  - `origin`: The starting point.
  - `destination`: The destination point.
  - `mode`: The mode of transportation (e.g., "driving", "walking", "transit").

#### Success Response:
- **Status Code**: 200 OK
  - **Content**: Duration information between origin and destination.

#### Error Responses:
- **Status Code**: 400 Bad Request
  - **Content**: {"error": "Missing parameters"}
- **Status Code**: 500 Internal Server Error
  - **Content**: {"error": "Error message"}
 
### calendar/createCalendarDurationCheck

- **Method**: POST
- **Endpoint**: `/calendar/create_check/`
- **Headers**:
  - 'Content-Type': 'application/json'
  - 'X-CSRFToken': (CSRF token value)
  - 'Authorization': 'Bearer (token)'

#### Success Response:
- **Status Code**: 201 Created
  - **Content**: Created event details.

#### Error Responses:
- **Status Code**: 400 Bad Request
  - **Content**: {"error": "One or both events have no destination"}
- **Status Code**: 404 Not Found
  - **Content**: {"error": "One or both events not found"}
- **Status Code**: 401 Unauthorized
  - **Content**: {"detail": "Authentication credentials were not provided."}
- **Status Code**: 422 Unprocessable Entity
  - **Content**: Error details if validation fails.
 

### calendar/todaysEvents

- **Method**: GET
- **Endpoint**: `/calendar/todaysEvents/`
- **Headers**:
  - 'Content-Type': 'application/json'
  - 'X-CSRFToken': (CSRF token value)
  - 'Authorization': 'Bearer (token)'

#### Success Response:
- **Status Code**: 200 OK
  - **Content**: 
    ```json
    {
        "past_events_today": (count of past events),
        "future_events_today": (count of future events)
    }
    ```

#### Error Responses:
- **Status Code**: 500 Internal Server Error
  - **Content**: {"error": (error message)}
 

### calendar/todaysEvents

- **Method**: GET
- **Endpoint**: `/calendar/todaysEvents/`
- **Headers**:
  - 'Content-Type': 'application/json'
  - 'X-CSRFToken': (CSRF token value)
  - 'Authorization': 'Bearer (token)'

#### Success Response:
- **Status Code**: 200 OK
  - **Content**: 
    ```json
    {
        "past_events_today": (count of past events),
        "future_events_today": (count of future events)
    }
    ```

#### Error Responses:
- **Status Code**: 401 Unauthorized
  - **Content**: {"detail": "Authentication credentials were not provided."}
- **Status Code**: 500 Internal Server Error
  - **Content**: {"error": (error message)}
