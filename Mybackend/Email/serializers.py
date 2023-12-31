from rest_framework import serializers
from .models import Email  # Import the Email model

class EmailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Email
        fields = '__all__'  # This will include all fields of the Email model


class CreateEmailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Email
        fields = [
            'EmailID', 'UserID', 'Sender', 'Subject', 'ReceivedDate', 'IsPriority'
        ]

        # If you want the user to be automatically assigned based on the request user
        # and not be part of the serializer fields, you can use the following:
        extra_kwargs = {'UserID': {'read_only': True}}

    def create(self, validated_data):
        # Here you can add custom creation logic if necessary.
        return Email.objects.create(**validated_data)
