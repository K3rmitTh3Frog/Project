from django.urls import path
from .views import *
from . import views


urlpatterns = [
    path('view/', CalendarView.as_view(), name='list all events'),
    path('<int:Event_id>/', SpecificEventView.as_view(), name='list a specific event'),
    path('create/', CreateCalendarView.as_view(), name='create an event'),
    path('delete/<int:Event_id>/', DeleteEventView.as_view(), name='delete an event'),
    path('change-title/<int:event_id>/', ChangeTitleView.as_view(), name='change-event-title'),
    path('change-description/<int:event_id>/', ChangeEventDescriptionView.as_view(), name='change-event-description'),
    path('change-start-date/<int:event_id>/', ChangeStartDateView.as_view(), name='change-event-start-date'),
    path('change-start-time/<int:event_id>/', ChangeStartTimeView.as_view(), name='change-event-start-time'),
    path('change-end-date/<int:event_id>/', ChangeEndDateView.as_view(), name='change-event-end-date'),
    path('change-end-time/<int:event_id>/', ChangeEndTimeView.as_view(), name='change-event-end-time'),
    path('directions/', views.directions_view, name='directions'),
    path('duration/', views.duration_view, name='duration'),
    path('event-duration/<int:event_id1>/<int:event_id2>/', EventDurationCheckView.as_view(), name='event-duration-check'),
    path('create_check/', CreateCalendarDurationCheckView.as_view(), name='create an event with duration check'),
]


