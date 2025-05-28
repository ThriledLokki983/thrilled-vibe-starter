# Python Django Backend Development Instructions

## Project Overview
Create a robust Django REST API backend with modern Python development practices, following Django best practices for scalability, security, and maintainability.

## Technology Stack

### Core Technologies
- **Python** (3.11+) - Programming language
- **Django** (4.2+ LTS) - Web framework
- **Django REST Framework** - API development
- **PostgreSQL** - Primary database
- **Redis** - Caching and session storage
- **Celery** - Background task processing

### Database & ORM
- **PostgreSQL** - Primary relational database
- **Django ORM** - Object-relational mapping
- **Redis** - Cache backend and message broker

### Authentication & Authorization
- **Django REST Framework Token Auth** - API authentication
- **JWT** - JSON Web Tokens (with djangorestframework-simplejwt)
- **Django Permissions** - Authorization system

### Validation & Serialization
- **Django REST Framework Serializers** - Data validation and serialization
- **django-filter** - Advanced filtering
- **Pydantic** - Additional data validation (optional)

### Development Tools
- **pytest** - Testing framework
- **black** - Code formatting
- **flake8** - Linting
- **mypy** - Type checking
- **pre-commit** - Git hooks
- **django-debug-toolbar** - Development debugging

### Package Management
- **Poetry** - Dependency management and packaging

## Project Structure

```
project-name/
├── config/
│   ├── __init__.py
│   ├── settings/
│   │   ├── __init__.py
│   │   ├── base.py
│   │   ├── development.py
│   │   ├── production.py
│   │   └── testing.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── apps/
│   ├── __init__.py
│   ├── authentication/
│   │   ├── __init__.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── permissions.py
│   │   └── tests/
│   ├── users/
│   │   ├── __init__.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── admin.py
│   │   └── tests/
│   └── core/
│       ├── __init__.py
│       ├── models.py
│       ├── serializers.py
│       ├── views.py
│       ├── permissions.py
│       ├── pagination.py
│       ├── filters.py
│       └── exceptions.py
├── utils/
│   ├── __init__.py
│   ├── email.py
│   ├── cache.py
│   ├── validators.py
│   └── helpers.py
├── static/
├── media/
├── templates/
├── requirements/
│   ├── base.txt
│   ├── development.txt
│   ├── production.txt
│   └── testing.txt
├── tests/
├── docs/
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
├── .env.example
├── .env
├── manage.py
├── pyproject.toml
├── pytest.ini
├── .pre-commit-config.yaml
└── README.md
```

## Initial Setup

### 1. Project Initialization with Poetry
```bash
# Create project directory
mkdir project-name && cd project-name

# Initialize Poetry project
poetry init

# Install Django and core dependencies
poetry add django djangorestframework
poetry add psycopg2-binary redis celery
poetry add djangorestframework-simplejwt
poetry add django-cors-headers django-filter
poetry add python-decouple dj-database-url
poetry add gunicorn whitenoise

# Install development dependencies
poetry add --group dev pytest pytest-django
poetry add --group dev black flake8 mypy
poetry add --group dev pre-commit django-debug-toolbar
poetry add --group dev factory-boy faker
poetry add --group dev coverage pytest-cov

# Install Poetry environment
poetry install

# Activate virtual environment
poetry shell
```

### 2. Django Project Setup
```bash
# Create Django project
django-admin startproject config .

# Create apps directory
mkdir apps

# Create core app
python manage.py startapp core apps/core
python manage.py startapp users apps/users
python manage.py startapp authentication apps/authentication
```

### 3. Configuration Files

