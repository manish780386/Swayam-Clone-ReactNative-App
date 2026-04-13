import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, FlatList, TextInput,
  Dimensions, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header    from '../components/Header';
import SideMenu  from '../components/SideMenu';
import CourseCard from '../components/CourseCard';
import { useAuth } from '../context/AuthContext';
import { CoursesAPI, NotificationsAPI } from '../api/apiService';
import { COLORS, RADIUS, SHADOW } from '../styles/theme';

const { width } = Dimensions.get('window');

const BANNERS = [
  { title: 'Making Quality Education', highlight: 'Accessible to All', bg: '#0D47A1', emoji: '🎓' },
  { title: 'Learn from India\'s Best', highlight: 'IITs · IIMs · NITs', bg: '#E65100', emoji: '🏛️' },
  { title: 'Earn Credit-Linked',       highlight: 'Certifications Free', bg: '#1B5E20', emoji: '🏅' },
];

const QUICK = [
  { title: 'My Courses',    icon: 'book-outline',          color: '#1565C0', bg: '#E3F2FD', screen: 'MyCourses'     },
  { title: 'Dashboard',     icon: 'grid-outline',          color: '#E65100', bg: '#FFF3E0', screen: 'Dashboard'     },
  { title: 'Certificates',  icon: 'ribbon-outline',        color: '#2E7D32', bg: '#E8F5E9', screen: 'Certifications'},
  { title: 'Catalog',       icon: 'list-outline',          color: '#6A1B9A', bg: '#F3E5F5', screen: 'CourseCatalog' },
  { title: 'Categories',    icon: 'apps-outline',          color: '#004D40', bg: '#E0F2F1', screen: 'Categories'    },
  { title: 'Notifications', icon: 'notifications-outline', color: '#BF360C', bg: '#FBE9E7', screen: 'Notifications' },
  { title: 'FAQ',           icon: 'help-circle-outline',   color: '#37474F', bg: '#ECEFF1', screen: 'FAQ'           },
  { title: 'About',         icon: 'information-circle-outline', color: '#880E4F', bg: '#FCE4EC', screen: 'About'    },
];

