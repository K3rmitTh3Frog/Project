from django.urls import path
from .views import *
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('register/verify-otp/', OTPVerificationView.as_view(), name='verify-otp'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    #path('logout/', LogoutView.as_view(), name='logout'),
    path('change-password/', ChangePasswordView.as_view(), name='change password'),
    path('change-email/', ChangeEmailView.as_view(), name='change email'),
    path('change-profession/', ChangeprofessionView.as_view(), name='change profession'),
    path('change-phone/', ChangePhoneSerializer.as_view(), name='change phone'),
    path('csrf-token/', CSRFTokenView.as_view(), name='csrf-token'),
    path('api/get-auth-token/', GetAuthToken.as_view(), name='get_authentication_token'),
    path('login2/', CustomLoginView.as_view(), name='login test'),
    path('gmail_authenticate/', GmailAuthenticator.as_view(), name='gmail_authenticate'),
    path('callback/', OAuth2CallbackView.as_view(), name='oauth2callback'),
    
    path('auth/microsoft/', microsoft_auth, name='microsoft_auth'),
    path('auth/callback/microsoft/', microsoft_auth, name='microsoft_callback'),
]
