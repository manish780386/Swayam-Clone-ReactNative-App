from django.contrib import admin
from .models import Certification


@admin.register(Certification)
class CertificationAdmin(admin.ModelAdmin):
    list_display  = ['user', 'course', 'score', 'grade', 'cert_number', 'issued_date']
    list_filter   = ['grade']
    search_fields = ['user__full_name', 'course__title', 'cert_number']
    readonly_fields = ['cert_number', 'issued_date']