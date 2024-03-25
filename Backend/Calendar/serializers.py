from rest_framework import serializers
from .models import Event

class CalendarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'

class CreateCalendatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = [
            'EventID', 'UserID', 'Title', 'EventDescription', 'StartDate', 
            'StartTime', 'EndDate', 'EndTime', 'Destination',
        ]

        # If you want the user to be automatically assigned based on the request user
        # and not be part of the serializer fields, you can use the following:
        extra_kwargs = {'UserID': {'read_only': True}}

    def create(self, validated_data):
        # Here you can add custom creation logic if necessary.
        return Event.objects.create(**validated_data)
    
class ChangeTitleSerializer(serializers.Serializer):
    new_Title = serializers.CharField()

class ChangeEventDescriptionSerializer(serializers.Serializer):
    new_description = serializers.CharField()

class ChangeStartDateSerializer(serializers.Serializer):
    new_start_date = serializers.DateField()

class ChangeStartTimeSerializer(serializers.Serializer):
    new_start_time = serializers.TimeField()

class ChangeEndDateSerializer(serializers.Serializer):
    new_end_date = serializers.DateField()

class ChangeEndTimeSerializer(serializers.Serializer):
    new_end_time = serializers.TimeField()
