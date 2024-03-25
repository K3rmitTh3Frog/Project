# Project README

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
- **Forgot Password**: password reset functionality.
- **Forgot Password**: password reset functionality.

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
- **Assistant**: assistant functionality.

## email Functionality

- **Read the Inbox**: Implement inbox reading via Gmail API.
- **Set Priority Emails**: Allow setting priority for emails based on a provided list.



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
## Mistral 7B model and Gemini chatbot
- A virtiual enviromnt must be created for the model
- Install the dependencies from the reqiuremets.txt files provided in each folder
- Mistral 7B model needs LM studio to run:
- step 1: download LM studio
- step 2: go the file icon on the left and upload the model
- step 3  go to local server and start the server
- step 4: use `python app.py runserver` to start the server 
  Disclaimer for Mistral7B model:
  Since its an LLm it might take time to generate a to-do list because of your system. The system specfications that were used to run the model smoothly were: Processor	13th Gen Intel(R) Core(TM) i7-13650HX, 2600 Mhz, 14 Core(s), 20 Logical Processor(s) and NVIDIA GeForce RTX 4060 Laptop GPU, NVIDIA compatible 




---


