import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, RADIUS, SHADOW } from '../styles/theme';

const STATUS_CONFIG = {
  completed: { label: 'Completed', bg: '#E8F5E9', color: '#2E7D32' },
  ongoing:   { label: 'Ongoing',   bg: '#E3F2FD', color: '#1565C0' },
  upcoming:  { label: 'Upcoming',  bg: '#FFF3E0', color: '#E65100' },
};

export default function CourseCard({ course, onPress, enrollStatus }) {
  // enrollStatus comes from enrollment data, else fallback to course status
  const statusKey = enrollStatus || course.status || 'upcoming';
  const sc = STATUS_CONFIG[statusKey] || STATUS_CONFIG.upcoming;

  const progress = course.progress || 0;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.88}>
      {/* Color Strip */}
      <View style={[styles.strip, { backgroundColor: course.color || COLORS.primary }]}>
        <Text style={styles.icon}>{course.icon || '📚'}</Text>
        <View style={[styles.badge, { backgroundColor: sc.bg }]}>
          <View style={[styles.dot, { backgroundColor: sc.color }]} />
          <Text style={[styles.badgeText, { color: sc.color }]}>{sc.label}</Text>
        </View>
      </View>

      {/* Body */}
      <View style={styles.body}>
        <Text style={styles.inst}>
          {course.institution_name || course.institution?.short_name || ''}
        </Text>
        <Text style={styles.title} numberOfLines={2}>{course.title}</Text>
        <Text style={styles.instructor} numberOfLines={1}>👤 {course.instructor}</Text>

        <View style={styles.metaRow}>
          <View style={styles.chip}>
            <Text style={styles.chipText}>⏱ {course.duration_weeks}w</Text>
          </View>
          <View style={styles.chip}>
            <Text style={styles.chipText}>
              👥 {course.enrolled_count >= 1000
                ? `${(course.enrolled_count / 1000).toFixed(0)}k`
                : course.enrolled_count}
            </Text>
          </View>
          <View style={styles.chip}>
            <Text style={styles.chipText}>
              ⭐ {course.avg_rating || '—'}
            </Text>
          </View>
          <View style={[styles.chip, { backgroundColor: (course.color || COLORS.primary) + '18' }]}>
            <Text style={[styles.chipText, { color: course.color || COLORS.primary }]}>
              {course.level}
            </Text>
          </View>
        </View>

        {/* Progress bar for ongoing */}
        {statusKey === 'ongoing' && (
          <View style={styles.progressRow}>
            <View style={styles.progressBg}>
              <View style={[
                styles.progressFill,
                { width: `${progress}%`, backgroundColor: course.color || COLORS.primary }
              ]} />
            </View>
            <Text style={styles.progressText}>{progress}%</Text>
          </View>
        )}

        {/* Exam date */}
        {course.exam_date && statusKey !== 'completed' && (
          <View style={styles.examRow}>
            <Text style={styles.examText}>
              📅 Exam: {new Date(course.exam_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.md,
  },
  strip: {
    height: 76,
    paddingHorizontal: 14,
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  icon: { fontSize: 36, position: 'absolute', bottom: 8, right: 12 },
  badge: {
    flexDirection: 'row', alignItems: 'center',
    gap: 5, paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full,
  },
  dot:       { width: 6, height: 6, borderRadius: 3 },
  badgeText: { fontSize: 10, fontWeight: '700' },
  body:      { padding: 14 },
  inst:      { fontSize: 10, color: COLORS.primary, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  title:     { fontSize: 14, fontWeight: '700', color: COLORS.text, lineHeight: 20, marginBottom: 6 },
  instructor:{ fontSize: 12, color: COLORS.textSec, marginBottom: 10 },
  metaRow:   { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip:      { backgroundColor: '#F5F7FF', paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.full },
  chipText:  { fontSize: 10, color: COLORS.textSec },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
  progressBg:  { flex: 1, height: 6, backgroundColor: COLORS.border, borderRadius: RADIUS.full, overflow: 'hidden' },
  progressFill:{ height: '100%', borderRadius: RADIUS.full },
  progressText:{ fontSize: 11, color: COLORS.primary, fontWeight: '700', minWidth: 28 },
  examRow:   { marginTop: 10, backgroundColor: COLORS.warnBg, padding: 6, borderRadius: RADIUS.sm },
  examText:  { fontSize: 11, color: COLORS.warn, fontWeight: '600' },
});