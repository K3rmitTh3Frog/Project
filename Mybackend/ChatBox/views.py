from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import requests
from django.utils import timezone
from .models import Chatbot  # Ensure this import is correct
from .serializers import MessageSerializer,ChatbotSerializer
from rest_framework.permissions import IsAuthenticated

class ExternalServiceView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MessageSerializer
    def post(self, request, *args, **kwargs):
        serializer = MessageSerializer(data=request.data)
        if serializer.is_valid():
            message_data = serializer.validated_data
            if request.user.is_authenticated:
                Chatbot.objects.create(UserID=request.user, message=message_data['message'], isUser=True, Date=timezone.now())
            else:
                return Response({"error": "User must be authenticated to send messages."}, status=status.HTTP_401_UNAUTHORIZED)

            try:
                url = "http://52.63.121.96/api/chat"
                headers = {'Content-Type': 'application/json'}
                response = requests.post(url, json=message_data, headers=headers)
                if response.status_code == 201:
                    chat_response = response.json()
                    Chatbot.objects.create(UserID=request.user, message=chat_response['data'], isUser=False, Date=timezone.now())
                    return Response(chat_response, status=status.HTTP_200_OK)
                else:
                    return Response({"error": "External service error"}, status=response.status_code)
            except requests.exceptions.RequestException as e:
                return Response({"error": str(e)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserChatHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        chat_history = Chatbot.objects.filter(UserID=request.user).order_by('Date')
        serializer = ChatbotSerializer(chat_history, many=True)
        return Response(serializer.data)
