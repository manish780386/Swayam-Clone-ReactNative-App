import django_filters
from .models import Course


class CourseFilter(django_filters.FilterSet):
    level       = django_filters.CharFilter(lookup_expr='iexact')
    category    = django_filters.CharFilter(field_name='category__slug')
    institution = django_filters.CharFilter(field_name='institution__short_name', lookup_expr='icontains')
    language    = django_filters.CharFilter(lookup_expr='icontains')
    min_credits = django_filters.NumberFilter(field_name='credits', lookup_expr='gte')
    max_credits = django_filters.NumberFilter(field_name='credits', lookup_expr='lte')

    class Meta:
        model  = Course
        fields = ['level', 'category', 'institution', 'language', 'min_credits', 'max_credits']