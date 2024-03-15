from rest_framework import serializers
from .models import Chatbot

class MessageSerializer(serializers.Serializer):
    message = serializers.CharField()

class ChatbotSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chatbot
        fields = ['ChatID', 'UserID', 'message', 'isUser', 'Date']

    UserID = serializers.ReadOnlyField(source='UserID.username')  