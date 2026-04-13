from rest_framework import serializers
from .models import Category, Institution, Course, CourseWeek, CourseReview


class CategorySerializer(serializers.ModelSerializer):
    course_count = serializers.ReadOnlyField()

    class Meta:
        model  = Category
        fields = ['id', 'name', 'slug', 'icon', 'color', 'bg_color', 'description', 'course_count']


class InstitutionSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Institution
        fields = ['id', 'name', 'short_name', 'logo', 'city', 'type']


class CourseWeekSerializer(serializers.ModelSerializer):
    class Meta:
        model  = CourseWeek
        fields = ['id', 'week_number', 'title', 'description', 'video_url', 'pdf_url']


class CourseReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.full_name', read_only=True)

    class Meta:
        model  = CourseReview
        fields = ['id', 'user_name', 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'user_name', 'created_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class CourseListSerializer(serializers.ModelSerializer):
    category_name    = serializers.CharField(source='category.name',          read_only=True)
    category_slug    = serializers.CharField(source='category.slug',          read_only=True)
    category_icon    = serializers.CharField(source='category.icon',          read_only=True)
    category_color   = serializers.CharField(source='category.color',         read_only=True)
    institution_name = serializers.CharField(source='institution.short_name', read_only=True)
    avg_rating       = serializers.ReadOnlyField()
    review_count     = serializers.ReadOnlyField()

    class Meta:
        model  = Course
        fields = [
            'id', 'title', 'slug', 'icon', 'color', 'level', 'language',
            'credits', 'duration_weeks', 'start_date', 'end_date', 'exam_date',
            'tags', 'status', 'enrolled_count', 'instructor',
            'category_name', 'category_slug', 'category_icon', 'category_color',
            'institution_name', 'avg_rating', 'review_count',
        ]


class CourseDetailSerializer(serializers.ModelSerializer):
    category     = CategorySerializer(read_only=True)
    institution  = InstitutionSerializer(read_only=True)
    weeks        = CourseWeekSerializer(many=True, read_only=True)
    reviews      = CourseReviewSerializer(many=True, read_only=True)
    avg_rating   = serializers.ReadOnlyField()
    review_count = serializers.ReadOnlyField()

    class Meta:
        model  = Course
        fields = [
            'id', 'title', 'slug', 'description', 'icon', 'color',
            'level', 'language', 'credits', 'duration_weeks',
            'start_date', 'end_date', 'exam_date',
            'tags', 'status', 'enrolled_count', 'instructor',
            'category', 'institution',
            'weeks', 'reviews',
            'avg_rating', 'review_count',
            'created_at', 'updated_at',
        ]