import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header    from '../components/Header';
import SideMenu  from '../components/SideMenu';
import CourseCard from '../components/CourseCard';
import { CoursesAPI } from '../api/apiService';
import { COLORS, RADIUS, SHADOW } from '../styles/theme';

export default function Categories({ navigation }) {
  const [menuVisible,  setMenuVisible]  = useState(false);
  const [categories,   setCategories]   = useState([]);
  const [selected,     setSelected]     = useState(null);
  const [catCourses,   setCatCourses]   = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(false);

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      const data = await CoursesAPI.getCategories();
      setCategories(Array.isArray(data) ? data : data.results || []);
    } catch (_) {}
    setLoading(false);
  };

  const handleSelectCategory = async (cat) => {
    setSelected(cat);
    setLoadingCourses(true);
    try {
      const data = await CoursesAPI.getByCategory(cat.slug);
      setCatCourses(Array.isArray(data) ? data : data.results || []);
    } catch (_) { setCatCourses([]); }
    setLoadingCourses(false);
  };

  // Category detail view
  if (selected) {
    return (
      <View style={styles.root}>
        <Header title={selected.name} showBack navigation={navigation} />
        <SideMenu visible={menuVisible} onClose={() => setMenuVisible(false)} navigation={navigation} />

        {/* Cat Hero */}
        <View style={[styles.catHero, { backgroundColor: selected.color }]}>
          <TouchableOpacity
            onPress={() => setSelected(null)}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={16} color="#fff" />
            <Text style={styles.backBtnText}>All Categories</Text>
          </TouchableOpacity>
          <View style={styles.catHeroContent}>
            <Text style={styles.catHeroIcon}>{selected.icon}</Text>
            <View>
              <Text style={styles.catHeroTitle}>{selected.name}</Text>
              <Text style={styles.catHeroCount}>
                {selected.course_count || catCourses.length} courses available
              </Text>
            </View>
          </View>
        </View>

        {loadingCourses ? (
          <ActivityIndicator color={COLORS.primary} style={{ flex: 1 }} />
        ) : catCourses.length > 0 ? (
          <FlatList
            data={catCourses}
            keyExtractor={item => String(item.id)}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <CourseCard
                course={item}
                onPress={() => navigation.navigate('CourseDetail', { courseId: item.id })}
              />
            )}
            ListFooterComponent={<View style={{ height: 30 }} />}
          />
        ) : (
          <View style={styles.empty}>
            <Text style={{ fontSize: 44 }}>🔍</Text>
            <Text style={styles.emptyTitle}>No courses yet in this category</Text>
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={() => navigation.navigate('CourseCatalog')}
            >
              <Text style={styles.emptyBtnText}>Browse Full Catalog</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  // Categories grid view
  return (
    <View style={styles.root}>
      <Header
        title="Categories"
        onMenuPress={() => setMenuVisible(true)}
        navigation={navigation}
      />
      <SideMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        navigation={navigation}
      />

      <View style={styles.headerArea}>
        <Text style={styles.pageTitle}>Browse by Category</Text>
        <Text style={styles.pageSub}>Explore 3,200+ courses across all disciplines</Text>
      </View>

      {loading ? (
        <ActivityIndicator color={COLORS.primary} style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={categories}
          keyExtractor={item => String(item.id)}
          numColumns={3}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={{ gap: 10 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.catCard,
                { backgroundColor: item.bg_color, borderColor: item.color + '30' },
              ]}
              onPress={() => handleSelectCategory(item)}
              activeOpacity={0.82}
            >
              <View style={[styles.catIconWrap, { backgroundColor: item.color + '20' }]}>
                <Text style={styles.catIcon}>{item.icon}</Text>
              </View>
              <Text style={[styles.catLabel, { color: item.color }]} numberOfLines={2}>
                {item.name}
              </Text>
              <Text style={styles.catCount}>{item.course_count} courses</Text>
            </TouchableOpacity>
          )}
          ListFooterComponent={<View style={{ height: 30 }} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },

  headerArea: { padding: 20, paddingBottom: 8 },
  pageTitle:  { fontSize: 22, fontWeight: '800', color: COLORS.text },
  pageSub:    { fontSize: 13, color: COLORS.textSec, marginTop: 4 },

  grid: { paddingHorizontal: 12, paddingTop: 4, gap: 10 },
  catCard: {
    flex: 1, padding: 12, borderRadius: RADIUS.lg,
    alignItems: 'center', borderWidth: 1, ...SHADOW.sm,
  },
  catIconWrap: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  catIcon:     { fontSize: 26 },
  catLabel:    { fontSize: 10, fontWeight: '800', textAlign: 'center', lineHeight: 14, marginBottom: 4 },
  catCount:    { fontSize: 9, color: COLORS.textMuted },

  catHero: { padding: 20, paddingBottom: 24 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  backBtnText: { color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: '600' },
  catHeroContent: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  catHeroIcon:    { fontSize: 44 },
  catHeroTitle:   { color: '#fff', fontSize: 18, fontWeight: '800' },
  catHeroCount:   { color: 'rgba(255,255,255,0.75)', fontSize: 12, marginTop: 4 },

  list: { padding: 16 },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 40 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, textAlign: 'center' },
  emptyBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.md, paddingVertical: 12, paddingHorizontal: 24 },
  emptyBtnText: { color: '#fff', fontWeight: '700' },
});