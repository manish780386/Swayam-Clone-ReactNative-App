from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    name        = models.CharField(max_length=100, unique=True)
    slug        = models.SlugField(unique=True, blank=True)
    icon        = models.CharField(max_length=10, default='📚')
    color       = models.CharField(max_length=20, default='#1565C0')
    bg_color    = models.CharField(max_length=20, default='#E3F2FD')
    description = models.TextField(blank=True)
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Categories'
        ordering            = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    @property
    def course_count(self):
        return self.courses.filter(status='published').count()


class Institution(models.Model):
    TYPES = [
        ('IIT','IIT'), ('IIM','IIM'), ('NIT','NIT'),
        ('Central','Central University'),
        ('State','State University'),
        ('Other','Other'),
    ]
    name       = models.CharField(max_length=200, unique=True)
    short_name = models.CharField(max_length=50)
    logo       = models.ImageField(upload_to='institutions/', blank=True, null=True)
    city       = models.CharField(max_length=100, blank=True)
    type       = models.CharField(max_length=20, choices=TYPES, default='Other')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.short_name


class Course(models.Model):
    LEVELS   = [('Beginner','Beginner'), ('Intermediate','Intermediate'), ('Advanced','Advanced')]
    STATUSES = [('draft','Draft'), ('published','Published'), ('archived','Archived')]

    title          = models.CharField(max_length=300)
    slug           = models.SlugField(unique=True, blank=True)
    description    = models.TextField()
    category       = models.ForeignKey(Category,    on_delete=models.SET_NULL, null=True, related_name='courses')
    institution    = models.ForeignKey(Institution, on_delete=models.SET_NULL, null=True, related_name='courses')
    instructor     = models.CharField(max_length=200)
    icon           = models.CharField(max_length=10, default='📚')
    color          = models.CharField(max_length=20, default='#1565C0')
    level          = models.CharField(max_length=15, choices=LEVELS,   default='Beginner')
    language       = models.CharField(max_length=100, default='English')
    credits        = models.PositiveSmallIntegerField(default=3)
    duration_weeks = models.PositiveSmallIntegerField(default=8)
    start_date     = models.DateField(null=True, blank=True)
    end_date       = models.DateField(null=True, blank=True)
    exam_date      = models.DateField(null=True, blank=True)
    tags           = models.JSONField(default=list, blank=True)
    status         = models.CharField(max_length=15, choices=STATUSES, default='published')
    enrolled_count = models.PositiveIntegerField(default=0)
    created_at     = models.DateTimeField(auto_now_add=True)
    updated_at     = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.title)
            slug = base
            n = 1
            while Course.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base}-{n}"
                n += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    @property
    def avg_rating(self):
        reviews = self.reviews.all()
        if not reviews.exists():
            return 0.0
        return round(sum(r.rating for r in reviews) / reviews.count(), 1)

    @property
    def review_count(self):
        return self.reviews.count()


class CourseWeek(models.Model):
    course      = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='weeks')
    week_number = models.PositiveSmallIntegerField()
    title       = models.CharField(max_length=300)
    description = models.TextField(blank=True)
    video_url   = models.URLField(blank=True)
    pdf_url     = models.URLField(blank=True)

    class Meta:
        ordering       = ['week_number']
        unique_together = ['course', 'week_number']

    def __str__(self):
        return f"Week {self.week_number}: {self.title}"


class CourseReview(models.Model):
    course     = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='reviews')
    user       = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='reviews')
    rating     = models.PositiveSmallIntegerField(choices=[(i, i) for i in range(1, 6)])
    comment    = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['course', 'user']
        ordering        = ['-created_at']

    def __str__(self):
        return f"{self.user.full_name} → {self.course.title} ({self.rating}★)"