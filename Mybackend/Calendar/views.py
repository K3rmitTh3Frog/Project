from rest_framework.views import APIView
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
import jwt
from .serializers import *
from .models import CustomUser, Event
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from .scripts.googlemaps import get_directions, get_duration  # Adjust the import path as necessary
from django.http import HttpRequest
from urllib.parse import urlencode
import json
import requests
from django.urls import reverse
from django.db.models import Q
from datetime import timedelta
import re  # Regular expression library
from datetime import datetime




class CalendarView(generics.ListAPIView):
    serializer_class = CalendarSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Event.objects.filter(UserID=user)
    

class CreateCalendarView(generics.CreateAPIView):
    serializer_class = CreateCalendatSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(UserID=user)

class SpecificEventView(generics.ListAPIView):
    serializer_class = CalendarSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, Event_id):
        user = self.request.user
        try:
            todo_item = Event.objects.get(pk=Event_id, UserID=user)
        except Event.DoesNotExist:
            return Response({"error": "Event item not found"}, status=status.HTTP_404_NOT_FOUND)

        # Serialize the todo item
        serializer = CalendarSerializer(todo_item)
        return Response(serializer.data)

class DeleteEventView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, Event_id):
        user = self.request.user
        try:
            todo_item = Event.objects.get(pk=Event_id, UserID=user)
        except Event.DoesNotExist:
            return Response({"error": "Event item not found"}, status=status.HTTP_404_NOT_FOUND)

        # Delete the todo item
        todo_item.delete()
        return Response({"success": "Event item deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    
class ChangeTitleView(generics.GenericAPIView):
    serializer_class = ChangeTitleSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, event_id):
        user = self.request.user
        try:
            event_item = Event.objects.get(pk=event_id, UserID=user)
        except Event.DoesNotExist:
            return Response({"error": "event item not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            event_item.Title = serializer.validated_data.get('new_Title')
            event_item.save()
            return Response({"success": "Title updated successfully"}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        
class ChangeEventDescriptionView(generics.GenericAPIView):
    serializer_class = ChangeEventDescriptionSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, event_id):
        user = self.request.user
        try:
            event_item = Event.objects.get(pk=event_id, UserID=user)
        except Event.DoesNotExist:
            return Response({"error": "event item not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            event_item.EventDescription = serializer.validated_data.get('new_description')
            event_item.save()
            return Response({"success": "Event description updated successfully"}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChangeStartDateView(generics.GenericAPIView):
    serializer_class = ChangeStartDateSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, event_id):
        user = self.request.user
        try:
            event_item = Event.objects.get(pk=event_id, UserID=user)
        except Event.DoesNotExist:
            return Response({"error": "event item not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            event_item.StartDate = serializer.validated_data.get('new_start_date')
            event_item.save()
            return Response({"success": "Start date updated successfully"}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChangeStartTimeView(generics.GenericAPIView):
    serializer_class = ChangeStartTimeSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, event_id):
        user = self.request.user
        try:
            event_item = Event.objects.get(pk=event_id, UserID=user)
        except Event.DoesNotExist:
            return Response({"error": "event item not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            event_item.StartTime = serializer.validated_data.get('new_start_time')
            event_item.save()
            return Response({"success": "Start time updated successfully"}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChangeEndDateView(generics.GenericAPIView):
    serializer_class = ChangeEndDateSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, event_id):
        user = self.request.user
        try:
            event_item = Event.objects.get(pk=event_id, UserID=user)
        except Event.DoesNotExist:
            return Response({"error": "event item not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            event_item.EndDate = serializer.validated_data.get('new_end_date')
            event_item.save()
            return Response({"success": "End date updated successfully"}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChangeEndTimeView(generics.GenericAPIView):
    serializer_class = ChangeEndTimeSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, event_id):
        user = self.request.user
        try:
            event_item = Event.objects.get(pk=event_id, UserID=user)
        except Event.DoesNotExist:
            return Response({"error": "event item not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            event_item.EndTime = serializer.validated_data.get('new_end_time')
            event_item.save()
            return Response({"success": "End time updated successfully"}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




def directions_view(request):
    origin = request.GET.get('origin')
    destination = request.GET.get('destination')
    mode = request.GET.get('mode')

    if not all([origin, destination, mode]):
        return JsonResponse({"error": "Missing parameters"}, status=400)

    directions = get_directions(origin, destination, mode)
    return JsonResponse(directions)

def duration_view(request):
    origin = request.GET.get('origin')
    destination = request.GET.get('destination')
    mode = request.GET.get('mode')

    if not all([origin, destination, mode]):
        return JsonResponse({"error": "Missing parameters"}, status=400)

    duration = get_duration(origin, destination, mode)
    if "Error" in duration:
        return JsonResponse({"error": duration}, status=500)
    return JsonResponse({"duration": duration})




class EventDurationCheckView(APIView):
    def get(self, request, event_id1, event_id2):
        try:
            event1 = Event.objects.get(pk=event_id1)
            event2 = Event.objects.get(pk=event_id2)

            # Check if either event has a null destination
            if event1.Destination is None or event2.Destination is None:
                return JsonResponse({"error": "One or both events have no destination"}, status=400)

            origin = event1.Destination
            destination = event2.Destination
            mode = "driving"

            # Create a new HttpRequest object for duration_view
            new_request = HttpRequest()
            new_request.GET = request.GET.copy()
            new_request.GET['origin'] = origin
            new_request.GET['destination'] = destination
            new_request.GET['mode'] = mode

            # Call the duration_view function
            return duration_view(new_request)

        except Event.DoesNotExist:
            return JsonResponse({"error": "One or both events not found"}, status=404)
        


def duration_view(request):
    origin = request.GET.get('origin')
    destination = request.GET.get('destination')
    mode = request.GET.get('mode')

    if not all([origin, destination, mode]):
        return JsonResponse({"error": "Missing parameters"}, status=400)

    duration = get_duration(origin, destination, mode)
    if "Error" in duration:
        return JsonResponse({"error": duration}, status=500)
    return JsonResponse({"duration": duration})



def duration_view(request):
    origin = request.GET.get('origin')
    destination = request.GET.get('destination')
    mode = request.GET.get('mode')

    if not all([origin, destination, mode]):
        return JsonResponse({"error": "Missing parameters"}, status=400)

    duration = get_duration(origin, destination, mode)
    if "Error" in duration:
        return JsonResponse({"error": duration}, status=500)
    return JsonResponse({"duration": duration})

#example:http://172.20.10.3:8081/calendar/duration/?origin=University+of+Wollongong+in+Dubai&destination=Dubai+Mall&mode=driving&
class CreateCalendarDurationCheckView(generics.CreateAPIView):
    serializer_class = CreateCalendatSerializer
    permission_classes = [IsAuthenticated]
    queryset = Event.objects.all()  # Define a queryset

    @staticmethod
    def calculate_travel_time(origin, destination):
        try:
            if origin is None or destination is None:
                return JsonResponse({"error": "One or both events have no destination"}, status=400)
            mode = "driving"
            new_request = HttpRequest()
            new_request.GET['origin'] = origin
            new_request.GET['destination'] = destination
            new_request.GET['mode'] = mode
            response = duration_view(new_request)
            if response.status_code != 200:
                return response
            return json.loads(response.content.decode())['duration']
        except Event.DoesNotExist:
            return JsonResponse({"error": "One or both events not found"}, status=404)

    def perform_create(self, serializer):
        user = self.request.user
        new_event_data = serializer.validated_data
        last_event = Event.objects.filter(UserID=user).order_by('-EndTime').first()

        if last_event:
            travel_time_response = self.calculate_travel_time(last_event.Destination, new_event_data['Destination'])
            if isinstance(travel_time_response, JsonResponse):
                raise serializers.ValidationError(travel_time_response.content.decode())

            match = re.search(r'\d+', travel_time_response)
            if match:
                travel_time_minutes = int(match.group())
            else:
                raise serializers.ValidationError("Invalid travel time format")

            last_event_end_datetime = datetime.combine(last_event.EndDate, last_event.EndTime)
            arrival_time = last_event_end_datetime + timedelta(minutes=travel_time_minutes)

            new_event_start_datetime = datetime.combine(new_event_data['StartDate'], new_event_data['StartTime'])

            if arrival_time > new_event_start_datetime:
                raise serializers.ValidationError("You cannot arrive on time to this event based on your last event schedule.")

        serializer.save(UserID=user)

from django.utils import timezone

class TodaysEventsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        current_date = timezone.localtime(timezone.now()).date()
        current_time = timezone.localtime(timezone.now()).time()
        
        # Filter events for today
        todays_events = Event.objects.filter(
            UserID=user, 
            StartDate=current_date
        )

        # Count events that have not started yet
        future_events_count = todays_events.filter(StartTime__gt=current_time).count()

        # Count events that have already started
        past_events_count = todays_events.filter(StartTime__lte=current_time).count()

        return Response({
            "past_events_today": past_events_count,
            "future_events_today": future_events_count
        })