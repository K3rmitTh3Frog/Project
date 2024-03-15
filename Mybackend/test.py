import msal
import requests
import webbrowser

# Initialize the MSAL Confidential Client Application with your application credentials
client_id = 'f167588e-779c-4604-894e-dc7afafd0955'
tenant_id = '36d7d46d-cb4c-4f31-8596-784215fd88d6'
authority = f"https://login.microsoftonline.com/{tenant_id}"
app = msal.ConfidentialClientApplication(client_id, authority=authority)

# Define the scope and redirect URI for interactive authentication
scopes = ["Mail.Read"]
redirect_uri = "http://localhost"  # Assuming you've configured this as the redirect URI for your app

# Get the authorization URL for interactive login
auth_url = app.get_authorization_request_url(scopes, redirect_uri=redirect_uri)

# Open the authorization URL in a web browser to prompt the user to log in
webbrowser.open(auth_url)

# After the user has logged in and granted permissions, they will be redirected to the redirect URI
# Parse the redirected URL to extract the authorization code
redirected_url = input("Enter the redirected URL: ")
response = app.acquire_token_by_authorization_code(redirected_url, scopes=scopes, redirect_uri=redirect_uri)

# If an access token was successfully acquired, make a request to read emails
if "access_token" in response:
    endpoint = 'https://graph.microsoft.com/v1.0/me/messages?$select=sender,subject'
    headers = {'Authorization': 'Bearer ' + response['access_token']}
    response = requests.get(endpoint, headers=headers)
    if response.ok:
        emails = response.json()
        for email in emails['value']:
            print(email['subject'] + ' (' + email['sender']['emailAddress']['name'] + ')')
else:
    print("Error obtaining access token")
