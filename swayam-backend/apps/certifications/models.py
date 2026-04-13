from django.db import models
from django.conf import settings


class Certification(models.Model):
    GRADES = [
        ('Elite + Gold', 'Elite + Gold'),
        ('Elite',        'Elite'),
        ('Silver',       'Silver'),
        ('Pass',         'Pass'),
    ]
    user        = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='certifications')
    course      = models.ForeignKey('courses.Course',         on_delete=models.CASCADE, related_name='certifications')
    enrollment  = models.OneToOneField('enrollments.Enrollment', on_delete=models.CASCADE, related_name='certification', null=True, blank=True)
    score       = models.FloatField(default=0)
    grade       = models.CharField(max_length=20, choices=GRADES, default='Pass')
    issued_date = models.DateField(auto_now_add=True)
    cert_number = models.CharField(max_length=50, unique=True, blank=True)

    class Meta:
        unique_together = ['user', 'course']
        ordering        = ['-issued_date']

    def save(self, *args, **kwargs):
        if not self.cert_number:
            import uuid
            self.cert_number = f"SWAYAM-{uuid.uuid4().hex[:10].upper()}"
        if not self.grade:
            self.grade = self._compute_grade()
        super().save(*args, **kwargs)

    def _compute_grade(self):
        if self.score >= 90:
            return 'Elite + Gold'
        elif self.score >= 75:
            return 'Elite'
        elif self.score >= 60:
            return 'Silver'
        return 'Pass'

    def __str__(self):
        return f"{self.user.full_name} — {self.course.title} [{self.grade}]"