from django.contrib import admin
from .models import Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display  = ['title', 'type', 'user', 'is_read', 'is_global', 'created_at']
    list_filter   = ['type', 'is_read', 'is_global']
    search_fields = ['title', 'user__full_name']