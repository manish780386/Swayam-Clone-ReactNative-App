from rest_framework import serializers
from apps.courses.models import Course
from .models import Enrollment, WeekProgress
from apps.courses.serializers import CourseListSerializer


class WeekProgressSerializer(serializers.ModelSerializer):
    week_number = serializers.IntegerField(source='week.week_number', read_only=True)
    week_title  = serializers.CharField(source='week.title',          read_only=True)

    class Meta:
        model  = WeekProgress
        fields = ['id', 'week_number', 'week_title', 'completed', 'completed_at']


class EnrollmentSerializer(serializers.ModelSerializer):
    course       = CourseListSerializer(read_only=True)
    course_id    = serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.all(), source='course', write_only=True
    )
    week_progress = WeekProgressSerializer(many=True, read_only=True)

    class Meta:
        model  = Enrollment
        fields = ['id', 'course', 'course_id', 'status', 'progress',
                  'week_progress', 'enrolled_at', 'updated_at']
        read_only_fields = ['id', 'status', 'progress', 'enrolled_at', 'updated_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class EnrollmentUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Enrollment
        fields = ['status', 'progress']


class WeekCompleteSerializer(serializers.Serializer):
    week_id   = serializers.IntegerField()
    completed = serializers.BooleanField(default=True)