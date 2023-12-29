from rest_framework.views import APIView

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
import jwt
from .serializers import *
from .models import CustomUser, ToDoList


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

class ToDoListView(generics.ListAPIView):
    serializer_class = ToDoListSerializer

    def get_queryset(self):
        user = get_authenticated_user(self.request)
        return ToDoList.objects.filter(UserID=user)

class SpecificToDoListView(generics.ListAPIView):
    def get(self, request, todo_id):
        user = get_authenticated_user(request)
        try:
            todo_item = ToDoList.objects.get(pk=todo_id, UserID=user)
        except ToDoList.DoesNotExist:
            return Response({"error": "ToDoList item not found"}, status=status.HTTP_404_NOT_FOUND)

        # Serialize the todo item
        serializer = ToDoListSerializer(todo_item)
        return Response(serializer.data)
            
class createToDoListView(generics.CreateAPIView):
    serializer_class = CreateToDoListSerializer

    def perform_create(self, serializer):
        user = get_authenticated_user(self.request)
        serializer.save(UserID=user)      

class ChangeRemindersView(generics.GenericAPIView):
    serializer_class = ChangeRemindersSerializer
    
    def post(self, request, todo_id):
        user = get_authenticated_user(request)

        # Check if the ToDoList item exists
        try:
            todo_item = ToDoList.objects.get(pk=todo_id, UserID=user)
        except ToDoList.DoesNotExist:
            return Response({"error": "ToDoList item not found"}, status=status.HTTP_404_NOT_FOUND)

        # Deserialize and validate the incoming data
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            new_reminders = serializer.validated_data.get('new_reminders')

            # Update the reminders
            todo_item.Reminders = new_reminders
            todo_item.save()

            return Response({"success": "Reminders updated successfully"}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class ChangePriorityView(generics.GenericAPIView):
    serializer_class = ChangePrioritySerializer

    def post(self, request, todo_id):
        user = get_authenticated_user(request)
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

    def post(self, request, todo_id):
        user = get_authenticated_user(request)
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

    def post(self, request, todo_id):
        user = get_authenticated_user(request)
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

    def post(self, request, todo_id):
        user = get_authenticated_user(request)
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

    def post(self, request, todo_id):
        user = get_authenticated_user(request)
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

    def post(self, request, todo_id):
        user = get_authenticated_user(request)
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

    def post(self, request, todo_id):
        user = get_authenticated_user(request)
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
    def delete(self, request, todo_id):
        user = get_authenticated_user(request)
        try:
            todo_item = ToDoList.objects.get(pk=todo_id, UserID=user)
        except ToDoList.DoesNotExist:
            return Response({"error": "ToDoList item not found"}, status=status.HTTP_404_NOT_FOUND)

        # Delete the todo item
        todo_item.delete()
        return Response({"success": "ToDoList item deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    
class MarkToDoListView(APIView):
    def patch(self, request, todo_id):
        user = get_authenticated_user(request)
        try:
            todo_item = ToDoList.objects.get(pk=todo_id, UserID=user)
        except ToDoList.DoesNotExist:
            return Response({"error": "ToDoList item not found"}, status=status.HTTP_404_NOT_FOUND)

        # Update the status to 'Marked'
        todo_item.Status = 'Complete'
        todo_item.save()

        return Response({"success": "ToDoList item marked successfully"}, status=status.HTTP_200_OK)