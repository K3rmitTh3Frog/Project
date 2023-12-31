from django.contrib.auth import (
    authenticate,
    login,
    logout,
)
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import AnonymousUser
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.http import JsonResponse
from django.middleware.csrf import get_token
from rest_framework import generics, status
from rest_framework.authentication import SessionAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
import jwt
import datetime
from .serializers import *
from django.core.mail import send_mail
import random


class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            # Generate OTP
            otp = random.randint(100000, 999999)

            # Save the user data and OTP in the session
            request.session['user_data'] = serializer.validated_data
            request.session['otp'] = str(otp)

            # Send OTP via email
            send_mail(
                'Your OTP',
                f'Your OTP is {otp}',
                'project321test@outlook.com',  # This should match EMAIL_HOST_USER
                [serializer.validated_data['email']],
                fail_silently=False,
            )
            return Response({'message': 'OTP sent to email'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class OTPVerificationView(generics.GenericAPIView):
    serializer_class = OTPVerificationSerializer
    def post(self, request, *args, **kwargs):
        otp = request.data.get('otp')
        session_otp = request.session.get('otp')
        user_data = request.session.get('user_data')

        if otp and user_data and otp == session_otp:
            # Create user account
            user = User.objects.create_user(**user_data)
            user.set_password(user_data['password'])
            user.save()

            # Clear the session data
            del request.session['otp']
            del request.session['user_data']

            return Response({'message': 'Account created successfully'}, status=status.HTTP_201_CREATED)

        return Response({'message': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)
    

class UserProfileView(APIView):
    # Uncomment this if you want to restrict this view to authenticated users only
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if isinstance(request.user, AnonymousUser):
            return Response({'error': 'User is not authenticated'}, status=401)

        # Directly serialize the CustomUser instance
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)

class LogoutView(generics.GenericAPIView):
    serializer_class = logoutSerializer
    def post(self,request):
        logout(request)
        response = Response()
        response.delete_cookie('jwt')
        response.data = {
            'message': 'successful'
        }

        return response
    
class ChangePasswordView(generics.GenericAPIView):
    serializer_class = UserchangePasswordSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = self.request.user
        data = request.data
        current_password = data.get("current_password")
        new_password = data.get("new_password")

        if not user.check_password(current_password):
            return Response({"error": "Wrong current password"}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        return Response({"success": "Password updated successfully"}, status=status.HTTP_200_OK)


class ChangeEmailView(generics.GenericAPIView):
    serializer_class = UserchangeEmailSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = self.request.user

        data = request.data
        new_email = data.get("new_Email")

        try:
            validate_email(new_email)
        except ValidationError:
            return Response({"error": "Invalid email format"}, status=status.HTTP_400_BAD_REQUEST)

        user.email = new_email
        user.save()

        return Response({"success": "Email updated successfully"}, status=status.HTTP_200_OK)


class ChangeprofessionView(generics.GenericAPIView):
    serializer_class = UserChangeProfessionSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = self.request.user

        data = request.data
        new_profession = data.get("new_Profession")

        user.profession = new_profession
        user.save()

        return Response({"success": "Profession updated successfully"}, status=status.HTTP_200_OK)


class ChangePhoneSerializer(generics.GenericAPIView):
    serializer_class = UserChangePhoneSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = self.request.user

        data = request.data
        new_phone = data.get("new_Phone")

        user.phone = new_phone
        user.save()

        return Response({"success": "Phone updated successfully"}, status=status.HTTP_200_OK)
  
class GetAuthToken(APIView):
    authentication_classes = [SessionAuthentication]  # Use the appropriate authentication classes
    permission_classes = [IsAuthenticated]  # Only authenticated users can access this view

    def post(self, request, *args, **kwargs):
        user = request.user  # The authenticated user

        # Ensure the token is created or retrieved for the given user
        token, created = Token.objects.get_or_create(user=user)

        # Return the token key in the response
        return Response({'token': token.key}, status=status.HTTP_200_OK)
        
class CSRFTokenView(APIView):
    def get(self, request, *args, **kwargs):
        csrf_token = get_token(request)
        return Response({'csrfToken': csrf_token})
    



class CustomLoginView(APIView):
    serializer_class =LoginSerializer
    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']

            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                session_id = self.request.session.session_key

                return JsonResponse({"session_id": session_id, "success": True})
            else:
                return Response({"success": False, "error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
                
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)