from rest_framework import serializers
from .models import Certification
from apps.courses.serializers import CourseListSerializer


class CertificationSerializer(serializers.ModelSerializer):
    course      = CourseListSerializer(read_only=True)
    user_name   = serializers.CharField(source='user.full_name', read_only=True)
    user_email  = serializers.CharField(source='user.email',     read_only=True)

    class Meta:
        model  = Certification
        fields = [
            'id', 'user_name', 'user_email', 'course',
            'score', 'grade', 'cert_number', 'issued_date',
        ]
        read_only_fields = ['id', 'user_name', 'user_email', 'cert_number', 'issued_date']