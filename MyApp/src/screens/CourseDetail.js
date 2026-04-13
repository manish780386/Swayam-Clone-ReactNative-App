import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import { CoursesAPI, EnrollmentsAPI } from '../api/apiService';
import { COLORS, RADIUS, SHADOW } from '../styles/theme';

export default function CourseDetail({ route, navigation }) {
  const { courseId, enrollmentId } = route.params;

  const [course,     setCourse]     = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [enrolling,  setEnrolling]  = useState(false);

  useEffect(() => {
    fetchCourse();
    if (enrollmentId) fetchEnrollment();
  }, []);

  const fetchCourse = async () => {
    try {
      const data = await CoursesAPI.getDetail(courseId);
      setCourse(data);
    } catch (_) {}
    setLoading(false);
  };

  const fetchEnrollment = async () => {
    try {
      const data = await EnrollmentsAPI.getDetail(enrollmentId);
      setEnrollment(data);
    } catch (_) {}
  };

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      const data = await EnrollmentsAPI.enroll(courseId);
      setEnrollment(data);
      Alert.alert('Enrolled! 🎉', `You are now enrolled in "${course.title}"`);
    } catch (err) {
      const msg = err?.error || err?.detail || 'Enrollment failed. Try again.';
      Alert.alert('Error', msg);
    } finally {
      setEnrolling(false);
    }
  };

  const handleWeekComplete = async (weekId, done) => {
    if (!enrollment) return;
    try {
      const res = await EnrollmentsAPI.completeWeek(enrollment.id, weekId, done);
      setEnrollment(prev => ({
        ...prev,
        progress: res.progress,
        status:   res.status,
        week_progress: prev.week_progress.map(wp =>
          wp.id === weekId ? { ...wp, completed: done } : wp
        ),
      }));
    } catch (_) {}
  };

  if (loading) {
    return (
      <View style={styles.root}>
        <Header title="Course Detail" showBack navigation={navigation} />
        <ActivityIndicator color={COLORS.primary} style={{ flex: 1 }} />
      </View>
    );
  }

  if (!course) {
    return (
      <View style={styles.root}>
        <Header title="Course Detail" showBack navigation={navigation} />
        <View style={styles.errorState}>
          <Text style={{ fontSize: 40 }}>⚠️</Text>
          <Text style={styles.errorText}>Course not found</Text>
        </View>
      </View>
    );
  }

  const isEnrolled  = !!enrollment;
  const isCompleted = enrollment?.status === 'completed';
  const isOngoing   = enrollment?.status === 'ongoing';
  const progress    = enrollment?.progress || 0;

  return (
    <View style={styles.root}>
      <Header title="Course Detail" showBack navigation={navigation} />

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={[styles.hero, { backgroundColor: course.color || COLORS.primary }]}>
          <Text style={styles.heroIcon}>{course.icon || '📚'}</Text>
          <Text style={styles.heroInst}>
            {course.institution?.short_name || ''}
          </Text>
          <Text style={styles.heroTitle}>{course.title}</Text>
          <Text style={styles.heroInstructor}>👤 {course.instructor}</Text>
          <View style={styles.tagsRow}>
            {(course.tags || []).map(tag => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Progress (if enrolled & ongoing) */}
        {isEnrolled && (
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Your Progress</Text>
              <Text style={styles.progressPct}>{progress}%</Text>
            </View>
            <View style={styles.progressBg}>
              <View style={[
                styles.progressFill,
                { width: `${progress}%`, backgroundColor: course.color || COLORS.primary },
              ]} />
            </View>
            <Text style={styles.progressSub}>
              Status: {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
            </Text>
          </View>
        )}

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {[
            { icon: 'time-outline',       label: 'Duration',  val: `${course.duration_weeks} weeks` },
            { icon: 'people-outline',     label: 'Enrolled',  val: `${(course.enrolled_count / 1000).toFixed(0)}k+` },
            { icon: 'star-outline',       label: 'Rating',    val: `${course.avg_rating || '—'} ⭐` },
            { icon: 'school-outline',     label: 'Credits',   val: `${course.credits} Cr` },
            { icon: 'language-outline',   label: 'Language',  val: course.language },
            { icon: 'bar-chart-outline',  label: 'Level',     val: course.level },
          ].map((s, i) => (
            <View key={i} style={styles.statCard}>
              <Ionicons name={s.icon} size={20} color={course.color || COLORS.primary} />
              <Text style={styles.statVal}>{s.val}</Text>
              <Text style={styles.statLbl}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Dates */}
        <View style={styles.datesCard}>
          {[
            { icon: 'calendar-outline', label: 'Start',    val: course.start_date ? new Date(course.start_date).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}) : 'TBA', color: COLORS.primary },
            { icon: 'flag-outline',     label: 'End',      val: course.end_date   ? new Date(course.end_date).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}) : 'TBA',   color: COLORS.warn    },
            { icon: 'document-text-outline', label: 'Exam', val: course.exam_date ? new Date(course.exam_date).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}) : 'TBA', color: COLORS.success },
          ].map((d, i) => (
            <View key={i} style={[styles.dateItem, i < 2 && styles.dateBorder]}>
              <Ionicons name={d.icon} size={15} color={d.color} />
              <Text style={styles.dateLbl}>{d.label}</Text>
              <Text style={styles.dateVal}>{d.val}</Text>
            </View>
          ))}
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About this Course</Text>
          <Text style={styles.desc}>{course.description}</Text>
        </View>

        {/* Week-wise Content (if enrolled) */}
        {isEnrolled && enrollment.week_progress?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Week-wise Content</Text>
            {enrollment.week_progress.map(wp => (
              <TouchableOpacity
                key={wp.id}
                style={styles.weekRow}
                onPress={() => handleWeekComplete(wp.id, !wp.completed)}
              >
                <View style={[
                  styles.weekCircle,
                  { backgroundColor: wp.completed ? (course.color || COLORS.primary) : COLORS.border },
                ]}>
                  {wp.completed
                    ? <Ionicons name="checkmark" size={14} color="#fff" />
                    : <Text style={styles.weekNum}>{wp.week_number}</Text>
                  }
                </View>
                <Text style={[
                  styles.weekTitle,
                  { color: wp.completed ? COLORS.text : COLORS.textMuted },
                ]}>
                  {wp.week_title}
                </Text>
                {wp.completed && (
                  <View style={styles.weekDone}>
                    <Text style={styles.weekDoneText}>Done</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Reviews */}
        {course.reviews?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Reviews ({course.review_count})
            </Text>
            {course.reviews.slice(0, 3).map(r => (
              <View key={r.id} style={styles.reviewCard}>
                <View style={styles.reviewTop}>
                  <View style={styles.reviewAvatar}>
                    <Text style={styles.reviewAvatarText}>
                      {r.user_name?.charAt(0).toUpperCase() || 'U'}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.reviewName}>{r.user_name}</Text>
                    <Text style={styles.reviewRating}>{'⭐'.repeat(r.rating)}</Text>
                  </View>
                </View>
                {r.comment ? <Text style={styles.reviewComment}>{r.comment}</Text> : null}
              </View>
            ))}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actions}>
          {!isEnrolled && (
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: course.color || COLORS.primary }]}
              onPress={handleEnroll}
              disabled={enrolling}
            >
              {enrolling
                ? <ActivityIndicator color="#fff" />
                : <>
                    <Ionicons name="add-circle-outline" size={20} color="#fff" />
                    <Text style={styles.actionBtnText}>Enroll Now (Free)</Text>
                  </>
              }
            </TouchableOpacity>
          )}

          {isOngoing && (
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: course.color || COLORS.primary }]}
            >
              <Ionicons name="play-circle-outline" size={20} color="#fff" />
              <Text style={styles.actionBtnText}>Continue Learning</Text>
            </TouchableOpacity>
          )}

          {isCompleted && (
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: COLORS.success }]}>
              <Ionicons name="download-outline" size={20} color="#fff" />
              <Text style={styles.actionBtnText}>Download Certificate</Text>
            </TouchableOpacity>
          )}

          {isEnrolled && !isCompleted && course.exam_date && (
            <TouchableOpacity style={styles.outlineBtn}>
              <Ionicons name="clipboard-outline" size={18} color={COLORS.primary} />
              <Text style={styles.outlineBtnText}>Register for Exam</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },

  hero: { padding: 22, paddingBottom: 28 },
  heroIcon:       { fontSize: 48, marginBottom: 12 },
  heroInst:       { color: 'rgba(255,255,255,0.75)', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 },
  heroTitle:      { color: '#fff', fontSize: 20, fontWeight: '800', lineHeight: 26, marginBottom: 8 },
  heroInstructor: { color: 'rgba(255,255,255,0.82)', fontSize: 13, marginBottom: 12 },
  tagsRow:        { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag:            { backgroundColor: 'rgba(255,255,255,0.18)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full },
  tagText:        { color: '#fff', fontSize: 10, fontWeight: '700' },

  progressCard: {
    margin: 16, backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg, padding: 16,
    borderWidth: 1, borderColor: COLORS.border, ...SHADOW.sm,
  },
  progressHeader:  { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  progressLabel:   { fontSize: 14, fontWeight: '700', color: COLORS.text },
  progressPct:     { fontSize: 16, fontWeight: '800', color: COLORS.primary },
  progressBg:      { height: 8, backgroundColor: COLORS.border, borderRadius: RADIUS.full, overflow: 'hidden', marginBottom: 8 },
  progressFill:    { height: '100%', borderRadius: RADIUS.full },
  progressSub:     { fontSize: 11, color: COLORS.textMuted },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 12, gap: 10 },
  statCard: {
    width: '30%', backgroundColor: COLORS.white,
    borderRadius: RADIUS.md, padding: 12,
    alignItems: 'center', gap: 4,
    borderWidth: 1, borderColor: COLORS.border, ...SHADOW.sm,
  },
  statVal: { fontSize: 13, fontWeight: '800', color: COLORS.text },
  statLbl: { fontSize: 9, color: COLORS.textMuted, textAlign: 'center' },

  datesCard: {
    flexDirection: 'row', marginHorizontal: 16,
    backgroundColor: COLORS.white, borderRadius: RADIUS.lg,
    padding: 14, borderWidth: 1, borderColor: COLORS.border, ...SHADOW.sm,
  },
  dateItem:   { flex: 1, alignItems: 'center', gap: 4 },
  dateBorder: { borderRightWidth: 1, borderColor: COLORS.border },
  dateLbl:    { fontSize: 9, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.4 },
  dateVal:    { fontSize: 11, fontWeight: '700', color: COLORS.text, textAlign: 'center' },

  section:      { paddingHorizontal: 16, marginTop: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text, marginBottom: 12 },
  desc:         { fontSize: 13, color: COLORS.textSec, lineHeight: 22 },

  weekRow:    { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  weekCircle: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  weekNum:    { fontSize: 11, fontWeight: '800', color: COLORS.textMuted },
  weekTitle:  { flex: 1, fontSize: 13, fontWeight: '500' },
  weekDone:   { backgroundColor: COLORS.successBg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.full },
  weekDoneText: { fontSize: 9, color: COLORS.success, fontWeight: '700' },

  reviewCard: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.md,
    padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: COLORS.border, ...SHADOW.sm,
  },
  reviewTop:       { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  reviewAvatar:    { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.primaryBg, alignItems: 'center', justifyContent: 'center' },
  reviewAvatarText:{ fontSize: 16, fontWeight: '800', color: COLORS.primary },
  reviewName:      { fontSize: 13, fontWeight: '700', color: COLORS.text },
  reviewRating:    { fontSize: 11, marginTop: 2 },
  reviewComment:   { fontSize: 12, color: COLORS.textSec, lineHeight: 18 },

  actions:    { paddingHorizontal: 16, marginTop: 24, gap: 12 },
  actionBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, height: 52, borderRadius: RADIUS.md, ...SHADOW.md,
  },
  actionBtnText:  { color: '#fff', fontSize: 15, fontWeight: '800' },
  outlineBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, height: 50, borderRadius: RADIUS.md,
    borderWidth: 1.5, borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryBg,
  },
  outlineBtnText: { color: COLORS.primary, fontSize: 14, fontWeight: '700' },

  errorState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  errorText:  { fontSize: 15, fontWeight: '700', color: COLORS.textMuted },
});