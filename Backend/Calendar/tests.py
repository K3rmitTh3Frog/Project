from django.test import TestCase
from myaccount.models import CustomUser  # Import CustomUser from the 'myaccount' app
from rest_framework.test import APIClient
from rest_framework import status
from .models import Event

class TestCalendarView(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create(username='hamzehhirzalla', password='1')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_calendar_view(self):
        response = self.client.get('/calendar/view/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class TestCreateCalendarView(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create(username='hamzehhirzalla', password='1')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_create_calendar_view(self):
        data = {'field1': 'value1', 'field2': 'value2'}  # Replace with appropriate data
        response = self.client.post('/create_calendar/', data=data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

# Add similar tests for other views...
