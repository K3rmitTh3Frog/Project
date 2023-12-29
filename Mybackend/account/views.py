from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
import jwt
import datetime
from .serializers import *  
from .models import CustomUser  
from django.core.mail import send_mail
import random


def get_authenticated_user(request):
    token = request.COOKIES.get('jwt')

    if not token:
        raise AuthenticationFailed("Unauthenticated!")

    try:
        payload = jwt.decode(token, 'secret', algorithms="HS256")
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed("Unauthenticated!")

    user = CustomUser.objects.filter(id=payload['id']).first()
    if user is None:
        raise AuthenticationFailed("Unauthenticated!")

    return user

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
    

class UserLoginView(generics.GenericAPIView):
    serializer_class = UserLoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = authenticate(
            email=serializer.validated_data['email'], 
            password=serializer.validated_data['password']
        )

        if user:
            payload = {
            "id": user.id,
            "email": user.email,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
            "iat": datetime.datetime.utcnow()
            }

            token = jwt.encode(payload, 'secret', algorithm='HS256')
        # token.decode('utf-8')
        #we set token via cookies
        

            response = Response() 
            response.set_cookie(key='jwt', value=token, httponly=True)  #httonly - frontend can't access cookie, only for backend
            response.data = {
                'jwt token': token
            }
            #if password correct
            return response

        return Response({'message': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(generics.RetrieveAPIView):
    serializer_class = UserSerializer

    def get_object(self):
        # Retrieve the JWT token from the request's cookies
        user = get_authenticated_user(self.request)

        return user

class LogoutView(generics.GenericAPIView):
    serializer_class = logoutSerializer
    def post(self,request):
        response = Response()
        response.delete_cookie('jwt')
        response.data = {
            'message': 'successful'
        }

        return response
    
class ChangePasswordView(generics.GenericAPIView):
    serializer_class = UserchangePasswordSerializer
    def post(self, request):
        user = get_authenticated_user(request)

        data = request.data
        current_password = data.get("current_password")
        new_password = data.get("new_password")

        if not user.check_password(current_password):
            return Response({"error": "Wrong current password"}, status=status.HTTP_400_BAD_REQUEST)


        user.password = make_password(new_password)
        user.save()

        return Response({"success": "Password updated successfully"}, status=status.HTTP_200_OK)

class ChangeEmailView(generics.GenericAPIView):
    serializer_class = UserchangeEmailSerializer
    
    def post(self, request):
        user = get_authenticated_user(request)

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
    
    def post(self, request):
        user = get_authenticated_user(request)

        data = request.data
        new_Profession = data.get("new_Profession")



        user.profession = new_Profession
        user.save()

        return Response({"success": "profession updated successfully"}, status=status.HTTP_200_OK) 

class ChangePhoneSerializer(generics.GenericAPIView):
    serializer_class = UserChangePhoneSerializer
    
    def post(self, request):
        user = get_authenticated_user(request)

        data = request.data
        new_Phone = data.get("new_Phone")



        user.phone = new_Phone
        user.save()

        return Response({"success": "phone updated successfully"}, status=status.HTTP_200_OK)      