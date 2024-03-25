from django.db import models
from myaccount.models import CustomUser  

class Chatbot(models.Model):
    ChatID = models.AutoField(primary_key=True)
    UserID = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='chat')
    message = models.TextField()
    isUser = models.BooleanField(default=False)
    Date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Chat ID: {self.ChatID}, User ID: {self.UserID}, Date: {self.Date}"
