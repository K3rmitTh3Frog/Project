from django.shortcuts import render
from rest_framework.views import APIView

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
import jwt
from .serializers import *
from .models import CustomUser, Email
from rest_framework.permissions import IsAuthenticated

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
