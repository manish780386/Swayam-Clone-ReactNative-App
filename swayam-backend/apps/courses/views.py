from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Category, Institution, Course, CourseReview
from .serializers import (
    CategorySerializer, InstitutionSerializer,
    CourseListSerializer, CourseDetailSerializer, CourseReviewSerializer,
)
from .filters import CourseFilter


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset           = Category.objects.all()
    serializer_class   = CategorySerializer
    permission_classes = [permissions.AllowAny]
    lookup_field       = 'slug'

    @action(detail=True, methods=['get'])
    def courses(self, request, slug=None):
        category = self.get_object()
        qs       = Course.objects.filter(category=category, status='published')
        return Response(CourseListSerializer(qs, many=True).data)


class InstitutionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset           = Institution.objects.all()
    serializer_class   = InstitutionSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends    = [SearchFilter]
    search_fields      = ['name', 'short_name', 'city']


class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.AllowAny]
    filter_backends    = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class    = CourseFilter
    search_fields      = ['title', 'description', 'instructor', 'tags']
    ordering_fields    = ['enrolled_count', 'created_at', 'start_date']
    ordering           = ['-enrolled_count']

    def get_queryset(self):
        return Course.objects.filter(status='published').select_related('category', 'institution')

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CourseDetailSerializer
        return CourseListSerializer

    @action(detail=False, methods=['get'])
    def popular(self, request):
        qs = self.get_queryset().order_by('-enrolled_count')[:10]
        return Response(CourseListSerializer(qs, many=True).data)

    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        from django.utils import timezone
        qs = self.get_queryset().filter(start_date__gte=timezone.now().date())
        return Response(CourseListSerializer(qs, many=True).data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def review(self, request, pk=None):
        course     = self.get_object()
        serializer = CourseReviewSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save(course=course)
        return Response(serializer.data, status=status.HTTP_201_CREATED)