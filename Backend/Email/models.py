from django.db import models
from myaccount.models import CustomUser  

class Email(models.Model):
    EmailID = models.AutoField(primary_key=True)  
    UserID = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='emails')  
    Sender = models.EmailField(max_length=255) 
    Reciever = models.EmailField(max_length=255)  
    Subject = models.CharField(max_length=255)  
    ReceivedDate = models.DateTimeField() 
    IsPriority = models.IntegerField(default=0) 
    isDeleted = models.BooleanField(default=False)
    isOpen = models.BooleanField(default=False)
    Body = models.TextField()  
    GmailEmailID = models.TextField(max_length=40, null=True)
    def __str__(self):
        return f"{self.Subject} (Email ID {self.EmailID})"

class PriorityEmail(models.Model):
    PriorityID = models.AutoField(primary_key=True) 
    UserID = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='priority_emails')  
    EmailAddress = models.EmailField(max_length=255) 

    def __str__(self):
        return f"Priority Email: {self.EmailAddress} (User ID {self.UserID.id})"