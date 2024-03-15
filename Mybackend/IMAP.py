import imaplib
import email
from email.header import decode_header

# Login to IMAP server
imap_url = 'outlook.office365.com'
email_user = 'hamzehhirzalla@outlook.com'
email_pass = 'Hamzehm@2003'

# Connect to the Outlook server
mail = imaplib.IMAP4_SSL(imap_url)

# Login to the account
mail.login(email_user, email_pass)

# Select the mailbox you want to check (INBOX, for example)
mail.select('inbox')

# Search for specific mails by criteria
# 'ALL' returns all messages in the inbox
# You can use other criteria like 'UNSEEN' for unread emails
type, data = mail.search(None, 'ALL')

# Fetch emails
# Use the latest email id to fetch the latest email; data[0].split()[-1] refers to the latest email
email_id = data[0].split()[-1]
type, data = mail.fetch(email_id, '(RFC822)')  # Fetch the email using its id

# Parse the raw email content
raw_email = data[0][1]
raw_email_string = raw_email.decode('utf-8')

# Converts byte literal to string removing b''
email_message = email.message_from_string(raw_email_string)

# Assuming the email you are fetching is multipart (has attachments)
if email_message.is_multipart():
    for part in email_message.walk():
        # Get the content type of the email part
        content_type = part.get_content_type()
        content_disposition = str(part.get("Content-Disposition"))
        
        if content_type == "text/plain" and "attachment" not in content_disposition:
            # Print email text content
            print(part.get_payload(decode=True).decode())
        elif "attachment" in content_disposition:
            # Download attachment here
            filename = part.get_filename()
            if filename:
                print(f"Attachment: {filename}")
else:
    # If the email is not multipart
    print(email_message.get_payload(decode=True).decode())

# Close the connection and logout
mail.close()
mail.logout()
