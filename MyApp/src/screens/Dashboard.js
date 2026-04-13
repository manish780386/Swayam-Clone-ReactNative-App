import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header    from '../components/Header';
import SideMenu  from '../components/SideMenu';
import CourseCard from '../components/CourseCard';
import { useAuth } from '../context/AuthContext';
import { AuthAPI, EnrollmentsAPI } from '../api/apiService';
import { COLORS, RADIUS, SHADOW } from '../styles/theme';

export default function Dashboard({ navigation }) {
  const { user } = useAuth();
  const [menuVisible, setMenuVisible]   = useState(false);
  const [stats,       setStats]         = useState(null);
  const [enrollments, setEnrollments]   = useState([]);
  const [loading,     setLoading]       = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [dashData, enrollData] = await Promise.all([
        AuthAPI.getDashboard(),
        EnrollmentsAPI.getAll(),
      ]);
      setStats(dashData);
      const list = Array.isArray(enrollData) ? enrollData : enrollData.results || [];
      setEnrollments(list);
    } catch (_) {}
    setLoading(false);
  };

  const ongoing   = enrollments.filter(e => e.status === 'ongoing');
  const completed = enrollments.filter(e => e.status === 'completed');

  const initials = user?.full_name
    ? user.full_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <View style={styles.root}>
      <Header title="Dashboard" onMenuPress={() => setMenuVisible(true)} navigation={navigation} />
      <SideMenu visible={menuVisible} onClose={() => setMenuVisible(false)} navigation={navigation} />

      {loading
        ? <ActivityIndicator color={COLORS.primary} style={{ flex: 1 }} />
        : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Hero */}
            <View style={styles.hero}>
              <View style={styles.heroTop}>
                <View style={styles.avatar}><Text style={styles.avatarText}>{initials}</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.heroGreet}>Welcome back 👋</Text>
                  <Text style={styles.heroName}>{user?.full_name}</Text>
                  <Text style={styles.heroEmail}>{user?.email}</Text>
                </View>
              </View>
              <View style={styles.heroStats}>
                {[
                  { val: stats?.total_enrolled || 0,   lbl: 'Enrolled' },
                  { val: stats?.completed || 0,         lbl: 'Completed' },
                  { val: stats?.certificates || 0,      lbl: 'Certs' },
                  { val: `${stats?.avg_score || 0}%`,  lbl: 'Avg Score' },
                ].map((s, i) => (
                  <View key={i} style={[styles.heroStat, i < 3 && styles.heroStatBorder]}>
                    <Text style={styles.heroStatVal}>{s.val}</Text>
                    <Text style={styles.heroStatLbl}>{s.lbl}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.quickRow}>
              {[
                { icon: 'book-outline',      label: 'My Courses',  screen: 'MyCourses',      color: '#1565C0', bg: '#E3F2FD' },
                { icon: 'ribbon-outline',    label: 'Certs',       screen: 'Certifications', color: '#2E7D32', bg: '#E8F5E9' },
                { icon: 'notifications-outline', label: 'Alerts', screen: 'Notifications',  color: '#E65100', bg: '#FFF3E0' },
                { icon: 'list-outline',      label: 'Catalog',     screen: 'CourseCatalog',  color: '#6A1B9A', bg: '#F3E5F5' },
              ].map(q => (
                <TouchableOpacity
                  key={q.screen}
                  onPress={() => navigation.navigate(q.screen)}
                  style={[styles.quickBtn, { backgroundColor: q.bg }]}
                >
                  <Ionicons name={q.icon} size={22} color={q.color} />
                  <Text style={[styles.quickLabel, { color: q.color }]}>{q.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Ongoing */}
            {ongoing.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionRow}>
                  <Text style={styles.sectionTitle}>⏳ In Progress</Text>
                  <View style={styles.countBadge}><Text style={styles.countText}>{ongoing.length}</Text></View>
                </View>
                {ongoing.map(e => (
                  <CourseCard
                    key={e.id}
                    course={e.course}
                    enrollStatus={e.status}
                    onPress={() => navigation.navigate('CourseDetail', { courseId: e.course.id, enrollmentId: e.id })}
                  />
                ))}
              </View>
            )}

            {/* Completed */}
            {completed.length > 0 && (
              <View style={[styles.section, { paddingBottom: 30 }]}>
                <View style={styles.sectionRow}>
                  <Text style={styles.sectionTitle}>✅ Completed</Text>
                  <View style={styles.countBadge}><Text style={styles.countText}>{completed.length}</Text></View>
                </View>
                {completed.map(e => (
                  <TouchableOpacity
                    key={e.id}
                    style={styles.compactCard}
                    onPress={() => navigation.navigate('CourseDetail', { courseId: e.course.id })}
                  >
                    <View style={[styles.compactStrip, { backgroundColor: (e.course.color || COLORS.primary) + '22' }]}>
                      <Text style={{ fontSize: 26 }}>{e.course.icon || '📚'}</Text>
                    </View>
                    <View style={styles.compactBody}>
                      <Text style={styles.compactTitle} numberOfLines={1}>{e.course.title}</Text>
                      <Text style={styles.compactInst}>{e.course.institution_name} · {e.course.duration_weeks}w</Text>
                      <View style={styles.doneTag}>
                        <Ionicons name="checkmark-circle" size={11} color={COLORS.success} />
                        <Text style={styles.doneTagText}>Completed</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {enrollments.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={{ fontSize: 48 }}>📚</Text>
                <Text style={styles.emptyTitle}>No enrollments yet</Text>
                <TouchableOpacity style={styles.emptyBtn} onPress={() => navigation.navigate('CourseCatalog')}>
                  <Text style={styles.emptyBtnText}>Browse Courses</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  hero: { margin: 16, backgroundColor: COLORS.primaryDark, borderRadius: RADIUS.xl, padding: 20, ...SHADOW.lg },
  heroTop: { flexDirection: 'row', gap: 14, marginBottom: 20 },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: COLORS.accentLight, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 22, fontWeight: '800' },
  heroGreet: { color: 'rgba(255,255,255,0.65)', fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8 },
  heroName:  { color: '#fff', fontSize: 20, fontWeight: '800', marginTop: 2 },
  heroEmail: { color: '#90CAF9', fontSize: 11, marginTop: 2 },
  heroStats: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: RADIUS.md, paddingVertical: 12 },
  heroStat:  { flex: 1, alignItems: 'center' },
  heroStatBorder: { borderRightWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  heroStatVal: { color: '#fff', fontSize: 18, fontWeight: '800' },
  heroStatLbl: { color: 'rgba(255,255,255,0.6)', fontSize: 9, marginTop: 2 },
  quickRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 16 },
  quickBtn: { flex: 1, alignItems: 'center', gap: 6, paddingVertical: 12, borderRadius: RADIUS.md, borderWidth: 1, borderColor: 'rgba(0,0,0,0.04)' },
  quickLabel: { fontSize: 9, fontWeight: '800' },
  section: { paddingHorizontal: 16, marginTop: 20 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text },
  countBadge: { backgroundColor: COLORS.primary, borderRadius: RADIUS.full, paddingHorizontal: 10, paddingVertical: 2 },
  countText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  compactCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: RADIUS.md, overflow: 'hidden', marginBottom: 10, borderWidth: 1, borderColor: COLORS.border, ...SHADOW.sm },
  compactStrip: { width: 64, alignItems: 'center', justifyContent: 'center' },
  compactBody: { flex: 1, padding: 12 },
  compactTitle: { fontSize: 13, fontWeight: '700', color: COLORS.text, marginBottom: 3 },
  compactInst: { fontSize: 11, color: COLORS.textMuted, marginBottom: 8 },
  doneTag: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.successBg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.full, alignSelf: 'flex-start' },
  doneTagText: { fontSize: 10, color: COLORS.success, fontWeight: '700' },
  emptyState: { alignItems: 'center', padding: 48, gap: 12 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  emptyBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.md, paddingVertical: 12, paddingHorizontal: 24 },
  emptyBtnText: { color: '#fff', fontWeight: '700' },
});