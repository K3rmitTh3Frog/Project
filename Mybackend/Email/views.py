from django.shortcuts import render
from rest_framework.views import APIView

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
import jwt
from .serializers import *
from .models import CustomUser, Email
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponse
from .models import CustomUser
from .scripts.emailinbox import fetch_and_store_emails
from django.contrib.auth import (
    authenticate,
    login,
    logout,
)
from django.contrib import messages

from django.conf import settings
import os
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1' #this might be security issue
import os
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import AnonymousUser
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.http import JsonResponse
from django.middleware.csrf import get_token
from rest_framework import generics, status
from rest_framework.authentication import SessionAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
import jwt
import datetime
from .serializers import *
from django.core.mail import send_mail
import random
from google_auth_oauthlib.flow import Flow
from django.shortcuts import redirect
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.http import HttpResponse
import json
from django.http import JsonResponse
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

class EmailView(generics.ListAPIView):
    serializer_class = EmailSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Fetch and store latest emails
        list_emails_view = ListEmailsView()
        list_emails_view.request = self.request
        list_emails_view.get(self.request)

        # Now fetch the stored emails from the database
        user = self.request.user
        return Email.objects.filter(UserID=user).order_by('-ReceivedDate')
    
class EmailViewNoRefresh(generics.ListAPIView):
    serializer_class = EmailSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        
        user = self.request.user
        return Email.objects.filter(UserID=user, isDeleted=False).order_by('-ReceivedDate')
    
class CreateEmail(generics.CreateAPIView):
    serializer_class = CreateEmailSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(UserID=user)

class DeleteEmailView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, EmailID):
        user = self.request.user
        try:
            email_item = Email.objects.get(pk=EmailID, UserID=user)
        except Email.DoesNotExist:
            return Response({"error": "email item not found"}, status=status.HTTP_404_NOT_FOUND)

        email_item.isDeleted = True
        email_item.save()

        return Response({"success": "email item marked as deleted"}, status=status.HTTP_204_NO_CONTENT)
    
class SpecificEmailView(generics.ListAPIView):
    serializer_class = EmailSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, EmailID):
        user = self.request.user
        try:
            todo_item = Email.objects.get(pk=EmailID, UserID=user)
        except Email.DoesNotExist:
            return Response({"error": "Event item not found"}, status=status.HTTP_404_NOT_FOUND)

        # Serialize the todo item
        serializer = EmailSerializer(todo_item)
        return Response(serializer.data)

class ChangeEmailPriorityView(generics.GenericAPIView):
    serializer_class = ChangePrioritySerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, email_id):
        user = self.request.user
        try:
            email_item = Email.objects.get(pk=email_id, UserID=user)
        except Email.DoesNotExist:
            return Response({"error": "Email not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            email_item.IsPriority = serializer.validated_data.get('new_IsPriority')
            email_item.save()
            return Response({"success": "Email priority updated successfully"}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from django.shortcuts import render
from .scripts.emailinbox import fetch_and_store_emails

class DeleteAllEmailsView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        user = self.request.user
        try:
            # Get all emails for the authenticated user
            emails_to_delete = Email.objects.filter(UserID=user)

            # Delete all emails
            emails_to_delete.delete()

            return Response({"success": "All emails deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def fetch_emails_view(request):
    try:
        # Get the logged-in user
        django_user = CustomUser.objects.get(email=request.user.email)

        # Call the fetch_and_store_emails function
        return fetch_and_store_emails(django_user)
    except CustomUser.DoesNotExist:
        return HttpResponse("Logged-in user does not exist in the CustomUser model.", status=404)
    except Exception as e:
        return HttpResponse(str(e), status=500)
    

#priorityEmails
class PriorityEmailListView(generics.ListAPIView):
    serializer_class = PriorityEmailSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return PriorityEmail.objects.filter(UserID=user)

class CreatePriorityEmailView(generics.CreateAPIView):
    serializer_class = CreatePriorityEmailSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(UserID=user)

class DeletePriorityEmailView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, PriorityID):
        user = self.request.user
        try:
            priority_email = PriorityEmail.objects.get(pk=PriorityID, UserID=user)
        except PriorityEmail.DoesNotExist:
            return Response({"error": "Priority email not found"}, status=status.HTTP_404_NOT_FOUND)

        priority_email.delete()
        return Response({"success": "Priority email deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
import json
from bs4 import BeautifulSoup
from datetime import datetime
from rest_framework.permissions import IsAuthenticated

from dateutil.parser import parse
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
import json
import re
from bs4 import BeautifulSoup
from datetime import datetime
from rest_framework.permissions import IsAuthenticated
from .models import CustomUser, Email, PriorityEmail
class ListEmailsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if not user.gmail_credentials:
            return Response({"error": "Gmail not linked"}, status=status.HTTP_400_BAD_REQUEST)

        creds = Credentials.from_authorized_user_info(json.loads(user.gmail_credentials))
        if creds.expired:
            creds.refresh(Request())

        service = build('gmail', 'v1', credentials=creds)

        # Retrieve priority email addresses for the user and convert them to lowercase
        priority_emails = [email.lower() for email in PriorityEmail.objects.filter(UserID=user).values_list('EmailAddress', flat=True)]

        try:
            results = service.users().messages().list(userId='me', maxResults=10).execute()
            messages = results.get('messages', [])

            for msg in messages:
                txt = service.users().messages().get(userId='me', id=msg['id'], format='full').execute()

                subject = ""
                sender = ""
                received_date = None
                snippet = txt.get('snippet', '')

                for header in txt['payload']['headers']:
                    if header['name'] == 'Subject':
                        subject = header['value']
                    elif header['name'] == 'From':
                        sender = header['value']
                    elif header['name'] == 'Date':
                        received_date = parse(header['value']).replace(tzinfo=None)

                # Check if the received_date is None and set to current time if it is
                if not received_date:
                    received_date = datetime.now()

                # Extract email address from sender and convert to lowercase
                sender_email = sender.split('<')[-1].split('>')[0].lower()

                # Check if the sender's email is a priority email
                is_priority = 10 if sender_email in priority_emails else 0

                # Check for duplicates before saving
                if not Email.objects.filter(
                    Sender=sender,
                    Reciever=user.email,
                    Subject=subject,
                    ReceivedDate=received_date,
                    UserID=user
                ).exists():
                    # Extract the email body
                    email_body = BeautifulSoup(snippet, 'html.parser').get_text(separator='\n')

                    # Create a new Email instance and save it
                    new_email = Email(
                        UserID=user,
                        Sender=sender,
                        Reciever=user.email,
                        Subject=subject,
                        Body=email_body,
                        ReceivedDate=received_date,
                        IsPriority=is_priority,  # Set priority
                    )
                    new_email.save()

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return HttpResponse("Emails fetched and stored successfully.")
    