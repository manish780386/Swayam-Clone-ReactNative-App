from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model

from .serializers import (
    UserRegisterSerializer, UserProfileSerializer,
    UserUpdateSerializer, ChangePasswordSerializer,
    CustomTokenSerializer,
)

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    queryset           = User.objects.all()
    serializer_class   = UserRegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user    = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'Account created successfully!',
            'access':  str(refresh.access_token),
            'refresh': str(refresh),
            'user':    UserProfileSerializer(user).data,
        }, status=status.HTTP_201_CREATED)


class LoginView(TokenObtainPairView):
    serializer_class   = CustomTokenSerializer
    permission_classes = [permissions.AllowAny]


class LogoutView(APIView):
    def post(self, request):
        try:
            token = RefreshToken(request.data.get('refresh'))
            token.blacklist()
            return Response({'message': 'Logged out successfully.'})
        except Exception:
            return Response({'error': 'Invalid token.'}, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(generics.RetrieveUpdateAPIView):
    def get_object(self):
        return self.request.user

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return UserUpdateSerializer
        return UserProfileSerializer


class ChangePasswordView(APIView):
    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data, context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        request.user.set_password(serializer.validated_data['new_password'])
        request.user.save()
        return Response({'message': 'Password changed successfully.'})


class DashboardStatsView(APIView):
    def get(self, request):
        user = request.user
        from apps.enrollments.models import Enrollment
        from apps.certifications.models import Certification

        enrollments = Enrollment.objects.filter(user=user)
        certs       = Certification.objects.filter(user=user)
        avg_score   = 0
        if certs.exists():
            avg_score = round(sum(c.score for c in certs) / certs.count(), 1)

        return Response({
            'user':           UserProfileSerializer(user).data,
            'total_enrolled': enrollments.count(),
            'ongoing':        enrollments.filter(status='ongoing').count(),
            'completed':      enrollments.filter(status='completed').count(),
            'upcoming':       enrollments.filter(status='upcoming').count(),
            'certificates':   certs.count(),
            'avg_score':      avg_score,
        })