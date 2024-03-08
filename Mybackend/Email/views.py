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
# views.py
import requests
from bs4 import BeautifulSoup
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


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

        # Filter emails for today
        todays_emails = Email.objects.filter(
            UserID=user, 
            ReceivedDate__date=today, 
            isDeleted=False
        )

        # Count unopened and opened emails
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

            # Update isOpen to True
            email.isOpen = True
            email.save()

            return Response({"success": "Email marked as opened"}, status=status.HTTP_200_OK)
        except Email.DoesNotExist:
            return Response({"error": "Email not found"}, status=status.HTTP_404_NOT_FOUND)
        

from openai import OpenAI
import time

# Initialize the OpenAI client with your API key
client = OpenAI(api_key="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")  # Replace YOUR_API_KEY_HERE with your actual API key
assistant_id = "asst_S508t24Tz9JLYmIs5TrnP7m4"  # The ID of your Assistant

def submit_message(assistant_id, thread_id, user_message):
    """
    Submit a message to the assistant and start a new Run.
    """
    # Create a message in the thread
    client.beta.threads.messages.create(
        thread_id=thread_id, role="user", content=user_message
    )
    # Start a new run with the assistant
    return client.beta.threads.runs.create(
        thread_id=thread_id,
        assistant_id=assistant_id,
    )

def get_response(thread_id):
    """
    Get the list of messages in a thread.
    """
    return client.beta.threads.messages.list(thread_id=thread_id, order="asc")

def create_thread_and_run(user_input):
    """
    Create a new thread and submit the user input to it.
    """
    # Create a new thread
    thread = client.beta.threads.create()
    # Submit the user message and start a new run
    run = submit_message(assistant_id, thread.id, user_input)
    return thread, run

def wait_on_run(run, thread):
    """
    Wait for a run to complete and then get the response.
    """
    while run.status == "queued" or run.status == "in_progress":
        run = client.beta.threads.runs.retrieve(
            thread_id=thread.id,
            run_id=run.id,
        )
        time.sleep(0.1)
    return run
def pretty_print(messages):
    """
    Pretty print the messages from a thread, correctly accessing message attributes.
    """
    print("# Messages")
    for m in messages:
        # Check if there is content and it's a non-empty list
        if m.content and len(m.content) > 0:
            # Access the 'text' attribute of the first item in the 'content' list, then 'value'
            message_text = m.content[0].text.value
        else:
            message_text = "No content found"
        
        print(f"{m.role}: {message_text}")
    print()

# Input for testing

from toDoList.models import ToDoList
from datetime import datetime

from django.http import JsonResponse
from datetime import timedelta


