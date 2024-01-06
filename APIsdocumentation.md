### fetchCsrfToken
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

### fetchEmails
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

### fetchEmailsNoRefresh
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

### fetchPriorityEmails
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

### addPriorityEmail
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

### deletePriorityEmail
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

### deleteEmail
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

### changeEmailPriority
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



### fetchTodoLists
- **Purpose**: Fetches a list of to-do lists.
- **Method**: GET
- **Endpoint**: `${API_URL}viewall/`
- **Headers**: X-CSRFToken, Authorization (Bearer token)
- **Body**: None
- **Success Response**:
  - **Code**: 200 OK
  - **Content**: Array of to-do list objects.
- **Error Response**:
  - **Code**: 4XX/5XX (e.g., 401 UNAUTHORIZED, 404 NOT FOUND)
  - **Content**: Error message detailing the failure.

### createTodoList
- **Purpose**: Creates a new to-do list.
- **Method**: POST
- **Endpoint**: `${API_URL}create/`
- **Headers**: Content-Type (application/json), X-CSRFToken, Authorization (Bearer token)
- **Body**: JSON containing `newTodoListData`
- **Success Response**:
  - **Code**: 200 OK / 201 Created
  - **Content**: `{ success: true, data: object }`
- **Error Response**:
  - **Code**: 4XX/5XX (e.g., 400 BAD REQUEST, 401 UNAUTHORIZED)
  - **Content**: `{ success: false, message: string }`

### markTodoList
- **Purpose**: Marks a specified to-do list item.
- **Method**: PATCH
- **Endpoint**: `${API_URL}mark/${todoId}/`
- **Headers**: Content-Type (application/json), X-CSRFToken, Authorization (Bearer token)
- **Body**: Empty JSON object
- **Success Response**:
  - **Code**: 200 OK
  - **Content**: `{ success: true, message: 'To-do list marked successfully' }`
- **Error Response**:
  - **Code**: 4XX/5XX (e.g., 400 BAD REQUEST, 401 UNAUTHORIZED)
  - **Content**: `{ success: false, message: string }`

### deleteTodoList
- **Purpose**: Deletes a specified to-do list item.
- **Method**: DELETE
- **Endpoint**: `${API_URL}delete/${todoId}/`
- **Headers**: Content-Type (application/json), X-CSRFToken, Authorization (Bearer token)
- **Body**: None
- **Success Response**:
  - **Code**: 200 OK / 201 Created
  - **Content**: `{ success: true, message: 'To-do list deleted successfully' }`
- **Error Response**:
  - **Code**: 4XX/5XX (e.g., 400 BAD REQUEST, 401 UNAUTHORIZED)
  - **Content**: `{ success: false, message: string }`

### loginWithGitHub
- **Purpose**: Initiates GitHub login process.
- **Method**: GET (Browser Link Opening)
- **Endpoint**: `${BASE_URL}/github/login/?process=login`
- **Headers**: None (handled by browser)
- **Body**: None
- **Note**: The backend should handle the redirect after login and possibly send a deep link back to the app.

### fetchCsrfToken
- **Purpose**: Retrieves a CSRF token and stores it in AsyncStorage.
- **Method**: GET
- **Endpoint**: `${BASE_URL}/csrf-token/`
- **Headers**: None
- **Body**: None
- **Note**: Error handling for non-200 responses.

### login
- **Purpose**: Authenticates user with username and password.
- **Method**: POST
- **Endpoint**: `${BASE_URL}/login2/`
- **Headers**: 'Content-Type': 'application/json', 'X-CSRFToken'
- **Body**: JSON containing `{ username, password }`
- **Success Response**: `{ success: boolean, message: string }`
- **Error Response**: `{ success: false, message: 'Invalid credentials' }` or other HTTP errors.

### registerUser
- **Purpose**: Registers a new user.
- **Method**: POST
- **Endpoint**: `${BASE_URL}/register/`
- **Headers**: 'Content-Type': 'application/json'
- **Body**: JSON containing `userData`
- **Note**: Error and success handling based on response status.

### fetchUserData
- **Purpose**: Fetches user profile data.
- **Method**: GET
- **Endpoint**: `${BASE_URL}/profile/`
- **Headers**: 'X-CSRFToken', 'Authorization' (Bearer token)
- **Body**: None
- **Note**: Error handling for non-200 responses.

### changePassword
- **Purpose**: Changes the user's password.
- **Method**: POST
- **Endpoint**: `${BASE_URL}/change-password/`
- **Headers**: 'Content-Type': 'application/json', 'X-CSRFToken', 'Authorization' (Bearer token)
- **Body**: JSON containing `{ current_password, new_password }`
- **Success/Error Response**: Based on response status.

### verifyOTP
- **Purpose**: Verifies OTP during registration.
- **Method**: POST
- **Endpoint**: `${BASE_URL}/register/verify-otp/`
- **Headers**: 'Content-Type': 'application/json'
- **Body**: JSON containing `{ otp }`
- **Note**: Error and success handling as per response.

### logoutUser
- **Purpose**: Logs out the user.
- **Method**: POST
- **Endpoint**: `${BASE_URL}/logout/`
- **Headers**: 'Content-Type': 'text/html; charset=utf-8', 'X-CSRFToken'
- **Body**: None
- **Note**: Response handling based on status code.

### changeEmail
- **Purpose**: Changes the user's email.
- **Method**: POST
- **Endpoint**: `${BASE_URL}/change-email/`
- **Headers**: 'Content-Type': 'application/json', 'X-CSRFToken', 'Authorization' (Bearer token)
- **Body**: JSON containing `{ new_Email: newEmail }`
- **Success/Error Response**: Based on response status.

### changeProfession
- **Purpose**: Changes the user's profession.
- **Method**: POST
- **Endpoint**: `${BASE_URL}/change-profession/`
- **Headers**: 'Content-Type': 'application/json', 'X-CSRFToken', 'Authorization' (Bearer token)
- **Body**: JSON containing `{ new_Profession: newProfession }`
- **Success/Error Response**: Based on response status.

### changePhone
- **Purpose**: Changes the user's phone number.
- **Method**: POST
- **Endpoint**: `${BASE_URL}/change-phone/`
- **Headers**: 'Content-Type': 'application/json', 'X-CSRFToken', 'Authorization' (Bearer token)
- **Body**: JSON containing `{ new_Phone: newPhone }`
- **Success/Error Response**: Based on response status.

### resetPassword
- **Purpose**: Initiates password reset process.
- **Method**: POST
- **Endpoint**: `${BASE_URL}/password/reset/`
- **Headers**: 'Content-Type': 'application/x-www-form-urlencoded', 'X-CSRFToken'
- **Body**: Form data containing `{ email }`
- **Success/Error Response**: Based on response data or error message.

