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
  To create a legally binding statement for your README file on GitHub, it's important to clearly state your terms. Here's a suggested wording:

---

## License and Usage Rights

### Author and Copyright Holder
**Author:** Hamzeh Hirzalla

### Copyright Notice
All rights reserved. The test front-end, including all associated code and documentation in this repository, is the exclusive property of Hamzeh Hirzalla.

### Usage Restrictions
This test front-end is private and proprietary. As the sole author and copyright holder, I, Hamzeh Hirzalla, reserve all rights to the use, distribution, and publication of the test front-end. No other individual or entity is authorized to use, reproduce, distribute, or publish this test front-end in any form or for any purpose, without explicit written permission from me.

### Legal Implications
Unauthorized use, reproduction, distribution, or publication of this test front-end, in whole or in part, may result in legal action for infringement of copyright.

### Contact Information
For permissions or inquiries, please contact [0544675125].
Certainly, you can add a section to your README that addresses the use of deleted API call functions. Here's how you could word it:

---

## Additional Notice on Deleted API Call Functions

### Status of Deleted API Call Functions
In the development of this test front-end, certain API call functions were created and subsequently deleted from the final version of the repository.

### Restrictions on Deleted Content
It is important to note that these deleted API call functions, although not present in the current version of the repository, are still covered under the same copyright and usage restrictions as the rest of the test front-end. 

### Prohibition on Use of Deleted Content
Any individual or entity who has downloaded or otherwise obtained these deleted API call functions prior to their removal is expressly prohibited from using, reproducing, distributing, or publishing these functions, in any form or for any purpose. This prohibition applies equally to both the current contents of the repository and any previously deleted content.

### Legal Implications
Unauthorized use of any deleted content from this repository will be subject to the same legal actions as unauthorized use of current content, as detailed above.

---
Certainly, you can add a section to your README that specifies the intended purpose of the test front end and API, and restricts its use for certain projects, such as the final project subject at the University of Wollongong in Dubai (UOWD) or by any other entity. Here's an example of how you could word it:

---

## Statement of Purpose and Restriction on Academic and Commercial Use

### Intended Purpose
The test front end and associated API were developed by me, Hamzeh Hirzalla, solely for personal use. These tools are part of my ongoing learning process and are intended to be utilized in my future projects.

### Restriction on Academic Use
It is specifically noted that the test front end and API are not to be used as part of the final project subject or any other academic assignments at the University of Wollongong in Dubai (UOWD), or at any other academic institution. This restriction is in place to maintain the integrity of academic work and to ensure that all projects and assignments are the original work of the students involved.

### Prohibition on Use by External Entities
Furthermore, no external entity, including but not limited to businesses, organizations, or individuals, is authorized to use the test front end and API for any commercial or non-commercial purpose. This includes, but is not limited to, development, research, and publication purposes.

### Legal Implications
Any unauthorized use of the test front end and API, in violation of these terms, will be subject to legal actions for infringement of copyright and breach of these terms.

---


