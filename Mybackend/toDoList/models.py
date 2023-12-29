from django.db import models
from account.models import CustomUser  # Replace 'your_app_name' with the name of your app

class ToDoList(models.Model):
    # Primary Key
    ToDoID = models.AutoField(primary_key=True)
    # Foreign Key - assuming each ToDoList belongs to one user
    UserID = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='todo_lists')
    # Other fields
    Priority = models.IntegerField()
    Due = models.DateTimeField()
    Description = models.TextField()
    Category = models.CharField(max_length=255)
    Notes = models.TextField(blank=True, null=True)  # Optional
    Time_Estimate = models.DurationField()  # Stores the estimated time in a duration format
    Reminders = models.DateTimeField()  # This could be a single reminder. If multiple reminders are needed, consider a separate model or a JSON field
    Status = models.CharField(
        max_length=50,
        choices=[('In Progress', 'In Progress'), ('Not Started', 'Not Started'), ('Complete', 'Complete')],
        default='Not Started'
    )

    def __str__(self):
        return f"ToDoList {self.ToDoID} for {self.UserID.email}"