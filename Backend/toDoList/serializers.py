from rest_framework import serializers
from .models import ToDoList

class ToDoListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ToDoList
        fields = '__all__'

class CreateToDoListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ToDoList
        fields = [
            'ToDoID', 'UserID', 'Priority', 'Due', 'Description', 
            'Category', 'Notes', 'Time_Estimate', 'Reminders', 'Status'
        ]


        extra_kwargs = {'UserID': {'read_only': True}}

    def create(self, validated_data):
        return ToDoList.objects.create(**validated_data)

class ChangePrioritySerializer(serializers.Serializer):
    new_priority = serializers.IntegerField()

class ChangeDueSerializer(serializers.Serializer):
    new_due = serializers.DateTimeField()

class ChangeDescriptionSerializer(serializers.Serializer):
    new_description = serializers.CharField()

class ChangeCategorySerializer(serializers.Serializer):
    new_category = serializers.CharField()

class ChangeNotesSerializer(serializers.Serializer):
    new_notes = serializers.CharField()

class ChangeTimeEstimateSerializer(serializers.Serializer):
    new_time_estimate = serializers.DurationField()

class ChangeRemindersSerializer(serializers.Serializer):
    new_reminders = serializers.DateTimeField()

class ChangeStatusSerializer(serializers.Serializer):
    new_status = serializers.ChoiceField(
        choices=[('In Progress', 'In Progress'), ('Not Started', 'Not Started'), ('Complete', 'Complete')]
    )
