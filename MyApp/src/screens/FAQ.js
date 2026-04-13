import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, LayoutAnimation, Platform, UIManager,
} from 'react-native';
import Header   from '../components/Header';
import SideMenu from '../components/SideMenu';
import { COLORS, RADIUS, SHADOW } from '../styles/theme';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const FAQ_DATA = [
  { q: 'What is SWAYAM?', a: 'SWAYAM is India\'s national online education platform offering free courses from Class 9 to postgraduate level, taught by top faculty from IITs, IIMs, central universities, and other premier institutions.' },
  { q: 'Are SWAYAM courses free?', a: 'Yes! All SWAYAM courses are completely free to enroll and access. You only pay a nominal fee (₹500–₹1000) if you wish to appear for the proctored exam and earn a verified certificate.' },
  { q: 'How do I earn a certificate?', a: 'Complete course assignments and quizzes online, then register and appear for the proctored end-term exam at a designated centre. Score 40% or above to earn your certificate.' },
  { q: 'Are certificates recognized by universities?', a: 'Yes. SWAYAM certificates are credit-linked. UGC has allowed universities to transfer up to 40% of credits from SWAYAM to a student\'s degree program. Many employers also recognize NPTEL & SWAYAM certificates.' },
  { q: 'What are the grade categories?', a: 'Elite + Gold: 90%+, Elite: 75–89%, Silver: 60–74%, Pass: 40–59%. Grades are based on your proctored exam performance and online assignment scores combined.' },
  { q: 'How many credits can I earn?', a: 'Each SWAYAM course carries 2–5 academic credits depending on duration. You can transfer a maximum of 40% credits toward your university degree as per UGC guidelines.' },
  { q: 'Can I access course content offline?', a: 'Video lectures can be downloaded via the SWAYAM app for offline viewing. Assignments and discussion forums require an internet connection.' },
  { q: 'Who are National Coordinators?', a: 'National Coordinators are institutions responsible for specific course categories: NPTEL (Engineering), UGC (Post-Graduate), CEC (Under-Graduate), NIOS (School), IGNOU (Distance Ed), AICTE (Technical), IIMB (Management).' },
];

export default function FAQ({ navigation }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [openIndex,   setOpenIndex]   = useState(null);

  const toggle = (i) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <View style={styles.root}>
      <Header title="FAQ" onMenuPress={() => setMenuVisible(true)} navigation={navigation} />
      <SideMenu visible={menuVisible} onClose={() => setMenuVisible(false)} navigation={navigation} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.headerArea}>
          <Text style={{ fontSize: 40, marginBottom: 8 }}>❓</Text>
          <Text style={styles.pageTitle}>Frequently Asked Questions</Text>
          <Text style={styles.pageSub}>Everything you need to know about SWAYAM</Text>
        </View>

        {FAQ_DATA.map((item, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.card, openIndex === i && styles.cardOpen]}
            onPress={() => toggle(i)}
            activeOpacity={0.88}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.qNum, openIndex === i && styles.qNumActive]}>
                <Text style={[styles.qNumText, openIndex === i && styles.qNumTextActive]}>
                  Q{i + 1}
                </Text>
              </View>
              <Text style={styles.qText}>{item.q}</Text>
              <Text style={{ color: openIndex === i ? COLORS.primary : COLORS.textMuted, fontSize: 18 }}>
                {openIndex === i ? '−' : '+'}
              </Text>
            </View>
            {openIndex === i && (
              <View style={styles.answer}>
                <View style={styles.answerLine} />
                <Text style={styles.answerText}>{item.a}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:       { flex: 1, backgroundColor: COLORS.bg },
  scroll:     { padding: 16 },
  headerArea: { alignItems: 'center', marginBottom: 20, paddingVertical: 10 },
  pageTitle:  { fontSize: 20, fontWeight: '800', color: COLORS.text },
  pageSub:    { fontSize: 13, color: COLORS.textSec, marginTop: 4, textAlign: 'center' },

  card: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.lg,
    marginBottom: 10, borderWidth: 1, borderColor: COLORS.border,
    overflow: 'hidden', ...SHADOW.sm,
  },
  cardOpen:   { borderColor: COLORS.primary + '60' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },

  qNum:      { width: 30, height: 30, borderRadius: 8, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  qNumActive:{ backgroundColor: COLORS.primary },
  qNumText:      { fontSize: 10, fontWeight: '800', color: COLORS.textSec },
  qNumTextActive:{ color: COLORS.white },
  qText:     { flex: 1, fontSize: 13, fontWeight: '700', color: COLORS.text, lineHeight: 19 },

  answer:     { flexDirection: 'row', gap: 12, paddingHorizontal: 14, paddingBottom: 14 },
  answerLine: { width: 3, backgroundColor: COLORS.primary, borderRadius: 2, flexShrink: 0 },
  answerText: { flex: 1, fontSize: 13, color: COLORS.textSec, lineHeight: 21 },
});