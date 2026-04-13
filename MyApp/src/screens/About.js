import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header   from '../components/Header';
import SideMenu from '../components/SideMenu';
import { COLORS, RADIUS, SHADOW } from '../styles/theme';

const COORDINATORS = [
  { name: 'NPTEL',  full: 'National Programme on Technology Enhanced Learning', icon: '🎓', color: '#2E7D32', courses: 2100 },
  { name: 'UGC',    full: 'University Grants Commission',                        icon: '📚', color: '#1565C0', courses: 580  },
  { name: 'AICTE',  full: 'All India Council for Technical Education',           icon: '🏛️', color: '#BF360C', courses: 340  },
  { name: 'CEC',    full: 'Consortium for Educational Communication',            icon: '📡', color: '#6A1B9A', courses: 410  },
  { name: 'NIOS',   full: 'National Institute of Open Schooling',               icon: '🏫', color: '#E65100', courses: 180  },
  { name: 'IGNOU',  full: 'Indira Gandhi National Open University',             icon: '🌐', color: '#004D40', courses: 290  },
  { name: 'IIMB',   full: 'IIM Bangalore',                                      icon: '💼', color: '#880E4F', courses: 95   },
];

const QUICK_LINKS = [
  { label: 'Official Website',   url: 'https://swayam.gov.in',              icon: 'globe-outline'          },
  { label: 'UGC Guidelines',     url: 'https://ugc.ac.in',                  icon: 'document-text-outline'  },
  { label: 'NPTEL Courses',      url: 'https://nptel.ac.in',                icon: 'school-outline'         },
  { label: 'Contact Support',    url: 'mailto:support@swayam.gov.in',       icon: 'mail-outline'           },
];

export default function About({ navigation }) {
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View style={styles.root}>
      <Header title="About SWAYAM" onMenuPress={() => setMenuVisible(true)} navigation={navigation} />
      <SideMenu visible={menuVisible} onClose={() => setMenuVisible(false)} navigation={navigation} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={{ fontSize: 52, marginBottom: 12 }}>🎓</Text>
          <Text style={styles.heroTitle}>SWAYAM</Text>
          <Text style={styles.heroSub}>
            Study Webs of Active-Learning for{'\n'}Young Aspiring Minds
          </Text>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>🇮🇳 Government of India Initiative</Text>
          </View>
        </View>

        {/* About Text */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About the Platform</Text>
          <Text style={styles.body}>
            SWAYAM is India's national online education platform launched by the Ministry of
            Education, Government of India. It hosts over 3,200 courses from Class 9 through
            postgraduate level, delivered by faculty from premier institutions including IITs,
            IIMs, NITs, and central universities.
          </Text>
          <Text style={[styles.body, { marginTop: 10 }]}>
            The platform enables anyone, anywhere in India to access world-class education
            for free. Learners can earn credit-linked certificates recognized by universities
            and employers across the country.
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsGrid}>
          {[
            { val: '52L+',   lbl: 'Learners Enrolled',    icon: '👥' },
            { val: '3,200+', lbl: 'Courses Available',     icon: '📚' },
            { val: '12.6L+', lbl: 'Exam Registrations',   icon: '📝' },
            { val: '200+',   lbl: 'Partner Institutions',  icon: '🏛️' },
            { val: '40%',    lbl: 'Max Credit Transfer',   icon: '🎓' },
            { val: 'Free',   lbl: 'Course Access',         icon: '✨' },
          ].map((s, i) => (
            <View key={i} style={styles.statCard}>
              <Text style={{ fontSize: 22 }}>{s.icon}</Text>
              <Text style={styles.statVal}>{s.val}</Text>
              <Text style={styles.statLbl}>{s.lbl}</Text>
            </View>
          ))}
        </View>

        {/* National Coordinators */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>National Coordinators</Text>
          {COORDINATORS.map(nc => (
            <View key={nc.name} style={styles.coordRow}>
              <View style={[styles.coordIcon, { backgroundColor: nc.color + '18' }]}>
                <Text style={{ fontSize: 22 }}>{nc.icon}</Text>
              </View>
              <View style={styles.coordInfo}>
                <Text style={[styles.coordName, { color: nc.color }]}>{nc.name}</Text>
                <Text style={styles.coordFull}>{nc.full}</Text>
                <Text style={styles.coordCount}>{nc.courses} courses</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Quick Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Links</Text>
          <View style={styles.linksCard}>
            {QUICK_LINKS.map((link, i) => (
              <TouchableOpacity
                key={link.label}
                style={[styles.linkRow, i < QUICK_LINKS.length - 1 && styles.linkBorder]}
                onPress={() => Linking.openURL(link.url)}
              >
                <Ionicons name={link.icon} size={18} color={COLORS.primary} />
                <Text style={styles.linkLabel}>{link.label}</Text>
                <Ionicons name="open-outline" size={14} color={COLORS.textMuted} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text style={styles.versionText}>
          SWAYAM App v2.0 · © 2026 Ministry of Education, India
        </Text>
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },

  hero: { backgroundColor: COLORS.primaryDark, alignItems: 'center', paddingVertical: 36, paddingHorizontal: 20 },
  heroTitle: { color: '#fff', fontSize: 30, fontWeight: '800', letterSpacing: 2 },
  heroSub:   { color: 'rgba(255,255,255,0.7)', fontSize: 12, textAlign: 'center', marginTop: 6, lineHeight: 18 },
  heroBadge: { marginTop: 16, backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 14, paddingVertical: 6, borderRadius: RADIUS.full },
  heroBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },

  section:      { paddingHorizontal: 16, marginTop: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text, marginBottom: 12 },
  body:         { fontSize: 13, color: COLORS.textSec, lineHeight: 22 },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 12, gap: 10, marginTop: 8 },
  statCard:  { width: '30%', backgroundColor: COLORS.white, borderRadius: RADIUS.md, padding: 12, alignItems: 'center', gap: 4, borderWidth: 1, borderColor: COLORS.border, ...SHADOW.sm },
  statVal:   { fontSize: 16, fontWeight: '800', color: COLORS.primary },
  statLbl:   { fontSize: 9, color: COLORS.textMuted, textAlign: 'center' },

  coordRow:  { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: COLORS.white, borderRadius: RADIUS.md, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: COLORS.border, ...SHADOW.sm },
  coordIcon: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  coordInfo: { flex: 1 },
  coordName: { fontSize: 14, fontWeight: '800' },
  coordFull: { fontSize: 11, color: COLORS.textSec, marginTop: 2, lineHeight: 16 },
  coordCount:{ fontSize: 10, color: COLORS.textMuted, marginTop: 4 },

  linksCard: { backgroundColor: COLORS.white, borderRadius: RADIUS.lg, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border, ...SHADOW.sm },
  linkRow:   { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  linkBorder:{ borderBottomWidth: 1, borderColor: COLORS.border },
  linkLabel: { flex: 1, fontSize: 14, fontWeight: '500', color: COLORS.text },

  versionText: { textAlign: 'center', fontSize: 11, color: COLORS.textMuted, marginTop: 24, marginBottom: 4 },
});