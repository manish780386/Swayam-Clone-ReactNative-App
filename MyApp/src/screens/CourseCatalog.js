import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, TextInput, ScrollView, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header    from '../components/Header';
import SideMenu  from '../components/SideMenu';
import CourseCard from '../components/CourseCard';
import { CoursesAPI } from '../api/apiService';
import { COLORS, RADIUS, SHADOW } from '../styles/theme';

const LEVELS = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];

export default function CourseCatalog({ route, navigation }) {
  const initQuery = route?.params?.query || '';

  const [menuVisible, setMenuVisible] = useState(false);
  const [courses,     setCourses]     = useState([]);
  const [categories,  setCategories]  = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState(initQuery);
  const [selCat,      setSelCat]      = useState('');
  const [selLevel,    setSelLevel]    = useState('All Levels');

  useEffect(() => {
    fetchCategories();
    fetchCourses();
  }, []);

  // Re-fetch when filters change
  useEffect(() => {
    fetchCourses();
  }, [selCat, selLevel]);

  const fetchCategories = async () => {
    try {
      const data = await CoursesAPI.getCategories();
      setCategories(Array.isArray(data) ? data : data.results || []);
    } catch (_) {}
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selCat)                   params.category = selCat;
      if (selLevel !== 'All Levels') params.level    = selLevel;
      if (search.trim())             params.search   = search.trim();

      const data = await CoursesAPI.getAll(params);
      setCourses(Array.isArray(data) ? data : data.results || []);
    } catch (_) {}
    setLoading(false);
  };

  const handleSearch = () => fetchCourses();

  const clearFilters = () => {
    setSearch('');
    setSelCat('');
    setSelLevel('All Levels');
  };

  const hasFilters = search || selCat || selLevel !== 'All Levels';

  return (
    <View style={styles.root}>
      <Header
        title="Course Catalog"
        onMenuPress={() => setMenuVisible(true)}
        navigation={navigation}
      />
      <SideMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        navigation={navigation}
      />

      {/* Search Bar */}
      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={18} color={COLORS.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search courses, instructors…"
          placeholderTextColor={COLORS.textMuted}
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => { setSearch(''); fetchCourses(); }}>
            <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipScroll}
        contentContainerStyle={styles.chipContent}
      >
        <TouchableOpacity
          onPress={() => setSelCat('')}
          style={[styles.chip, selCat === '' && styles.chipActive]}
        >
          <Text style={[styles.chipText, selCat === '' && styles.chipTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        {categories.map(cat => (
          <TouchableOpacity
            key={cat.id}
            onPress={() => setSelCat(cat.slug)}
            style={[
              styles.chip,
              selCat === cat.slug && { backgroundColor: cat.color, borderColor: cat.color },
            ]}
          >
            <Text style={{ fontSize: 13 }}>{cat.icon}</Text>
            <Text style={[
              styles.chipText,
              selCat === cat.slug && styles.chipTextActive,
            ]}>
              {cat.name.split(' ')[0]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Level Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.levelScroll}
        contentContainerStyle={styles.chipContent}
      >
        {LEVELS.map(l => (
          <TouchableOpacity
            key={l}
            onPress={() => setSelLevel(l)}
            style={[styles.levelChip, selLevel === l && styles.levelChipActive]}
          >
            <Text style={[styles.levelChipText, selLevel === l && styles.levelChipTextActive]}>
              {l}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Result info row */}
      <View style={styles.resultRow}>
        <Text style={styles.resultText}>
          {loading ? 'Loading…' : `${courses.length} courses found`}
        </Text>
        {hasFilters && (
          <TouchableOpacity onPress={clearFilters}>
            <Text style={styles.clearText}>Clear filters</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Course List */}
      {loading ? (
        <ActivityIndicator color={COLORS.primary} style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={courses}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={{ fontSize: 44 }}>🔍</Text>
              <Text style={styles.emptyTitle}>No courses found</Text>
              <Text style={styles.emptySub}>Try different keywords or filters</Text>
            </View>
          }
          renderItem={({ item }) => (
            <CourseCard
              course={item}
              onPress={() => navigation.navigate('CourseDetail', { courseId: item.id })}
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

  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.white, margin: 16, marginBottom: 8,
    borderRadius: RADIUS.md, paddingHorizontal: 14,
    height: 48, gap: 10,
    borderWidth: 1, borderColor: COLORS.border, ...SHADOW.sm,
  },
  searchInput: { flex: 1, fontSize: 14, color: COLORS.text },

  chipScroll:   { maxHeight: 44 },
  levelScroll:  { maxHeight: 40, marginTop: 6 },
  chipContent:  { paddingHorizontal: 16, gap: 8, alignItems: 'center' },

  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.white,
    borderWidth: 1, borderColor: COLORS.border,
  },
  chipActive:     { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText:       { fontSize: 12, fontWeight: '600', color: COLORS.textSec },
  chipTextActive: { color: COLORS.white },

  levelChip: {
    paddingHorizontal: 14, paddingVertical: 5,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.bg,
    borderWidth: 1, borderColor: COLORS.border,
  },
  levelChipActive:     { backgroundColor: COLORS.primaryBg, borderColor: COLORS.primary },
  levelChipText:       { fontSize: 11, fontWeight: '600', color: COLORS.textSec },
  levelChipTextActive: { color: COLORS.primary },

  resultRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8,
  },
  resultText: { fontSize: 13, color: COLORS.textSec, fontWeight: '600' },
  clearText:  { fontSize: 12, color: COLORS.primary, fontWeight: '700' },

  list: { paddingHorizontal: 16 },

  empty: { alignItems: 'center', paddingTop: 60, gap: 10 },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: COLORS.text },
  emptySub:   { fontSize: 13, color: COLORS.textMuted },
});