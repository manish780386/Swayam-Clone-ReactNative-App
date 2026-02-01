from rest_framework.generics import ListAPIView
from rest_framework.filters import SearchFilter
from .models import Course
from .serializers import CourseSerializer
from .pagination import CoursePagination

from rest_framework.generics import RetrieveAPIView


class CourseListAPIView(ListAPIView):
    serializer_class = CourseSerializer
    pagination_class = CoursePagination
    filter_backends = [SearchFilter]

    search_fields = [
        'course_name',
        'instructor',
        'description',
        'platform'
    ]

    def get_queryset(self):
        queryset = Course.objects.all()

        category = self.request.query_params.get('category')
        level = self.request.query_params.get('level')

        if category:
            queryset = queryset.filter(category=category)

        if level:
            queryset = queryset.filter(level__iexact=level)

        return queryset.order_by('-id')

class CourseDetailAPIView(RetrieveAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer