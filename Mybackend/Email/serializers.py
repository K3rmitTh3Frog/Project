from rest_framework import serializers
from .models import Email,PriorityEmail  # Import the Email model

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

class PriorityEmailSerializer(serializers.ModelSerializer):
    class Meta:
        model = PriorityEmail
        fields = '__all__'  # This will include all fields of the PriorityEmail model
        ref_name = 'EmailChangePriority' 

class CreatePriorityEmailSerializer(serializers.ModelSerializer):
    class Meta:
        model = PriorityEmail
        fields = ['PriorityID', 'EmailAddress']
        # UserID is not included here as it will be added from the request user

    def create(self, validated_data):
        user = self.context['request'].user
        # Exclude UserID from validated_data if it's accidentally included
        validated_data.pop('UserID', None)
        return PriorityEmail.objects.create(UserID=user, **validated_data)


class ChangePrioritySerializer(serializers.Serializer):
    new_IsPriority = serializers.IntegerField()

    class Meta:
        fields = ['new_IsPriority']
        ref_name = 'ToDoListChangePriority'  

    def update(self, instance, validated_data):
        instance.IsPriority = validated_data.get('new_IsPriority', instance.IsPriority)
        instance.save()
        return instance

class EmailFetchSerializer(serializers.Serializer):
    email_address = serializers.EmailField()
    password = serializers.CharField(style={'input_type': 'password'})
    imap_server = serializers.CharField(default='outlook.office365.com')