export default function Home({ navigation }) {
  const { user } = useAuth();
  const [menuVisible,   setMenuVisible]   = useState(false);
  const [bannerIdx,     setBannerIdx]     = useState(0);
  const [popular,       setPopular]       = useState([]);
  const [loadingCourses,setLoadingCourses]= useState(true);
  const [search,        setSearch]        = useState('');
  const [unreadCount,   setUnreadCount]   = useState(0);

  useEffect(() => {
    fetchPopular();
    fetchUnread();
    const timer = setInterval(() => setBannerIdx(i => (i + 1) % BANNERS.length), 3500);
    return () => clearInterval(timer);
  }, []);

  const fetchPopular = async () => {
    try {
      const data = await CoursesAPI.getPopular();
      setPopular(Array.isArray(data) ? data.slice(0, 4) : data.results?.slice(0, 4) || []);
    } catch (_) {} finally { setLoadingCourses(false); }
  };

  const fetchUnread = async () => {
    try {
      const data = await NotificationsAPI.getUnreadCount();
      setUnreadCount(data.unread_count || 0);
    } catch (_) {}
  };

  return (
    <View style={styles.root}>
      <Header
        title="SWAYAM"
        onMenuPress={() => setMenuVisible(true)}
        navigation={navigation}
        unreadCount={unreadCount}
      />
      <SideMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        navigation={navigation}
      />

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Banner ── */}
        <FlatList
          horizontal pagingEnabled
          showsHorizontalScrollIndicator={false}
          data={BANNERS}
          keyExtractor={(_, i) => String(i)}
          onMomentumScrollEnd={e =>
            setBannerIdx(Math.round(e.nativeEvent.contentOffset.x / width))
          }
          renderItem={({ item }) => (
            <View style={[styles.banner, { backgroundColor: item.bg }]}>
              <Text style={styles.bannerEmoji}>{item.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.bannerTitle}>{item.title}</Text>
                <Text style={styles.bannerHighlight}>{item.highlight}</Text>
                <Text style={styles.bannerUser}>
                  Welcome, {user?.full_name?.split(' ')[0] || 'Learner'} 👋
                </Text>
              </View>
            </View>
          )}
        />
        {/* Dots */}
        <View style={styles.dotsRow}>
          {BANNERS.map((_, i) => (
            <View key={i} style={[styles.dot, i === bannerIdx && styles.dotActive]} />
          ))}
        </View>

        {/* ── Stats Strip ── */}
        <View style={styles.statsStrip}>
          {[['52.1L+','Enrollments'],['3,200+','Courses'],['12.6L+','Exam Regs']].map(([v,l],i) => (
            <View key={l} style={[styles.statItem, i < 2 && styles.statBorder]}>
              <Text style={styles.statVal}>{v}</Text>
              <Text style={styles.statLbl}>{l}</Text>
            </View>
          ))}
        </View>

        {/* ── Search ── */}
        <View style={styles.searchWrap}>
          <Ionicons name="search-outline" size={18} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search courses…"
            placeholderTextColor={COLORS.textMuted}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
            onSubmitEditing={() =>
              search.trim() && navigation.navigate('CourseCatalog', { query: search.trim() })
            }
          />
        </View>

        {/* ── Catalog CTA ── */}
        <TouchableOpacity
          style={styles.catalogBtn}
          onPress={() => navigation.navigate('CourseCatalog')}
        >
          <Ionicons name="list-outline" size={20} color="#fff" />
          <Text style={styles.catalogBtnText}>Explore Course Catalog</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>

        {/* ── Quick Access Grid ── */}
        <Text style={styles.sectionTitle}>Quick Access</Text>
        <View style={styles.quickGrid}>
          {QUICK.map(q => (
            <TouchableOpacity
              key={q.screen}
              style={[styles.quickItem, { backgroundColor: q.bg }]}
              onPress={() => navigation.navigate(q.screen)}
            >
              <View style={[styles.quickIconWrap, { backgroundColor: q.color + '22' }]}>
                <Ionicons name={q.icon} size={22} color={q.color} />
              </View>
              <Text style={[styles.quickText, { color: q.color }]}>{q.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Popular Courses ── */}
        <View style={styles.rowHeader}>
          <Text style={styles.sectionTitle2}>🔥 Popular Courses</Text>
          <TouchableOpacity onPress={() => navigation.navigate('CourseCatalog')}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.padH}>
          {loadingCourses
            ? <ActivityIndicator color={COLORS.primary} style={{ marginTop: 20 }} />
            : popular.map(c => (
                <CourseCard
                  key={c.id}
                  course={c}
                  onPress={() => navigation.navigate('CourseDetail', { courseId: c.id })}
                />
              ))
          }
        </View>

        {/* ── Learn Banner ── */}
        <View style={styles.learnBanner}>
          <Text style={styles.learnTitle}>Learn Anytime, Anywhere! 🚀</Text>
          <Text style={styles.learnSub}>
            Free courses from India's top educators. Certificates recognized by universities.
          </Text>
          <TouchableOpacity
            style={styles.learnBtn}
            onPress={() => navigation.navigate('CourseCatalog')}
          >
            <Text style={styles.learnBtnText}>Start Learning →</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },

  banner: {
    width, height: 180, flexDirection: 'row',
    alignItems: 'center', padding: 22, gap: 14,
  },
  bannerEmoji:    { fontSize: 50 },
  bannerTitle:    { color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: '500' },
  bannerHighlight:{ color: '#fff', fontSize: 22, fontWeight: '800', lineHeight: 27, marginTop: 2 },
  bannerUser:     { color: 'rgba(255,255,255,0.75)', fontSize: 11, marginTop: 8,
                    backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 10,
                    paddingVertical: 3, borderRadius: 99, alignSelf: 'flex-start' },

  dotsRow:    { flexDirection: 'row', justifyContent: 'center', gap: 6, paddingVertical: 10 },
  dot:        { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.border },
  dotActive:  { width: 20, backgroundColor: COLORS.primary, borderRadius: 3 },

  statsStrip: {
    flexDirection: 'row', marginHorizontal: 16,
    backgroundColor: COLORS.primaryDark,
    borderRadius: RADIUS.lg, paddingVertical: 14, ...SHADOW.md,
  },
  statItem:   { flex: 1, alignItems: 'center' },
  statBorder: { borderRightWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  statVal:    { color: '#fff', fontSize: 16, fontWeight: '800' },
  statLbl:    { color: 'rgba(255,255,255,0.65)', fontSize: 9, marginTop: 2 },

  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: RADIUS.md,
    margin: 16, marginBottom: 10,
    paddingHorizontal: 14, height: 48,
    gap: 10, borderWidth: 1, borderColor: COLORS.border, ...SHADOW.sm,
  },
  searchInput: { flex: 1, fontSize: 14, color: COLORS.text },

  catalogBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.primary, marginHorizontal: 16,
    borderRadius: RADIUS.md, height: 50, gap: 10, ...SHADOW.md,
  },
  catalogBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },

  sectionTitle: { fontSize: 15, fontWeight: '800', color: COLORS.text, marginHorizontal: 16, marginTop: 20, marginBottom: 12 },
  rowHeader:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 16, marginTop: 20, marginBottom: 12 },
  sectionTitle2:{ fontSize: 15, fontWeight: '800', color: COLORS.text },
  seeAll:       { backgroundColor: '#E3F2FD', color: COLORS.primary, fontSize: 12, fontWeight: '700', paddingHorizontal: 12, paddingVertical: 4, borderRadius: RADIUS.full },

  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 10 },
  quickItem: { width: '22%', alignItems: 'center', padding: 10, borderRadius: RADIUS.md, gap: 6, borderWidth: 1, borderColor: 'rgba(0,0,0,0.04)' },
  quickIconWrap: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  quickText: { fontSize: 9, fontWeight: '700', textAlign: 'center', lineHeight: 13 },

  padH: { paddingHorizontal: 16 },

  learnBanner: {
    backgroundColor: COLORS.primaryDark, margin: 16,
    borderRadius: RADIUS.xl, padding: 22, ...SHADOW.lg,
  },
  learnTitle: { color: '#fff', fontSize: 18, fontWeight: '800', marginBottom: 8 },
  learnSub:   { color: 'rgba(255,255,255,0.72)', fontSize: 12, lineHeight: 18, marginBottom: 16 },
  learnBtn:   { backgroundColor: COLORS.accentLight, borderRadius: RADIUS.md, paddingVertical: 11, paddingHorizontal: 20, alignSelf: 'flex-start' },
  learnBtnText:{ color: COLORS.text, fontWeight: '800', fontSize: 13 },
});