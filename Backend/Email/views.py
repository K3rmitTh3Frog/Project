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
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1' 
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
# views.py
import requests
from bs4 import BeautifulSoup
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

import json
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from googleapiclient.discovery import build

class MarkEmailAsRead(APIView):
    serializer_class = MarkEmailAsReadSerializer
    def post(self, request):
        serializer = MarkEmailAsReadSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email_id = serializer.validated_data['email_id']
        user = request.user
        if not user.gmail_credentials:
            return Response({"error": "Gmail not linked"}, status=status.HTTP_400_BAD_REQUEST)

        creds = Credentials.from_authorized_user_info(json.loads(user.gmail_credentials))
        if creds.expired:
            creds.refresh(Request())

        service = build('gmail', 'v1', credentials=creds)
        try:
            service.users().messages().modify(
                userId='me',
                id=email_id,
                body={'removeLabelIds': ['UNREAD']}
            ).execute()
            return Response({"message": f"Email with ID {email_id} marked as read."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class EmailView(generics.ListAPIView):
    serializer_class = EmailSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        list_emails_view = ListEmailsView()
        list_emails_view.request = self.request
        list_emails_view.get(self.request)

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
        user = request.user
        try:
            email_item = Email.objects.get(EmailID=EmailID, UserID=user)
        except Email.DoesNotExist:
            return Response({"error": "Email item not found"}, status=status.HTTP_404_NOT_FOUND)

        if email_item.GmailEmailID:
            self.mark_email_as_read(user, email_item.GmailEmailID)
            email_item.isOpen=True
        serializer = EmailSerializer(email_item)
        return Response(serializer.data)

    def mark_email_as_read(self, user, gmail_email_id):
        if not user.gmail_credentials:
            return JsonResponse({"error": "Gmail not linked"}, status=status.HTTP_400_BAD_REQUEST)

        creds = Credentials.from_authorized_user_info(json.loads(user.gmail_credentials))
        if creds.expired:
            creds.refresh(Request())

        service = build('gmail', 'v1', credentials=creds)
        try:
            service.users().messages().modify(
                userId='me',
                id=gmail_email_id,
                body={'removeLabelIds': ['UNREAD']}
            ).execute()
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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
            emails_to_delete = Email.objects.filter(UserID=user)

            emails_to_delete.delete()

            return Response({"success": "All emails deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def fetch_emails_view(request):
    try:
        django_user = CustomUser.objects.get(email=request.user.email)

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
        return Response({"success": "Priority email deleted successfully"}, status=status.HTTP_200_OK)
    
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
import json

from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import HttpResponse
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from bs4 import BeautifulSoup
from dateutil.parser import parse
from datetime import datetime
import json

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
                isOpen = 'UNREAD' not in txt.get('labelIds', []) 

                for header in txt['payload']['headers']:
                    if header['name'] == 'Subject':
                        subject = header['value']
                    elif header['name'] == 'From':
                        sender = header['value']
                    elif header['name'] == 'Date':
                        received_date = parse(header['value']).replace(tzinfo=None)

                if not received_date:
                    received_date = datetime.now()

                sender_email = sender.split('<')[-1].split('>')[0].lower()
                is_priority = 10 if sender_email in priority_emails else 0

                email_id = msg['id']

                existing_email = Email.objects.filter(
                    Sender=sender,
                    Reciever=user.email,
                    Subject=subject,
                    ReceivedDate=received_date,
                    UserID=user
                ).first()

                if existing_email:
                    if existing_email.isOpen != isOpen:
                        existing_email.isOpen = isOpen
                        existing_email.GmailEmailID = email_id 
                        existing_email.save()
                else:
                    email_body = BeautifulSoup(snippet, 'html.parser').get_text(separator='\n')
                    new_email = Email(
                        UserID=user,
                        Sender=sender,
                        Reciever=user.email,
                        Subject=subject,
                        Body=email_body,
                        ReceivedDate=received_date,
                        IsPriority=is_priority,
                        isOpen=isOpen,
                        GmailEmailID=email_id  
                    )
                    chat_with_AI(request, email_body=email_body, received_date=received_date, sender_email=sender)
                    new_email.save()

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return HttpResponse("Emails fetched and stored successfully.")


    

class PriorityEmailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, priority):
        user = request.user
        emails = Email.objects.filter(UserID=user, IsPriority=priority)
        serializer = EmailSerializer(emails, many=True)
        return Response(serializer.data)
    

from django.utils import timezone
class TodaysEmailsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        today = timezone.localtime(timezone.now()).date()

        todays_emails = Email.objects.filter(
            UserID=user, 
            ReceivedDate__date=today, 
            isDeleted=False
        )

        unopened_emails_count = todays_emails.filter(isOpen=False).count()
        opened_emails_count = todays_emails.filter(isOpen=True).count()

        return Response({
            "unopened_emails_today": unopened_emails_count,
            "opened_emails_today": opened_emails_count,
            'total':unopened_emails_count+opened_emails_count
        })
    
class OpenEmailView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, email_id):
        user = request.user
        try:
            email = Email.objects.get(EmailID=email_id, UserID=user)

            email.isOpen = True
            email.save()

            return Response({"success": "Email marked as opened"}, status=status.HTTP_200_OK)
        except Email.DoesNotExist:
            return Response({"error": "Email not found"}, status=status.HTTP_404_NOT_FOUND)
        



from toDoList.models import ToDoList
from datetime import datetime

from django.http import JsonResponse
from datetime import timedelta




from datetime import datetime
from django.utils.dateparse import parse_datetime
from bs4 import BeautifulSoup
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Email, PriorityEmail
from django.core.exceptions import ObjectDoesNotExist



class FetchEmails(APIView):
    def get(self, request):
        user = request.user
        if not user.Microsoft_credentials:
            return Response({"error": "microsoft not linked"}, status=status.HTTP_400_BAD_REQUEST)
        token = user.Microsoft_credentials
        url = 'https://graph.microsoft.com/v1.0/me/messages?$top=300'
        headers = {'Authorization': 'Bearer ' + token}
        print(token)
        try:
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            emails = response.json().get('value', [])
            for email in emails:
                subject = email.get('subject', 'No Subject')
                sender_name = email['sender']['emailAddress'].get('name', 'No Name')
                sender_address = email['sender']['emailAddress'].get('address', 'No Address')
                date = parse_datetime(email.get('sentDateTime', ''))
                body_html = email['body'].get('content', '')

                soup = BeautifulSoup(body_html, 'html.parser')
                body_text = soup.get_text()

                try:
                    existing_email = Email.objects.get(
                        Subject=subject,
                        Sender=sender_address,
                        ReceivedDate=date,
                        UserID=user
                    )
                    continue
                except ObjectDoesNotExist:
                    pass

                priority_emails = PriorityEmail.objects.filter(UserID=user).values_list('EmailAddress', flat=True)
                is_priority = 10 if sender_address.lower() in priority_emails else 0

                new_email = Email.objects.create(
                    UserID=user,
                    Sender=sender_address,
                    Reciever=user.name,  
                    Subject=subject,
                    Body=body_text.strip(),
                    ReceivedDate=date,
                    IsPriority=is_priority
                )
            return Response({"message": "Emails fetched and stored successfully."}, status=status.HTTP_200_OK)
        except requests.exceptions.RequestException as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except KeyError as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



from rest_framework.decorators import api_view
from rest_framework.response import Response
from openai import OpenAI

client = OpenAI(base_url="http://localhost:1234/v1", api_key="not-needed")

prompts = [
    "You are a highly efficient assistant. From the following email, extract any tasks mentioned, including their priority inferred from urgency. Notes field in the output should include the sender's email address the date received if giving. Estimate the time needed based on details provided and assume a time estimation for tasks where the estimation time is not explicitly provided. Format the output with: Priority (High, Medium, Low), Due Date (in date format DD/MM/YY), Description, Category, Notes, Time Estimate (you have to estimate), Reminders (set to null by default), and set Status as 'Not Started'. if there is no tasks please return 'No task'. Time Estimate should be like 1:30, no hour, etc mention.",
    "example of an output: Priority: Medium, Due Date: 21/02/24, Description: Follow up on the Marketing Coordinator position application at Bright Horizon Solutions, Notes: sender: hamzehhirzalla@outlook.com and received date: 1/11/2003, Time Estimate: 0:30, Reminders: null, Status: Not Started, Category: follow Up",
]

def chat_with_AI(request):
    if request.method == 'POST':
        body = request.data.get("emailBody", "")
        received_date = request.data.get("receivedDate", None)
        senderEmail = request.data.get("senderEmail", "")
        received_date_str = received_date.strftime('%Y-%m-%d') if received_date else ""
        messages = ['Email ' + body + ' received date ' + received_date_str + ' sender email: '+senderEmail]

        if not messages:
            response_data = {"message": "Messages can't be empty!"}
            return Response(response_data, status=400)

        completion = client.chat.completions.create(
            model="local-model",  
            messages=[
                {"role": "system", "content": ". ".join(prompts)},
                {"role": "user", "content": ". ".join(messages)},
            ],
            temperature=0.7,
        )
        response_data = {"content": completion.choices[0].message.content}

        if response_data["content"] != 'No task':
            save_task_from_message(response_data["content"], request.user)  

        return Response(response_data, status=200)
    else:
        return Response({"message": "Method not allowed"}, status=405)

def save_task_from_message(message_content, user):
    task_details = {}
    lines = message_content.split(',')
    for line in lines:
        parts = line.split(':', 1)
        if len(parts) == 2:
            key, value = parts
            task_details[key.strip()] = value.strip()

    due_date_str = task_details.get("Due Date", None)

    if due_date_str:
        if len(due_date_str.split('/')[-1]) == 2:
            due_date_format = "%d/%m/%y"
        else:
            due_date_format = "%d/%m/%Y"

        due_date = datetime.strptime(due_date_str, due_date_format)
    else:
        due_date = None

    time_estimate_str = task_details.get("Time Estimate", "dd")
    time_estimate = parse_time_estimate(time_estimate_str)

    ToDoList.objects.create(
        UserID=user,
        Priority=get_priority(task_details.get("Priority")),
        Due=due_date,
        Description=task_details.get("Description"),
        Category=task_details.get("Category"),
        Notes=task_details.get("Notes"),
        Time_Estimate=time_estimate,  
        Reminders=None,  
        Status=task_details.get("Status", "Not Started")
    )

def get_priority(priority_str):
    priority_map = {"High": 10, "Medium": 5, "Low": 1}
    return priority_map.get(priority_str, 1)

def parse_time_estimate(time_estimate_str):
    if time_estimate_str:
        hours, minutes = map(int, time_estimate_str.split(':'))
        return timedelta(hours=hours, minutes=minutes)
    return timedelta()