class AIAssistantView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Extract email content from the URL query string
        email_content = request.GET.get('email_content', None)
        received_date = request.GET.get('received_date', None)
        if not email_content:
            return JsonResponse({"error": "Email content parameter is missing"}, status=status.HTTP_400_BAD_REQUEST)
        if not received_date:
            return JsonResponse({"error": "received_date parameter is missing"}, status=status.HTTP_400_BAD_REQUEST)
        m = email_content+'date recieved'+received_date
        # Create a thread and run with the given input
        thread, run = create_thread_and_run(m)

        # Wait for the run to complete
        run = wait_on_run(run, thread)

        # Retrieve the messages
        messages = get_response(thread.id)

        # Prepare the response data
        response_data = {
            "messages": [{
                "role": m.role,
                "content": m.content[0].text.value if m.content and len(m.content) > 0 else "No content found"
            } for m in messages]
        }

        messages = response_data["messages"]

        # Process and save tasks before returning response
        
        for message in messages:
            if message["role"] == "assistant" and "Priority" in message["content"]:
               self.save_task_from_message(message["content"], request.user)

        # Prepare the original response data
        final_response_data = {
            "messages": [{
                "role": m["role"],
                "content": m["content"]
            } for m in messages]
        }

        return JsonResponse(final_response_data)

    def save_task_from_message(self, message_content, user):
        task_details = {}
        lines = message_content.split(',')
        for line in lines:
            parts = line.split(':', 1)
            if len(parts) == 2:
                key, value = parts
                task_details[key.strip()] = value.strip()

        due_date_str = task_details.get("Due Date", None)
        due_date = datetime.strptime(due_date_str, "%d/%m/%y") if due_date_str else None

        # Convert Time_Estimate string to timedelta
        time_estimate_str = task_details.get("Time Estimate", "dd")
        time_estimate = self.parse_time_estimate(time_estimate_str)
        ToDoList.objects.create(
            UserID=user,
            Priority=self.get_priority(task_details.get("Priority")),
            Due=due_date,
            Description=task_details.get("Description"),
            Category=task_details.get("Category"),
            
            Time_Estimate=time_estimate,  # Use the converted timedelta object
            Reminders=None,  # Assuming 'null' as default, adapt if needed
            Status=task_details.get("Status", "Not Started")
        )

    def get_priority(self, priority_str):
        priority_map = {"High": 10, "Medium": 5, "Low": 1}
        return priority_map.get(priority_str, 1)

    def parse_time_estimate(self, time_estimate_str):
        if time_estimate_str:
            hours, minutes = map(int, time_estimate_str.split(':'))
            return timedelta(hours=hours, minutes=minutes)
        return timedelta()  # Return zero timedelta if no time estimate
    


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

                # Extract text from HTML body
                soup = BeautifulSoup(body_html, 'html.parser')
                body_text = soup.get_text()

                try:
                    # Check if email already exists
                    existing_email = Email.objects.get(
                        Subject=subject,
                        Sender=sender_address,
                        ReceivedDate=date,
                        UserID=user
                    )
                    # If email already exists, continue to the next email
                    continue
                except ObjectDoesNotExist:
                    pass

                # Priority check
                priority_emails = PriorityEmail.objects.filter(UserID=user).values_list('EmailAddress', flat=True)
                is_priority = 10 if sender_address.lower() in priority_emails else 0

                # Create Email object and save to database
                new_email = Email.objects.create(
                    UserID=user,
                    Sender=sender_address,
                    Reciever=user.name,  # fix this
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

class chat_with_AI(APIView):
    serializer_class = MessageSerializer
    
    def post(self, request): 
        serializer = MessageSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        
        body = serializer.validated_data["emailBody"]
        received_date = serializer.validated_data["recievedDate"]
        senderEmail = serializer.validated_data["senderEmail"]
        received_date_str = received_date.strftime('%Y-%m-%d') if received_date else ""
        messages = 'Email ' + body + ' received date ' + received_date_str + ' sender email: '+senderEmail
        print(messages)
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
        response_data = {completion.choices[0].message.content}
        response_data = {"content": completion.choices[0].message.content}

        print("Response Data Content:", response_data["content"])
        if response_data["content"] != 'No task':
            self.save_task_from_message(response_data["content"], request.user)  # add to-do list


        return Response(response_data, status=200)
    

    def save_task_from_message(self, message_content, user):
        task_details = {}
        lines = message_content.split(',')
        for line in lines:
            parts = line.split(':', 1)
            if len(parts) == 2:
                key, value = parts
                task_details[key.strip()] = value.strip()

        print("Task Details:", task_details)  # Debug print

        due_date_str = task_details.get("Due Date", None)
        print("Due Date String:", due_date_str)  # Debug print

        if due_date_str:
            if len(due_date_str.split('/')[-1]) == 2:
                due_date_format = "%d/%m/%y"
            else:
                due_date_format = "%d/%m/%Y"

            print('due_date_format: '+due_date_format)
            due_date = datetime.strptime(due_date_str, due_date_format)
        else:
            due_date = None

        print("Due Date:", due_date)  

        # Convert Time_Estimate string to timedelta
        time_estimate_str = task_details.get("Time Estimate", "dd")
        print("Time Estimate String:", time_estimate_str)  # Debug print
        time_estimate = self.parse_time_estimate(time_estimate_str)
        print("Time Estimate:", time_estimate)  # Debug print

        ToDoList.objects.create(
            UserID=user,
            Priority=self.get_priority(task_details.get("Priority")),
            Due=due_date,
            Description=task_details.get("Description"),
            Category=task_details.get("Category"),
            Notes=task_details.get("Notes"),
            Time_Estimate=time_estimate,  
            Reminders=None,  
            Status=task_details.get("Status", "Not Started")
        )



    def get_priority(self, priority_str):
        priority_map = {"High": 10, "Medium": 5, "Low": 1}
        return priority_map.get(priority_str, 1)

    def parse_time_estimate(self, time_estimate_str):
        if time_estimate_str:
            hours, minutes = map(int, time_estimate_str.split(':'))
            return timedelta(hours=hours, minutes=minutes)
        return timedelta() 
