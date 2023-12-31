from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils.translation import gettext_lazy as _
from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL

class CustomUserManager(BaseUserManager):
    def create_user(self, email, username, name, phone, profession, password=None):
        if not email:
            raise ValueError('Users must have an email address')
        if not username:
            raise ValueError('Users must have a username')

        user = self.model(
            email=self.normalize_email(email),
            username=username,
            name=name,
            phone=phone,
            profession=profession,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, name, phone, profession, password):
        user = self.create_user(
            email,
            password=password,
            username=username,
            name=name,
            phone=phone,
            profession=profession,
        )
        user.is_staff = True  # Set is_staff to True for superusers
        user.is_superuser = True  # Set is_superuser to True for superusers
        user.save(using=self._db)
        return user

class CustomUser(AbstractBaseUser, PermissionsMixin):
    
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    username = models.CharField(max_length=255, unique=True)
    email = models.EmailField(verbose_name="email", max_length=60, unique=True)
    phone = models.CharField(max_length=20)
    profession = models.CharField(max_length=255)
    is_staff = models.BooleanField(default=False)  # Add is_staff field
    
    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'name', 'phone', 'profession']
    
    def __str__(self):
        return self.email
    groups = models.ManyToManyField(
        verbose_name=_('groups'),
        to='auth.Group',
        related_name='custom_user_set',  # Unique related name
        blank=True,
        help_text=_('The groups this user belongs to. A user will get all permissions granted to each of their groups.'),
        related_query_name='customuser',  # Unique related query name
    )

    user_permissions = models.ManyToManyField(
        verbose_name=_('user permissions'),
        to='auth.Permission',
        related_name='custom_user_set',  # Unique related name
        blank=True,
        help_text=_('Specific permissions for this user.'),
        related_query_name='customuser',  # Unique related query name
    )
    
