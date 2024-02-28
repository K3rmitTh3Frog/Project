from django.db import models
from myaccount.models import CustomUser  

class ToDoList(models.Model):
    # Primary Key
    ToDoID = models.AutoField(primary_key=True)
    UserID = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='todo_lists')

    Priority = models.IntegerField()
    Due = models.DateTimeField()
    Description = models.TextField() #change name to title
    Category = models.CharField(max_length=255)
    Notes = models.TextField(blank=True, null=True)  # Optional
    Time_Estimate = models.DurationField(blank=True, null=True)  # Stores the estimated time in a duration format
    Reminders = models.DateTimeField(blank=True, null=True)  # This could be a single reminder. If multiple reminders are needed, consider a separate model or a JSON field
    Status = models.CharField(
        max_length=50,
        choices=[('In Progress', 'In Progress'), ('Not Started', 'Not Started'), ('Complete', 'Complete')],
        default='Not Started'
    )
    isActive = models.BooleanField(default=False)

    def __str__(self):
        return f"ToDoList {self.ToDoID} for {self.UserID.email}"
