from django.urls import path
from .views import *
from . import views

urlpatterns = [
    path('view/', EmailView.as_view(), name='list all emails'),
    path('view-database/', EmailViewNoRefresh.as_view(), name='list all emails'),
    path('create/', CreateEmail.as_view(), name='create an event'),
    path('delete/<int:EmailID>/', DeleteEmailView.as_view(), name='delete an event'),
    path('<int:EmailID>/', SpecificEmailView.as_view(), name='list a specific event'), 
    path('fetch-emails/', views.fetch_emails_view, name='fetch-emails'),
    path('delete-priority-email/<int:PriorityID>/', DeletePriorityEmailView.as_view(), name='fetch-emails'),
    path('add-priority-email/', CreatePriorityEmailView.as_view(), name='fetch-emails'),
    path('view-priority-emails/', PriorityEmailListView.as_view(), name='fetch-emails'),
    path('change-priority/<int:email_id>/', ChangeEmailPriorityView.as_view(), name='change-email-priority'),
    path('list-emails/', ListEmailsView.as_view(), name='list-emails'),
    path('delete-all/', DeleteAllEmailsView.as_view(), name='list-emails'),
]

