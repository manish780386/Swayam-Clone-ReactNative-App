from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/',   SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/auth/',           include('apps.users.urls')),
    path('api/courses/',        include('apps.courses.urls')),
    path('api/enrollments/',    include('apps.enrollments.urls')),
    path('api/notifications/',  include('apps.notifications.urls')),
    path('api/certifications/', include('apps.certifications.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)