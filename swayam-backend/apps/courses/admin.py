from django.contrib import admin
from .models import Category, Institution, Course, CourseWeek, CourseReview


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display        = ['name', 'slug', 'icon', 'course_count']
    prepopulated_fields = {'slug': ('name',)}
    search_fields       = ['name']


@admin.register(Institution)
class InstitutionAdmin(admin.ModelAdmin):
    list_display  = ['short_name', 'name', 'type', 'city']
    list_filter   = ['type']
    search_fields = ['name', 'short_name']


class CourseWeekInline(admin.TabularInline):
    model  = CourseWeek
    extra  = 1
    fields = ['week_number', 'title', 'description', 'video_url', 'pdf_url']


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display        = ['title', 'institution', 'category', 'level', 'status', 'enrolled_count', 'start_date']
    list_filter         = ['status', 'level', 'category']
    search_fields       = ['title', 'instructor']
    prepopulated_fields = {'slug': ('title',)}
    inlines             = [CourseWeekInline]
    readonly_fields     = ['enrolled_count', 'created_at', 'updated_at']


@admin.register(CourseReview)
class CourseReviewAdmin(admin.ModelAdmin):
    list_display  = ['user', 'course', 'rating', 'created_at']
    list_filter   = ['rating']