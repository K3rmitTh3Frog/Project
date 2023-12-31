from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'name', 'username', 'email', 'phone', 'profession')

class UserRegistrationSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('email', 'username', 'name', 'phone', 'profession', 'password')
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        # Remove the OTP from the validated data if it exists
        validated_data.pop('otp', None)
        # Create user but don't save it to the database yet
        user = User(**validated_data)
        user.set_password(validated_data['password'])
        return user

class OTPVerificationSerializer(serializers.Serializer):
    otp = serializers.CharField(max_length=6)  # Assuming OTP is a string of 6 characters

class UserLoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField(style={'input_type': 'password'}, write_only=True)

class UserchangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    new_password = serializers.CharField(style={'input_type': 'password'}, write_only=True)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email', 'username', 'name', 'phone', 'profession','password')

class logoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ()

class UserchangeEmailSerializer(serializers.Serializer):
    new_Email = serializers.EmailField()

class UserChangeProfessionSerializer(serializers.Serializer):
    new_Profession = serializers.CharField()

class UserChangePhoneSerializer(serializers.Serializer):
    new_Phone = serializers.CharField()

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(style={'input_type': 'password'}, required=True)

