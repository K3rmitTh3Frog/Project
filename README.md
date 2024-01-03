# Mybackend Project README

## User Account Functions

- **Login**: Users can log in to their accounts.
- **Register**: New users can create an account.
- **View Details**: Users can view their account information.
- **Change Email**: Allows users to update their email address.
- **Change Password**: Users can change their account password.
- **Change Phone**: Update the phone number associated with the account.
- **Change Profession**: Users can update their profession details.
- **Confirm Email**: Verify the email address registered through OTP (One-Time Password).
- **Login using other platforms**: Facilitates logging in via different platforms.
- **Forgot Password**: Implement password reset functionality.

## To-do List Features

- **Create a Task**: Users can add new tasks.
- **Mark Finished Tasks**: Mark tasks as completed.
- **Delete a Task**: Remove tasks from the list.
- **Update a Field**: Modify task details (e.g., priority).
- **View All Tasks**: Display all tasks.
- **View a Specific Task**: Look at details of a particular task.

## Calendar Functionality

- **Create Event**: Add new events.
- **Delete an Event**: Remove events.
- **Update a Field**: Change event details (e.g., title).
- **View Event**: See event details.

## Remaining Functions To Implement

### Account

- **OTP When Signed In**: Implement OTP verification during sign-in.
- **Forgot Password**: Implement password reset functionality.

### Calendar

- **Assistant**: Add assistant functionality.

### Emails

- **Read the Inbox (IMAP)**: Implement inbox reading via IMAP.
- **Send an Email (IMAP)**: Enable sending emails through IMAP.
- **Set Priority Emails**: Allow setting priority for emails based on a provided list.

### Database

- **Integrate Viewing Security**: Enhance security through an integrated view.

## Steps to Run the Backend

### Step 1: Create a New Environment

- Create a new environment (outside the Mybackend folder):  
  `python -m venv myenv`
- Activate the environment:  
  - Linux: `source myenv/bin/activate`  
  - Windows: `myenv\Scripts\activate`

### Step 2: Install Dependencies

- Navigate to the directory: `cd Mybackend`
- Install required packages:  
  `pip install -r requirements.txt`

### Step 3: Database Migrations and Server Start

- Prepare database migrations:  
  `python manage.py makemigrations`
- Apply migrations:  
  `python manage.py migrate`
- Start the server:  
  `python manage.py runserver`

## Note

- A test frontend using React Native integrated with Expo.dev is provided for testing purposes.
