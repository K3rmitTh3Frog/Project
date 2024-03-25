from django.db import models
from myaccount.models import CustomUser 


class Event(models.Model):
    EventID = models.AutoField(primary_key=True)  
    UserID = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='events')  
    Title = models.CharField(max_length=255) 
    EventDescription = models.TextField()
    StartDate = models.DateField()  
    StartTime = models.TimeField()  
    EndDate = models.DateField()  
    EndTime = models.TimeField()
    Destination = models.CharField(max_length=255, null=True) 
    isDeleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.Title} (Event ID {self.EventID})"