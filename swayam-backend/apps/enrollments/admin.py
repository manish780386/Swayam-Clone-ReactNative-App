from django.contrib import admin
from .models import Enrollment, WeekProgress


class WeekProgressInline(admin.TabularInline):
    model       = WeekProgress
    extra       = 0
    fields      = ['week', 'completed', 'completed_at']
    readonly_fields = ['completed_at']


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display  = ['user', 'course', 'status', 'progress', 'enrolled_at']
    list_filter   = ['status']
    search_fields = ['user__full_name', 'user__email', 'course__title']
    inlines       = [WeekProgressInline]
    readonly_fields = ['enrolled_at', 'updated_at']