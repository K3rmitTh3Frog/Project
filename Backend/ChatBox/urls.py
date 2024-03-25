from django.urls import path
from .views import *

urlpatterns = [
    path('chat/', ExternalServiceView.as_view(), name='external_service'),
    path('chat/history/', UserChatHistoryView.as_view(), name='chat_history'),
]
