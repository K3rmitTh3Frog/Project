import requests

# Client credentials
client_id = 'f167588e-779c-4604-894e-dc7afafd0955'
redirect_uri = 'http://localhost:8000/auth/callback/microsoft/'  # You need to configure this in your Azure AD app registration
scope = 'https://graph.microsoft.com/Mail.Read'
authorization_url = f'https://login.microsoftonline.com/common/oauth2/v2.0/authorize'

# Construct the authorization URL
authorization_params = {
    'client_id': client_id,
    'response_type': 'code',
    'redirect_uri': redirect_uri,
    'scope': scope
}

authorization_response = requests.get(authorization_url, params=authorization_params)

# Check if the authorization was successful
if authorization_response.status_code == 200:
    # Redirect the user to Microsoft login page
    print("Please login:")
    print(authorization_response.url)
    # Once the user logs in and grants permission, they will be redirected to your redirect_uri with a code
    authorization_code = input("Enter the authorization code from the redirected URL: ")

    # Exchange authorization code for access token
    token_url = 'https://login.microsoftonline.com/common/oauth2/v2.0/token'
    token_data = {
        'grant_type': 'authorization_code',
        'client_id': client_id,
        'redirect_uri': redirect_uri,
        'client_secret': 'mt-8Q~HB2OUd-xuClLA9jwlaBcozx-5MvkZDwbDz',  # Your client secret
        'code': authorization_code,
        'scope': scope
    }

    token_response = requests.post(token_url, data=token_data)
    token_response_data = token_response.json()

    # Check if access token was obtained successfully
    if 'access_token' in token_response_data:
        access_token = token_response_data['access_token']
        print("Access token:", access_token)
    else:
        print("Failed to obtain access token.")
else:
    print("Failed to initiate authorization.")
