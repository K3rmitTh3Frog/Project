from rest_framework.views import APIView

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
import jwt
from .serializers import *
from .models import CustomUser, ToDoList
from rest_framework.permissions import IsAuthenticated



class ToDoListView(generics.ListAPIView):
    serializer_class = ToDoListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return ToDoList.objects.filter(UserID=user)

class SpecificToDoListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, todo_id):
        try:
            user = self.request.user
            todo_item = ToDoList.objects.get(pk=todo_id, UserID=user)
        except ToDoList.DoesNotExist:
            return Response({"error": "ToDoList item not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ToDoListSerializer(todo_item)
        return Response(serializer.data)
            
class createToDoListView(generics.CreateAPIView):
    serializer_class = CreateToDoListSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(UserID=user)   

class ChangeRemindersView(generics.GenericAPIView):
    serializer_class = ChangeRemindersSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, todo_id):
        user = self.request.user

        try:
            todo_item = ToDoList.objects.get(pk=todo_id, UserID=user)
        except ToDoList.DoesNotExist:
            return Response({"error": "ToDoList item not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            new_reminders = serializer.validated_data.get('new_reminders')

            todo_item.Reminders = new_reminders
            todo_item.save()

            return Response({"success": "Reminders updated successfully"}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        
class ChangePriorityView(generics.GenericAPIView):
    serializer_class = ChangePrioritySerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, todo_id):
        user = self.request.user
        try:
            todo_item = ToDoList.objects.get(pk=todo_id, UserID=user)
        except ToDoList.DoesNotExist:
            return Response({"error": "ToDoList item not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            todo_item.Priority = serializer.validated_data.get('new_priority')
            todo_item.save()
            return Response({"success": "Priority updated successfully"}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChangeDueView(generics.GenericAPIView):
    serializer_class = ChangeDueSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, todo_id):
        user = self.request.user
        try:
            todo_item = ToDoList.objects.get(pk=todo_id, UserID=user)
        except ToDoList.DoesNotExist:
            return Response({"error": "ToDoList item not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            todo_item.Due = serializer.validated_data.get('new_due')
            todo_item.save()
            return Response({"success": "Due date updated successfully"}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChangeDescriptionView(generics.GenericAPIView):
    serializer_class = ChangeDescriptionSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, todo_id):
        user = self.request.user
        try:
            todo_item = ToDoList.objects.get(pk=todo_id, UserID=user)
        except ToDoList.DoesNotExist:
            return Response({"error": "ToDoList item not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            todo_item.Description = serializer.validated_data.get('new_description')
            todo_item.save()
            return Response({"success": "Description updated successfully"}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChangeCategoryView(generics.GenericAPIView):
    serializer_class = ChangeCategorySerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, todo_id):
        user = self.request.user
        try:
            todo_item = ToDoList.objects.get(pk=todo_id, UserID=user)
        except ToDoList.DoesNotExist:
            return Response({"error": "ToDoList item not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            todo_item.Category = serializer.validated_data.get('new_category')
            todo_item.save()
            return Response({"success": "Category updated successfully"}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChangeNotesView(generics.GenericAPIView):
    serializer_class = ChangeNotesSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, todo_id):
        user = self.request.user
        try:
            todo_item = ToDoList.objects.get(pk=todo_id, UserID=user)
        except ToDoList.DoesNotExist:
            return Response({"error": "ToDoList item not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            todo_item.Notes = serializer.validated_data.get('new_notes')
            todo_item.save()
            return Response({"success": "Notes updated successfully"}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChangeTimeEstimateView(generics.GenericAPIView):
    serializer_class = ChangeTimeEstimateSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, todo_id):
        user = self.request.user
        try:
            todo_item = ToDoList.objects.get(pk=todo_id, UserID=user)
        except ToDoList.DoesNotExist:
            return Response({"error": "ToDoList item not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            todo_item.Time_Estimate = serializer.validated_data.get('new_time_estimate')
            todo_item.save()
            return Response({"success": "Time estimate updated successfully"}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChangeStatusView(generics.GenericAPIView):
    serializer_class = ChangeStatusSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, todo_id):
        user = self.request.user
        try:
            todo_item = ToDoList.objects.get(pk=todo_id, UserID=user)
        except ToDoList.DoesNotExist:
            return Response({"error": "ToDoList item not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            todo_item.Status = serializer.validated_data.get('new_status')
            todo_item.save()
            return Response({"success": "Status updated successfully"}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeleteToDoListView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, todo_id):
        user = self.request.user
        try:
            todo_item = ToDoList.objects.get(pk=todo_id, UserID=user)
        except ToDoList.DoesNotExist:
            return Response({"error": "ToDoList item not found"}, status=status.HTTP_404_NOT_FOUND)

        todo_item.delete()
        return Response({"success": "ToDoList item deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

    
class MarkToDoListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def patch(self, request, todo_id):
        user = self.request.user
        try:
            todo_item = ToDoList.objects.get(pk=todo_id, UserID=user)
        except ToDoList.DoesNotExist:
            return Response({"error": "ToDoList item not found"}, status=status.HTTP_404_NOT_FOUND)

        todo_item.Status = 'Complete'
        todo_item.save()

        return Response({"success": "ToDoList item marked successfully"}, status=status.HTTP_200_OK)

from django.utils import timezone

class ToDoListStatusCountsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        current_date = timezone.now().date()

        base_query = ToDoList.objects.filter(
            Due__date=current_date, 
            UserID=request.user
        )

        complete_count = base_query.filter(Status='Complete').count()
        in_progress_count = base_query.filter(Status='In Progress').count()
        not_started_count = base_query.filter(Status='Not Started').count()

        return Response({
            "complete_count": complete_count,
            "in_progress_count": in_progress_count,
            "not_started_count": not_started_count,
            "total":complete_count+in_progress_count+not_started_count
        })