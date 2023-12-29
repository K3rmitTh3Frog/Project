from rest_framework.views import APIView

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
import jwt
from .serializers import *
from .models import CustomUser, Event


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

class CalendarView(generics.ListAPIView):
    serializer_class = CalendarSerializer

    def get_queryset(self):
        user = get_authenticated_user(self.request)
        return Event.objects.filter(UserID=user)
    
class createCalendarView(generics.CreateAPIView):
    serializer_class = CreateCalendatSerializer

    def perform_create(self, serializer):
        user = get_authenticated_user(self.request)
        serializer.save(UserID=user) 

class SpecificEventView(generics.ListAPIView):
    def get(self, request, Event_id):
        user = get_authenticated_user(request)
        try:
            todo_item = Event.objects.get(pk=Event_id, UserID=user)
        except Event.DoesNotExist:
            return Response({"error": "Event item not found"}, status=status.HTTP_404_NOT_FOUND)

        # Serialize the todo item
        serializer = CalendarSerializer(todo_item)
        return Response(serializer.data)

class DeleteEventView(APIView):
    def delete(self, request, Event_id):
        user = get_authenticated_user(request)
        try:
            todo_item = Event.objects.get(pk=Event_id, UserID=user)
        except Event.DoesNotExist:
            return Response({"error": "Event item not found"}, status=status.HTTP_404_NOT_FOUND)

        # Delete the todo item
        todo_item.delete()
        return Response({"success": "Event item deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    
class ChangeTitleView(generics.GenericAPIView):
    serializer_class = ChangeTitleSerializer

    def post(self, request, Event_id):
        user = get_authenticated_user(request)
        try:
            event_item = Event.objects.get(pk=Event_id, UserID=user)
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

    def post(self, request, event_id):
        user = get_authenticated_user(request)
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

    def post(self, request, event_id):
        user = get_authenticated_user(request)
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

    def post(self, request, event_id):
        user = get_authenticated_user(request)
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

    def post(self, request, event_id):
        user = get_authenticated_user(request)
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

    def post(self, request, event_id):
        user = get_authenticated_user(request)
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