from django.db import models
from account.models import CustomUser  # Replace 'account' with the actual app name where CustomUser is defined


class Event(models.Model):
    EventID = models.AutoField(primary_key=True)  # Auto-incrementing primary key
    UserID = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='events')  # Foreign Key to the User model
    Title = models.CharField(max_length=255)  # Title of the event
    EventDescription = models.TextField()
    StartDate = models.DateField()  
    StartTime = models.TimeField()  
    EndDate = models.DateField()  
    EndTime = models.TimeField()  
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.Title} (Event ID {self.EventID})"

