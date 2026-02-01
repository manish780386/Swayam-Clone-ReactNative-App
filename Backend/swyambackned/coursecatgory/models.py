from django.db import models

class Course(models.Model):
    CATEGORY_CHOICES = [
        (1, 'Popular Courses'),
        (2, 'Architecture & Planning'),
        (3, 'Design'),
        (4, 'Teacher Education'),
        (5, 'Energy'),
        (6, 'Engineering'),
        (7, 'Health Sciences'),
        (8, 'Arts'),
        (9, 'Law'),
        (10, 'Management'),
    ]

    course_name = models.CharField(max_length=200)
    instructor = models.CharField(max_length=100)
    duration_weeks = models.IntegerField()
    level = models.CharField(max_length=50)
    platform = models.CharField(max_length=50)
    description = models.TextField()
    category = models.IntegerField(choices=CATEGORY_CHOICES)

    def __str__(self):
        return self.course_name