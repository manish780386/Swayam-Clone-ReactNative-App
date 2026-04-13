from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display        = ['email', 'full_name', 'mobile', 'city', 'is_active', 'date_joined']
    list_filter         = ['is_active', 'is_staff', 'city']
    search_fields       = ['email', 'full_name', 'mobile']
    ordering            = ['-date_joined']
    readonly_fields     = ['date_joined', 'last_login']
    fieldsets = (
        (None,          {'fields': ('email', 'password')}),
        ('Personal',    {'fields': ('full_name', 'mobile', 'avatar', 'bio', 'institution', 'city')}),
        ('Preferences', {'fields': ('notif_push', 'notif_email')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Dates',       {'fields': ('date_joined', 'last_login')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields':  ('email', 'full_name', 'mobile', 'password1', 'password2'),
        }),
    )