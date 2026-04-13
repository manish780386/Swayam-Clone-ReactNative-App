import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header   from '../components/Header';
import SideMenu from '../components/SideMenu';
import { CertificationsAPI } from '../api/apiService';
import { COLORS, RADIUS, SHADOW } from '../styles/theme';

const GRADE_CONFIG = {
  'Elite + Gold': { bg: '#FFF8E1', color: '#F57F17', icon: '🥇', border: '#FFD54F' },
  'Elite':        { bg: '#E3F2FD', color: '#0D47A1', icon: '🏅', border: '#90CAF9' },
  'Silver':       { bg: '#F5F5F5', color: '#546E7A', icon: '🥈', border: '#B0BEC5' },
  'Pass':         { bg: '#E8F5E9', color: '#2E7D32', icon: '✅', border: '#A5D6A7' },
};

export default function Certifications({ navigation }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [certs,       setCerts]       = useState([]);
  const [summary,     setSummary]     = useState(null);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [certsData, summaryData] = await Promise.all([
        CertificationsAPI.getAll(),
        CertificationsAPI.getSummary(),
      ]);
      setCerts(Array.isArray(certsData) ? certsData : certsData.results || []);
      setSummary(summaryData);
    } catch (_) {}
    setLoading(false);
  };

  return (
    <View style={styles.root}>
      <Header
        title="My Certifications"
        onMenuPress={() => setMenuVisible(true)}
        navigation={navigation}
      />
      <SideMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        navigation={navigation}
      />

      {loading ? (
        <ActivityIndicator color={COLORS.primary} style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={certs}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.summaryCard}>
              <View style={styles.summaryTop}>
                <Text style={{ fontSize: 36 }}>🎓</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.summaryTitle}>
                    {summary?.total || certs.length} Certificate{certs.length !== 1 ? 's' : ''} Earned
                  </Text>
                  <Text style={styles.summaryAvg}>
                    Avg Score: {summary?.avg_score || 0}%
                  </Text>
                </View>
              </View>
              <View style={styles.summaryRow}>
                {[
                  { val: summary?.elite_gold || 0, lbl: 'Elite + Gold', color: '#F57F17' },
                  { val: summary?.elite || 0,      lbl: 'Elite',        color: '#0D47A1' },
                  { val: summary?.silver || 0,      lbl: 'Silver',       color: '#546E7A' },
                ].map(s => (
                  <View key={s.lbl} style={styles.summaryItem}>
                    <Text style={[styles.summaryVal, { color: s.color }]}>{s.val}</Text>
                    <Text style={styles.summaryLbl}>{s.lbl}</Text>
                  </View>
                ))}
              </View>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={{ fontSize: 44 }}>🏅</Text>
              <Text style={styles.emptyTitle}>No certificates yet</Text>
              <Text style={styles.emptySub}>
                Complete a course and appear for the exam to earn certificates
              </Text>
              <TouchableOpacity
                style={styles.emptyBtn}
                onPress={() => navigation.navigate('CourseCatalog')}
              >
                <Text style={styles.emptyBtnText}>Browse Courses</Text>
              </TouchableOpacity>
            </View>
          }
          renderItem={({ item }) => {
            const gc = GRADE_CONFIG[item.grade] || GRADE_CONFIG['Pass'];
            return (
              <View style={[styles.certCard, { borderColor: gc.border }]}>
                {/* Header */}
                <View style={[styles.certHeader, { backgroundColor: item.course?.color || COLORS.primary }]}>
                  <Text style={{ fontSize: 28 }}>{item.course?.icon || '📚'}</Text>
                  <View style={styles.certHeaderText}>
                    <Text style={styles.certTitle} numberOfLines={1}>
                      {item.course?.title}
                    </Text>
                    <Text style={styles.certInst}>
                      {item.course?.institution_name}
                    </Text>
                  </View>
                  <View style={[styles.gradeBadge, { backgroundColor: gc.bg }]}>
                    <Text style={{ fontSize: 12 }}>{gc.icon}</Text>
                    <Text style={[styles.gradeText, { color: gc.color }]}>{item.grade}</Text>
                  </View>
                </View>

                {/* Body */}
                <View style={styles.certBody}>
                  <View style={styles.certMetaRow}>
                    <View style={styles.certMetaItem}>
                      <Ionicons name="calendar-outline" size={13} color={COLORS.textMuted} />
                      <Text style={styles.certMetaText}>
                        {new Date(item.issued_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </Text>
                    </View>
                    <Text style={[
                      styles.scoreText,
                      { color: item.score >= 90 ? COLORS.success : item.score >= 75 ? COLORS.primary : COLORS.textSec },
                    ]}>
                      Score: {item.score}%
                    </Text>
                  </View>

                  {/* Score bar */}
                  <View style={styles.scoreBarBg}>
                    <View style={[
                      styles.scoreBarFill,
                      { width: `${item.score}%`, backgroundColor: item.course?.color || COLORS.primary },
                    ]} />
                  </View>

                  <Text style={styles.certNum}>Cert No: {item.cert_number}</Text>

                  {/* Actions */}
                  <View style={styles.certActions}>
                    <TouchableOpacity
                      style={styles.downloadBtn}
                      onPress={() => Alert.alert('Download', 'Certificate download started!')}
                    >
                      <Ionicons name="download-outline" size={15} color={COLORS.primary} />
                      <Text style={styles.downloadBtnText}>Download</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.shareBtn}
                      onPress={() => Alert.alert('Share', 'Sharing certificate...')}
                    >
                      <Ionicons name="share-outline" size={15} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          }}
          ListFooterComponent={<View style={{ height: 30 }} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  list: { padding: 16 },

  summaryCard: {
    backgroundColor: COLORS.primaryDark, borderRadius: RADIUS.xl,
    padding: 20, marginBottom: 20, ...SHADOW.lg,
  },
  summaryTop:    { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 },
  summaryTitle:  { color: '#fff', fontSize: 18, fontWeight: '800' },
  summaryAvg:    { color: '#90CAF9', fontSize: 12, marginTop: 4 },
  summaryRow:    { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: RADIUS.md, paddingVertical: 12 },
  summaryItem:   { flex: 1, alignItems: 'center' },
  summaryVal:    { fontSize: 20, fontWeight: '800' },
  summaryLbl:    { color: 'rgba(255,255,255,0.65)', fontSize: 9, marginTop: 2 },

  certCard: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.lg,
    overflow: 'hidden', marginBottom: 16,
    borderWidth: 1.5, ...SHADOW.md,
  },
  certHeader: {
    flexDirection: 'row', alignItems: 'center',
    padding: 16, gap: 12,
  },
  certHeaderText: { flex: 1 },
  certTitle:  { color: '#fff', fontSize: 13, fontWeight: '700' },
  certInst:   { color: 'rgba(255,255,255,0.75)', fontSize: 11, marginTop: 2 },
  gradeBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: RADIUS.full },
  gradeText:  { fontSize: 9, fontWeight: '800' },

  certBody:      { padding: 14 },
  certMetaRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  certMetaItem:  { flexDirection: 'row', alignItems: 'center', gap: 5 },
  certMetaText:  { fontSize: 12, color: COLORS.textSec },
  scoreText:     { fontSize: 12, fontWeight: '700' },
  scoreBarBg:    { height: 6, backgroundColor: COLORS.border, borderRadius: RADIUS.full, overflow: 'hidden', marginBottom: 10 },
  scoreBarFill:  { height: '100%', borderRadius: RADIUS.full },
  certNum:       { fontSize: 10, color: COLORS.textMuted, marginBottom: 12 },

  certActions:   { flexDirection: 'row', gap: 10 },
  downloadBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, height: 40, backgroundColor: COLORS.primaryBg,
    borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border,
  },
  downloadBtnText: { color: COLORS.primary, fontSize: 12, fontWeight: '700' },
  shareBtn: {
    width: 40, height: 40, backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center',
  },

  empty:      { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  emptySub:   { fontSize: 13, color: COLORS.textMuted, textAlign: 'center', lineHeight: 20 },
  emptyBtn:   { backgroundColor: COLORS.primary, borderRadius: RADIUS.md, paddingVertical: 12, paddingHorizontal: 24, marginTop: 8 },
  emptyBtnText: { color: '#fff', fontWeight: '700' },
});