**pyproject.toml**
```toml
[tool.poetry]
name = "project-name"
version = "0.1.0"
description = "Django REST API Backend"
authors = ["Your Name <your.email@example.com>"]

[tool.poetry.dependencies]
python = "^3.11"
django = "^4.2"
djangorestframework = "^3.14"
psycopg2-binary = "^2.9"
redis = "^4.5"
celery = "^5.3"
djangorestframework-simplejwt = "^5.2"
django-cors-headers = "^4.0"
django-filter = "^23.2"
python-decouple = "^3.8"
dj-database-url = "^2.0"
gunicorn = "^20.1"
whitenoise = "^6.5"

[tool.poetry.group.dev.dependencies]
pytest = "^7.4"
pytest-django = "^4.5"
black = "^23.7"
flake8 = "^6.0"
mypy = "^1.5"
pre-commit = "^3.3"
django-debug-toolbar = "^4.1"
factory-boy = "^3.3"
faker = "^19.3"
coverage = "^7.2"
pytest-cov = "^4.1"

[build-system]
requires = ["poetry-core"]
build-backend = "poetry.core.masonry.api"

[tool.black]
line-length = 88
target-version = ['py311']
include = '\.pyi?$'
extend-exclude = '''
/(
  # directories
  \.eggs
  | \.git
  | \.hg
  | \.mypy_cache
  | \.tox
  | \.venv
  | build
  | dist
  | migrations
)/
'''

[tool.mypy]
python_version = "3.11"
check_untyped_defs = true
ignore_missing_imports = true
warn_unused_ignores = true
warn_redundant_casts = true
warn_unused_configs = true

[tool.pytest.ini_options]
DJANGO_SETTINGS_MODULE = "config.settings.testing"
addopts = "--cov=apps --cov-report=html --cov-report=term-missing"
testpaths = ["tests", "apps"]
python_files = ["test_*.py", "*_test.py", "tests.py"]
```

### 4. Environment Configuration

**.env.example**
```bash
# Django Settings
DEBUG=True
SECRET_KEY=your-super-secret-django-key
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/database_name

# Redis
REDIS_URL=redis://localhost:6379/0

# Celery
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0

# Email
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# JWT
JWT_ACCESS_TOKEN_LIFETIME=5
JWT_REFRESH_TOKEN_LIFETIME=7

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# AWS S3 (optional)
USE_S3=False
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_STORAGE_BUCKET_NAME=your-bucket-name
AWS_S3_REGION_NAME=us-east-1
```

## Django Settings Structure

### Base Settings
```python
# config/settings/base.py
import os
from pathlib import Path
from decouple import config
from datetime import timedelta

BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Security
SECRET_KEY = config('SECRET_KEY')
DEBUG = config('DEBUG', default=False, cast=bool)
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='').split(',')

# Application definition
DJANGO_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

THIRD_PARTY_APPS = [
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'django_filters',
]

LOCAL_APPS = [
    'apps.core',
    'apps.users',
    'apps.authentication',
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'apps.core.middleware.RequestLoggingMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'
ASGI_APPLICATION = 'config.asgi.application'

# Database
DATABASES = {
    'default': dj_database_url.parse(config('DATABASE_URL'))
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [BASE_DIR / 'static']
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Custom User Model
AUTH_USER_MODEL = 'users.User'

# REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
    'DEFAULT_PAGINATION_CLASS': 'apps.core.pagination.CustomPageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
    'EXCEPTION_HANDLER': 'apps.core.exceptions.custom_exception_handler',
}

# JWT Settings
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=config('JWT_ACCESS_TOKEN_LIFETIME', default=5, cast=int)),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=config('JWT_REFRESH_TOKEN_LIFETIME', default=7, cast=int)),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'VERIFYING_KEY': None,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
}

# CORS Settings
CORS_ALLOWED_ORIGINS = config('CORS_ALLOWED_ORIGINS', default='').split(',')
CORS_ALLOW_CREDENTIALS = True

# Cache
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': config('REDIS_URL'),
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        }
    }
}

# Celery
CELERY_BROKER_URL = config('CELERY_BROKER_URL')
CELERY_RESULT_BACKEND = config('CELERY_RESULT_BACKEND')
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = TIME_ZONE

# Email
EMAIL_BACKEND = config('EMAIL_BACKEND', default='django.core.mail.backends.console.EmailBackend')
EMAIL_HOST = config('EMAIL_HOST', default='')
EMAIL_PORT = config('EMAIL_PORT', default=587, cast=int)
EMAIL_USE_TLS = config('EMAIL_USE_TLS', default=True, cast=bool)
EMAIL_HOST_USER = config('EMAIL_HOST_USER', default='')
EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD', default='')

# Logging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
        'file': {
            'class': 'logging.FileHandler',
            'filename': 'django.log',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
            'propagate': False,
        },
        'apps': {
            'handlers': ['console', 'file'],
            'level': 'DEBUG',
            'propagate': False,
        },
    },
}
```

