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

class EmailView(generics.ListAPIView):
    serializer_class = EmailSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Email.objects.filter(UserID=user)
    
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
            todo_item = Email.objects.get(pk=EmailID, UserID=user)
        except Email.DoesNotExist:
            return Response({"error": "email item not found"}, status=status.HTTP_404_NOT_FOUND)

        # Delete the todo item
        todo_item.delete()
        return Response({"success": "email item deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    
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

# views.py in your Django app

from django.shortcuts import render
from .scripts.emailinbox import fetch_and_store_emails



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