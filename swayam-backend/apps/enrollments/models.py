from django.db import models
from django.conf import settings


class Enrollment(models.Model):
    STATUS = [
        ('upcoming',  'Upcoming'),
        ('ongoing',   'Ongoing'),
        ('completed', 'Completed'),
        ('dropped',   'Dropped'),
    ]
    user        = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='enrollments')
    course      = models.ForeignKey('courses.Course',         on_delete=models.CASCADE, related_name='enrollments')
    status      = models.CharField(max_length=15, choices=STATUS, default='upcoming')
    progress    = models.PositiveSmallIntegerField(default=0)
    enrolled_at = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['user', 'course']
        ordering        = ['-enrolled_at']

    def __str__(self):
        return f"{self.user.full_name} → {self.course.title} [{self.status}]"


class WeekProgress(models.Model):
    enrollment   = models.ForeignKey(Enrollment, on_delete=models.CASCADE, related_name='week_progress')
    week         = models.ForeignKey('courses.CourseWeek', on_delete=models.CASCADE)
    completed    = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ['enrollment', 'week']

    def __str__(self):
        return f"{self.enrollment.user.full_name} - Week {self.week.week_number}"