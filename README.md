# Mybackend Project README

## User Account Functions

<<<<<<< HEAD
•	Login
•	Register
•	View details
•	Change email
•	Change password
•	Change phone
•	Change profession
•	Confirm email registered through OTP
•	Login using other platforms
=======
- **Login**: User can log in to their account.
- **Register**: New users can create an account.
- **View Details**: Users can view their account details.
- **Change Email**: Allows users to update their email address.
- **Change Password**: Users can change their account password.
- **Change Phone**: Update the phone number associated with the account.
- **Change Profession**: Users can update their profession details.
- **Confirm Email**: Verify the email address registered through OTP (One-Time Password).
- **Login using other platforms**: Facilitates logging in via different platforms.
>>>>>>> 8b13d9924b10866a70b4584f09b990328c139a1c

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

<<<<<<< HEAD
•	OTP when signed in
=======
- **OTP When Signed In**: Implement OTP verification during sign-in.
- **forget password**: reset password.
  
### Calendar
>>>>>>> 8b13d9924b10866a70b4584f09b990328c139a1c

- **Assistant**: Add assistant functionality.

### Emails

- **Read the Inbox (IMAP)**: Implement inbox reading via IMAP.
- **Send an Email (IMAP)**: Enable sending emails through IMAP.
- **Set Priority Emails**: Allow setting priority for emails based on a provided list.

### Database

- **Integrate Viewing Security**: Enhance security through an integrated view.

## Steps to Run the Backend

### Step 1: Create a New Environment

- Make a new environment (outside the Mybackend folder):  
  `python -m venv myenv`
- Activate the environment:  
  - Linux: `source myenv/bin/activate`  
  - Windows: `myenv\Scripts\activate`

### Step 2: Install Dependencies

- Go to the directory: `cd Mybackend`
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
