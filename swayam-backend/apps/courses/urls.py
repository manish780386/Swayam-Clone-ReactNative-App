from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, InstitutionViewSet, CourseViewSet

router = DefaultRouter()
router.register('categories',   CategoryViewSet,    basename='category')
router.register('institutions', InstitutionViewSet, basename='institution')
router.register('',             CourseViewSet,      basename='course')

urlpatterns = [
    path('', include(router.urls)),
]