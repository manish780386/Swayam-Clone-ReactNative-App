from django.db import models
from django.conf import settings


class Notification(models.Model):
    TYPES = [
        ('exam',         'Exam'),
        ('assignment',   'Assignment'),
        ('certificate',  'Certificate'),
        ('course',       'Course'),
        ('announcement', 'Announcement'),
    ]
    user       = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='notifications', null=True, blank=True,
    )
    type       = models.CharField(max_length=20, choices=TYPES, default='announcement')
    title      = models.CharField(max_length=200)
    message    = models.TextField()
    icon       = models.CharField(max_length=10, default='🔔')
    color      = models.CharField(max_length=20, default='#1565C0')
    is_read    = models.BooleanField(default=False)
    is_global  = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        target = 'Everyone' if self.is_global else (self.user.full_name if self.user else '—')
        return f"[{self.type}] {self.title} → {target}"