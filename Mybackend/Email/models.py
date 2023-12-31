from django.db import models
from myaccount.models import CustomUser  # Import CustomUser from the 'myaccount' app

class Email(models.Model):
    EmailID = models.AutoField(primary_key=True)  # Auto-incrementing primary key
    UserID = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='emails')  # Foreign Key to the CustomUser model
    Sender = models.EmailField(max_length=255)  # Email of the sender
    Reciever = models.EmailField(max_length=255)  # Email of the sender
    Subject = models.CharField(max_length=255)  # Subject of the email
    ReceivedDate = models.DateTimeField()  # Date and time when the email was received
    IsPriority = models.IntegerField(default=0)  # Integer field to indicate the priority level of the email

    def __str__(self):
        return f"{self.Subject} (Email ID {self.EmailID})"
