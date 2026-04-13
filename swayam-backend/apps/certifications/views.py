from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Certification
from .serializers import CertificationSerializer


class CertificationViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class   = CertificationSerializer

    def get_queryset(self):
        return Certification.objects.filter(
            user=self.request.user
        ).select_related('course', 'course__institution')

    @action(detail=False, methods=['get'])
    def summary(self, request):
        qs        = self.get_queryset()
        avg_score = 0
        if qs.exists():
            avg_score = round(sum(c.score for c in qs) / qs.count(), 1)
        return Response({
            'total':        qs.count(),
            'elite_gold':   qs.filter(grade='Elite + Gold').count(),
            'elite':        qs.filter(grade='Elite').count(),
            'silver':       qs.filter(grade='Silver').count(),
            'avg_score':    avg_score,
        })