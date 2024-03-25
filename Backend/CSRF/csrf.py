from django.middleware.csrf import CsrfViewMiddleware
from django.utils import timezone

class CustomCsrfViewMiddleware(CsrfViewMiddleware):
    def process_view(self, request, callback, callback_args, callback_kwargs):
        # Call the parent's process_view method to generate the CSRF token
        super().process_view(request, callback, callback_args, callback_kwargs)
        
        # Set a custom expiration time for the CSRF token
        if hasattr(request, 'csrf_token_age'):
            request.csrf_token_age = 3600  # Expiration time set to 1 hour (3600 seconds)