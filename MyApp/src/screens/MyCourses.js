import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, ScrollView,
} from 'react-native';
import Header    from '../components/Header';
import SideMenu  from '../components/SideMenu';
import CourseCard from '../components/CourseCard';
import { EnrollmentsAPI } from '../api/apiService';
import { COLORS, RADIUS, SHADOW } from '../styles/theme';

const TABS = [
  { label: 'All',       status: null        },
  { label: 'Ongoing',   status: 'ongoing'   },
  { label: 'Completed', status: 'completed' },
  { label: 'Upcoming',  status: 'upcoming'  },
];

export default function MyCourses({ navigation }) {
  const [menuVisible,  setMenuVisible]  = useState(false);
  const [enrollments,  setEnrollments]  = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [tab,          setTab]          = useState(0);

  useEffect(() => { fetchEnrollments(); }, []);

  const fetchEnrollments = async () => {
    try {
      const data = await EnrollmentsAPI.getAll();
      setEnrollments(Array.isArray(data) ? data : data.results || []);
    } catch (_) {}
    setLoading(false);
  };

  const filtered = TABS[tab].status
    ? enrollments.filter(e => e.status === TABS[tab].status)
    : enrollments;

  const countFor = (status) =>
    status ? enrollments.filter(e => e.status === status).length : enrollments.length;

  return (
    <View style={styles.root}>
      <Header
        title="My Courses"
        onMenuPress={() => setMenuVisible(true)}
        navigation={navigation}
      />
      <SideMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        navigation={navigation}
      />

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsScroll}
        contentContainerStyle={styles.tabsContent}
      >
        {TABS.map((t, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => setTab(i)}
            style={[styles.tab, tab === i && styles.tabActive]}
          >
            <Text style={[styles.tabText, tab === i && styles.tabTextActive]}>
              {t.label}
            </Text>
            <View style={[styles.tabBadge, tab === i && styles.tabBadgeActive]}>
              <Text style={[styles.tabBadgeText, tab === i && styles.tabBadgeTextActive]}>
                {countFor(t.status)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <ActivityIndicator color={COLORS.primary} style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={{ fontSize: 42 }}>📭</Text>
              <Text style={styles.emptyTitle}>No {TABS[tab].label.toLowerCase()} courses</Text>
              <TouchableOpacity
                style={styles.emptyBtn}
                onPress={() => navigation.navigate('CourseCatalog')}
              >
                <Text style={styles.emptyBtnText}>Browse Catalog</Text>
              </TouchableOpacity>
            </View>
          }
          renderItem={({ item }) => (
            <CourseCard
              course={item.course}
              enrollStatus={item.status}
              onPress={() =>
                navigation.navigate('CourseDetail', {
                  courseId:     item.course.id,
                  enrollmentId: item.id,
                })
              }
            />
          )}
          ListFooterComponent={<View style={{ height: 30 }} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },

  tabsScroll:   { maxHeight: 56, marginTop: 4 },
  tabsContent:  { paddingHorizontal: 16, gap: 8, alignItems: 'center', paddingVertical: 8 },
  tab: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 16, paddingVertical: 7,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.white,
    borderWidth: 1, borderColor: COLORS.border,
  },
  tabActive:    { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  tabText:      { fontSize: 13, fontWeight: '600', color: COLORS.textSec },
  tabTextActive:{ color: COLORS.white },
  tabBadge:     { backgroundColor: COLORS.bg, borderRadius: RADIUS.full, paddingHorizontal: 7, paddingVertical: 1 },
  tabBadgeActive:    { backgroundColor: 'rgba(255,255,255,0.25)' },
  tabBadgeText:      { fontSize: 10, fontWeight: '800', color: COLORS.textSec },
  tabBadgeTextActive:{ color: COLORS.white },

  list: { padding: 16 },

  empty: { alignItems: 'center', paddingTop: 60, gap: 14 },
  emptyTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textMuted },
  emptyBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 11, paddingHorizontal: 24,
  },
  emptyBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 13 },
});