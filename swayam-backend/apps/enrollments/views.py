from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone

from .models import Enrollment, WeekProgress
from apps.courses.models import CourseWeek
from .serializers import (
    EnrollmentSerializer, EnrollmentUpdateSerializer, WeekCompleteSerializer
)


class EnrollmentViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    http_method_names  = ['get', 'post', 'patch', 'delete', 'head', 'options']

    def get_queryset(self):
        return Enrollment.objects.filter(
            user=self.request.user
        ).select_related('course', 'course__category', 'course__institution')

    def get_serializer_class(self):
        if self.action in ['partial_update', 'update']:
            return EnrollmentUpdateSerializer
        return EnrollmentSerializer

    def create(self, request, *args, **kwargs):
        course_id = request.data.get('course_id')
        if Enrollment.objects.filter(user=request.user, course_id=course_id).exists():
            return Response(
                {'error': 'Already enrolled in this course.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        enrollment = serializer.save()

        # Create WeekProgress rows for every course week
        weeks = CourseWeek.objects.filter(course=enrollment.course)
        WeekProgress.objects.bulk_create([
            WeekProgress(enrollment=enrollment, week=w) for w in weeks
        ])

        # Increment enrolled_count
        enrollment.course.enrolled_count += 1
        enrollment.course.save(update_fields=['enrolled_count'])

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def complete_week(self, request, pk=None):
        enrollment = self.get_object()
        serializer = WeekCompleteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        week_id   = serializer.validated_data['week_id']
        completed = serializer.validated_data['completed']

        try:
            wp = WeekProgress.objects.get(enrollment=enrollment, week_id=week_id)
        except WeekProgress.DoesNotExist:
            return Response({'error': 'Week not found.'}, status=status.HTTP_404_NOT_FOUND)

        wp.completed    = completed
        wp.completed_at = timezone.now() if completed else None
        wp.save()

        total = WeekProgress.objects.filter(enrollment=enrollment).count()
        done  = WeekProgress.objects.filter(enrollment=enrollment, completed=True).count()

        enrollment.progress = round((done / total) * 100) if total else 0
        enrollment.status   = 'completed' if enrollment.progress == 100 else 'ongoing' if enrollment.progress > 0 else 'upcoming'
        enrollment.save(update_fields=['progress', 'status'])

        return Response({'progress': enrollment.progress, 'status': enrollment.status})

    @action(detail=False, methods=['get'])
    def my_stats(self, request):
        qs = self.get_queryset()
        return Response({
            'total':     qs.count(),
            'ongoing':   qs.filter(status='ongoing').count(),
            'completed': qs.filter(status='completed').count(),
            'upcoming':  qs.filter(status='upcoming').count(),
            'dropped':   qs.filter(status='dropped').count(),
        })