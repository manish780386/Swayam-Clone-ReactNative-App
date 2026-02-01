from django.urls import path
from .views import CourseListAPIView, CourseDetailAPIView

urlpatterns = [
    path('courses/', CourseListAPIView.as_view()),
    path('courses/<int:pk>/', CourseDetailAPIView.as_view()),
]
