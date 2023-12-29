from django.urls import path
from .views import *

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('register/verify-otp/', OTPVerificationView.as_view(), name='verify-otp'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('change-password/', ChangePasswordView.as_view(), name='change password'),
    path('change-email/', ChangeEmailView.as_view(), name='change email'),
    path('change-profession/', ChangeprofessionView.as_view(), name='change profession'),
    path('change-phone/', ChangePhoneSerializer.as_view(), name='change phone'),
]
