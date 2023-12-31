from django.urls import path
from .views import *
from . import views

urlpatterns = [
    path('view/', EmailView.as_view(), name='list all emails'),
    path('create/', CreateEmail.as_view(), name='create an event'),
    path('delete/<int:EmailID>/', DeleteEmailView.as_view(), name='delete an event'),
    path('<int:EmailID>/', SpecificEmailView.as_view(), name='list a specific event'), 
    path('fetch-emails/', views.fetch_emails_view, name='fetch-emails'),  # Use 'views', not 'view'
]

