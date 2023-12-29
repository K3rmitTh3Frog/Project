working functions for the current backend code

User account

•	Login
•	Register
•	View details
•	Change email
•	Change password
•	Change phone
•	Change profession
•	Confirm email registered through OTP

To-do-list

•	Create a task
•	Mark finished tasks
•	Delete a task
•	Update a field (priority, etc.)
•	View all tasks
•	View a specific task

Calendar

•	Create event
•	Delete an event
•	Update a field (title, etc.)
•	View event

remaining functions to do

account

•	OTP when signed in
•	Login using other platforms

calendar

•	Assistant 

Emails

•	Read the inbox( IMAP)
•	Send an email (IMAP)
•	set priority emails from the email list provided by the user

database

•	integrating view to enhance the security is missing

to run the backend 

step1.

make a new environment (environment outside the Mybackend folder)

python -m venv myenv

activate the environment

linux: source myenv/bin/activate

windows: myenv\Scripts\activate

step 2

go to the directory: cd Mybackend

pip install -r requirements.txt

step 3 

python manage.py runserver