## Custom User Model

```python
# apps/users/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    email = models.EmailField(_('email address'), unique=True)
    first_name = models.CharField(_('first name'), max_length=150)
    last_name = models.CharField(_('last name'), max_length=150)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    bio = models.TextField(max_length=500, blank=True)
    birth_date = models.DateField(blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    class Meta:
        db_table = 'users'
        verbose_name = _('User')
        verbose_name_plural = _('Users')

    def __str__(self):
        return self.email

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()

    def get_avatar_url(self):
        if self.avatar and hasattr(self.avatar, 'url'):
            return self.avatar.url
        return None
```

## API Views and Serializers

### User Serializers
```python
# apps/users/serializers.py
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import User


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('email', 'username', 'first_name', 'last_name', 'password', 'password_confirm')

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user


class UserSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField()
    full_name = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = (
            'id', 'email', 'username', 'first_name', 'last_name',
            'full_name', 'avatar', 'avatar_url', 'bio', 'birth_date',
            'is_verified', 'date_joined', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'email', 'date_joined', 'created_at', 'updated_at', 'is_verified')

    def get_avatar_url(self, obj):
        return obj.get_avatar_url()


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'bio', 'birth_date', 'avatar')

    def validate_avatar(self, value):
        if value and value.size > 5 * 1024 * 1024:  # 5MB limit
            raise serializers.ValidationError("Avatar file size must be under 5MB")
        return value


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    new_password_confirm = serializers.CharField(required=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError("New passwords don't match")
        return attrs

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect")
        return value
```

### User Views
```python
# apps/users/views.py
from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import update_session_auth_hash
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import User
from .serializers import (
    UserSerializer,
    UserProfileUpdateSerializer,
    ChangePasswordSerializer,
    UserRegistrationSerializer
)
from apps.core.permissions import IsOwnerOrReadOnly
from apps.core.pagination import CustomPageNumberPagination


class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        return Response(
            {
                "message": "User registered successfully",
                "user": UserSerializer(user).data
            },
            status=status.HTTP_201_CREATED
        )


class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    def get_object(self):
        return self.request.user

    def get_serializer_class(self):
        if self.request.method == 'PUT' or self.request.method == 'PATCH':
            return UserProfileUpdateSerializer
        return UserSerializer


class UserListView(generics.ListAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPageNumberPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['is_verified']
    search_fields = ['username', 'first_name', 'last_name', 'email']
    ordering_fields = ['date_joined', 'first_name', 'last_name']
    ordering = ['-date_joined']


class UserDetailView(generics.RetrieveAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'username'


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
    
    if serializer.is_valid():
        user = request.user
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        
        # Keep user logged in after password change
        update_session_auth_hash(request, user)
        
        return Response(
            {"message": "Password changed successfully"},
            status=status.HTTP_200_OK
        )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
```

## Core Utilities

### Custom Pagination
```python
# apps/core/pagination.py
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class CustomPageNumberPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100

    def get_paginated_response(self, data):
        return Response({
            'pagination': {
                'count': self.page.paginator.count,
                'next': self.get_next_link(),
                'previous': self.get_previous_link(),
                'page_size': self.page_size,
                'total_pages': self.page.paginator.num_pages,
                'current_page': self.page.number,
            },
            'results': data
        })
```

