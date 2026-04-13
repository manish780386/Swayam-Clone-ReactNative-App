from rest_framework import serializers
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Notification
        fields = ['id', 'type', 'title', 'message', 'icon',
                  'color', 'is_read', 'is_global', 'created_at']
        read_only_fields = ['id', 'created_at']