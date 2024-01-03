from .views import *
from django.urls import path

urlpatterns = [
    path('viewall/', ToDoListView.as_view(), name='change-priority'),
    path('<int:todo_id>/', SpecificToDoListView.as_view(), name='view specific to-do-list'),
    path('create/', createToDoListView.as_view(), name='create a to-do-list'),
    path('<int:todo_id>/change-reminders/', ChangeRemindersView.as_view(), name='change-priority'),
    path('<int:todo_id>/change-priority/', ChangePriorityView.as_view(), name='change-priority'),
    path('<int:todo_id>/change-due/', ChangeDueView.as_view(), name='change-due'),
    path('<int:todo_id>/change-description/', ChangeDescriptionView.as_view(), name='change-description'),
    path('<int:todo_id>/change-category/', ChangeCategoryView.as_view(), name='change-category'),
    path('<int:todo_id>/change-notes/', ChangeNotesView.as_view(), name='change-notes'),
    path('<int:todo_id>/change-time-estimate/', ChangeTimeEstimateView.as_view(), name='change-time-estimate'),
    path('<int:todo_id>/change-status/', ChangeStatusView.as_view(), name='change-status'),
    path('delete/<int:todo_id>/', DeleteToDoListView.as_view(), name='delete-todolist'),
    path('mark/<int:todo_id>/', MarkToDoListView.as_view(), name='mark-todolist'),
]