### Custom Permissions
```python
# apps/core/permissions.py
from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner of the object.
        return obj == request.user


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow admins to edit.
    """

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff
```

### Exception Handling
```python
# apps/core/exceptions.py
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    # Call REST framework's default exception handler first
    response = exception_handler(exc, context)

    if response is not None:
        # Log the exception
        logger.error(f"API Exception: {exc}", exc_info=True)

        custom_response_data = {
            'error': True,
            'message': 'An error occurred',
            'details': response.data
        }

        # Handle specific exceptions
        if response.status_code == status.HTTP_404_NOT_FOUND:
            custom_response_data['message'] = 'Resource not found'
        elif response.status_code == status.HTTP_403_FORBIDDEN:
            custom_response_data['message'] = 'Permission denied'
        elif response.status_code == status.HTTP_401_UNAUTHORIZED:
            custom_response_data['message'] = 'Authentication required'
        elif response.status_code == status.HTTP_400_BAD_REQUEST:
            custom_response_data['message'] = 'Invalid request data'
        elif response.status_code >= 500:
            custom_response_data['message'] = 'Internal server error'

        response.data = custom_response_data

    return response
```

## Authentication System

### JWT Authentication Views
```python
# apps/authentication/views.py
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

from apps.users.serializers import UserSerializer
from .serializers import CustomTokenObtainPairSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 200:
            # Add user data to response
            email = request.data.get('email')
            user = authenticate(email=email, password=request.data.get('password'))
            if user:
                response.data['user'] = UserSerializer(user).data
                
        return response


@api_view(['POST'])
@permission_classes([AllowAny])
def logout_view(request):
    try:
        refresh_token = request.data.get('refresh_token')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
            
        return Response(
            {"message": "Successfully logged out"},
            status=status.HTTP_200_OK
        )
    except Exception as e:
        return Response(
            {"error": "Invalid token"},
            status=status.HTTP_400_BAD_REQUEST
        )
```

## Testing

### Test Configuration
```python
# pytest.ini
[tool:pytest]
DJANGO_SETTINGS_MODULE = config.settings.testing
python_files = tests.py test_*.py *_tests.py
addopts = --cov=apps --cov-report=html --cov-report=term-missing --reuse-db
testpaths = tests apps
```

### Example Tests
```python
# apps/users/tests/test_models.py
import pytest
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError

User = get_user_model()


@pytest.mark.django_db
class TestUserModel:
    def test_create_user(self):
        user = User.objects.create_user(
            email='test@example.com',
            username='testuser',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        
        assert user.email == 'test@example.com'
        assert user.username == 'testuser'
        assert user.first_name == 'Test'
        assert user.last_name == 'User'
        assert user.check_password('testpass123')
        assert not user.is_staff
        assert not user.is_superuser
        assert user.is_active

    def test_create_superuser(self):
        user = User.objects.create_superuser(
            email='admin@example.com',
            username='admin',
            password='adminpass123'
        )
        
        assert user.is_staff
        assert user.is_superuser

    def test_user_string_representation(self):
        user = User.objects.create_user(
            email='test@example.com',
            username='testuser',
            password='testpass123'
        )
        
        assert str(user) == 'test@example.com'

    def test_full_name_property(self):
        user = User.objects.create_user(
            email='test@example.com',
            username='testuser',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        
        assert user.full_name == 'Test User'
```

```python
# apps/users/tests/test_views.py
import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

User = get_user_model()


@pytest.mark.django_db
class TestUserViews:
    def setup_method(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='test@example.com',
            username='testuser',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )

    def test_user_registration(self):
        url = reverse('users:register')
        data = {
            'email': 'newuser@example.com',
            'username': 'newuser',
            'first_name': 'New',
            'last_name': 'User',
            'password': 'newpass123',
            'password_confirm': 'newpass123'
        }
        
        response = self.client.post(url, data)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert User.objects.filter(email='newuser@example.com').exists()

    def test_user_profile_authenticated(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('users:profile')
        
        response = self.client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['email'] == self.user.email

    def test_user_profile_unauthenticated(self):
        url = reverse('users:profile')
        
        response = self.client.get(url)
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
```

