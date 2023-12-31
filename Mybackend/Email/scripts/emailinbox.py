from django.http import HttpResponse
from exchangelib import Credentials, Account, Configuration, DELEGATE, EWSTimeZone
from bs4 import BeautifulSoup
from ..models import Email, CustomUser
from datetime import datetime

def fetch_and_store_emails(django_user):
    # Set fixed credentials
    username = 'project321test@outlook.com'
    password = 'test123123'

    # Set up the credentials and account
    credentials = Credentials(username, password)
    config = Configuration(server='outlook.office365.com', credentials=credentials)
    account = Account(primary_smtp_address=username, config=config, autodiscover=False, access_type=DELEGATE)

    # Function to extract text content from HTML with CSS
    def extract_text_from_html(html_content):
        soup = BeautifulSoup(html_content, 'html.parser')
        text_content = soup.get_text(separator='\n')
        return text_content

    # Define the target timezone (adjust as needed)
    target_timezone = EWSTimeZone('Europe/Copenhagen')

    # Fetch the inbox and add emails to the database
    for item in account.inbox.all().order_by('-datetime_received')[:10]:  # Adjust as needed
        # Check for duplicates before saving
        if not Email.objects.filter(
            Sender=item.sender.email_address,
            Reciever=django_user.email,
            Subject=item.subject,
            ReceivedDate=datetime(*item.datetime_received.timetuple()[:6], tzinfo=item.datetime_received.tzinfo),
            UserID=django_user
        ).exists():
            # Extract the email body
            if item.body:
                email_body = extract_text_from_html(item.body)
            else:
                email_body = ""

            # Create a new Email instance and save it
            new_email = Email(
                UserID=django_user,
                Sender=item.sender.email_address,
                Reciever=django_user.email,
                Subject=item.subject,
                Body=email_body,  # Save the email body
                ReceivedDate=datetime(*item.datetime_received.timetuple()[:6], tzinfo=item.datetime_received.tzinfo),
                # Add any other fields you might have
            )
            new_email.save()
    
    return HttpResponse("Emails fetched and stored successfully.")