## Background Tasks with Celery

### Celery Configuration
```python
# config/celery.py
import os
from celery import Celery
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')

app = Celery('project_name')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')
```

### Example Tasks
```python
# apps/users/tasks.py
from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from .models import User


@shared_task
def send_welcome_email(user_id):
    try:
        user = User.objects.get(id=user_id)
        send_mail(
            'Welcome to Our Platform',
            f'Hello {user.first_name}, welcome to our platform!',
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )
        return f"Welcome email sent to {user.email}"
    except User.DoesNotExist:
        return "User not found"


@shared_task
def cleanup_inactive_users():
    from datetime import datetime, timedelta
    
    cutoff_date = datetime.now() - timedelta(days=30)
    inactive_users = User.objects.filter(
        is_active=False,
        date_joined__lt=cutoff_date
    )
    
    count = inactive_users.count()
    inactive_users.delete()
    
    return f"Deleted {count} inactive users"
```

## Deployment

### Docker Configuration
```dockerfile
# docker/Dockerfile
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        postgresql-client \
        build-essential \
        libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN pip install poetry

# Copy poetry files
COPY pyproject.toml poetry.lock* /app/

# Configure poetry
RUN poetry config virtualenvs.create false \
    && poetry install --no-dev

# Copy project
COPY . /app/

# Collect static files
RUN python manage.py collectstatic --noinput

# Create non-root user
RUN adduser --disabled-password --gecos '' appuser
RUN chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "config.wsgi:application"]
```

### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: myproject
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  web:
    build:
      context: .
      dockerfile: docker/Dockerfile
    ports:
      - "8000:8000"
    volumes:
      - .:/app
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/myproject
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - db
      - redis

  celery:
    build:
      context: .
      dockerfile: docker/Dockerfile
    command: celery -A config worker -l info
    volumes:
      - .:/app
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/myproject
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - db
      - redis

  celery-beat:
    build:
      context: .
      dockerfile: docker/Dockerfile
    command: celery -A config beat -l info
    volumes:
      - .:/app
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/myproject
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - db
      - redis

volumes:
  postgres_data:
```

## Quality Checklist

### Code Quality
- [ ] Type hints added to all functions
- [ ] Black formatting applied
- [ ] Flake8 linting passed
- [ ] MyPy type checking passed
- [ ] Pre-commit hooks configured
- [ ] Docstrings for all classes and functions

### Security
- [ ] SECRET_KEY properly configured
- [ ] DEBUG=False in production
- [ ] ALLOWED_HOSTS configured
- [ ] CORS settings properly configured
- [ ] JWT tokens properly implemented
- [ ] Input validation with serializers
- [ ] SQL injection prevention (Django ORM)

### Performance
- [ ] Database queries optimized
- [ ] Redis caching implemented
- [ ] Database indexes added where needed
- [ ] Query optimization with select_related/prefetch_related
- [ ] Pagination implemented for list views

### Testing
- [ ] Unit tests for models
- [ ] Unit tests for serializers
- [ ] API endpoint tests
- [ ] Authentication tests
- [ ] Permission tests
- [ ] 80%+ code coverage

### Documentation
- [ ] API documentation with DRF browsable API
- [ ] README with setup instructions
- [ ] Environment variables documented
- [ ] Model relationships documented
- [ ] Deployment instructions

### Database
- [ ] Migrations created and applied
- [ ] Database constraints properly set
- [ ] Indexes optimized for queries
- [ ] Foreign key relationships defined
- [ ] Data seeding scripts created

This comprehensive guide ensures a production-ready Django REST API that follows Django best practices for security, scalability, and maintainability.
