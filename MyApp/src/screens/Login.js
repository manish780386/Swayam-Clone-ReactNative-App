import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, KeyboardAvoidingView,
  Platform, StatusBar, Alert, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { COLORS, RADIUS, SHADOW } from '../styles/theme';

export default function Login({ navigation }) {
  const { login } = useAuth();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Error', 'Please enter email and password.');
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigation.replace('Home');
    } catch (err) {
      const msg = err?.detail || err?.non_field_errors?.[0] || 'Login failed. Check credentials.';
      Alert.alert('Login Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar backgroundColor={COLORS.primaryDark} barStyle="light-content" />

      {/* Top Brand */}
      <View style={styles.top}>
        <View style={styles.logoCircle}>
          <Text style={{ fontSize: 36 }}>🎓</Text>
        </View>
        <Text style={styles.brandName}>SWAYAM</Text>
        <Text style={styles.brandSub}>
          Study Webs of Active-Learning{'\n'}for Young Aspiring Minds
        </Text>
        <View style={styles.statsRow}>
          {[['52L+','Enrollments'],['3200+','Courses'],['200+','Institutions']].map(([v,l]) => (
            <View key={l} style={styles.statItem}>
              <Text style={styles.statVal}>{v}</Text>
              <Text style={styles.statLbl}>{l}</Text>
            </View>
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome Back 👋</Text>
          <Text style={styles.cardSub}>Sign in to continue learning</Text>

          {/* Email */}
          <View style={styles.inputWrap}>
            <Ionicons name="mail-outline" size={18} color={COLORS.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor={COLORS.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password */}
          <View style={styles.inputWrap}>
            <Ionicons name="lock-closed-outline" size={18} color={COLORS.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={COLORS.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPass}
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)} style={{ padding: 4 }}>
              <Ionicons name={showPass ? 'eye-outline' : 'eye-off-outline'} size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading} activeOpacity={0.85}>
            {loading
              ? <ActivityIndicator color="#fff" />
              : <>
                  <Ionicons name="log-in-outline" size={20} color="#fff" />
                  <Text style={styles.loginBtnText}>Sign In</Text>
                </>
            }
          </TouchableOpacity>

          {/* Register Link */}
          <View style={styles.registerRow}>
            <Text style={styles.registerText}>New to SWAYAM? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}>Create Account</Text>
            </TouchableOpacity>
          </View>

          {/* Demo hint */}
          <View style={styles.demoBox}>
            <Text style={styles.demoText}>
              🔑 Demo: manish@swayam.in / swayam123
            </Text>
          </View>
        </View>

        <Text style={styles.footer}>
          Government of India Initiative · Free Higher Education
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: COLORS.primaryDark },
  top:    { alignItems: 'center', paddingTop: 52, paddingBottom: 24, paddingHorizontal: 20 },
  logoCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.25)',
  },
  brandName: { color: '#fff', fontSize: 28, fontWeight: '800', letterSpacing: 3 },
  brandSub:  { color: 'rgba(255,255,255,0.7)', fontSize: 11, textAlign: 'center', marginTop: 6, lineHeight: 17 },
  statsRow:  {
    flexDirection: 'row', alignItems: 'center',
    marginTop: 18, backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: RADIUS.lg, padding: 12,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statVal:  { color: '#fff', fontSize: 17, fontWeight: '800' },
  statLbl:  { color: 'rgba(255,255,255,0.65)', fontSize: 9, marginTop: 2 },

  scroll: { flexGrow: 1, padding: 20, paddingBottom: 30 },
  card:   { backgroundColor: '#fff', borderRadius: RADIUS.xl, padding: 24, ...SHADOW.lg },
  cardTitle: { fontSize: 22, fontWeight: '800', color: COLORS.text, marginBottom: 4 },
  cardSub:   { fontSize: 13, color: COLORS.textSec, marginBottom: 22 },

  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.bg, borderRadius: RADIUS.md,
    marginBottom: 12, paddingHorizontal: 14,
    borderWidth: 1, borderColor: COLORS.border, height: 50,
  },
  inputIcon: { marginRight: 10 },
  input:     { flex: 1, fontSize: 14, color: COLORS.text },

  loginBtn: {
    backgroundColor: COLORS.primaryDark, borderRadius: RADIUS.md,
    height: 50, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 8, marginTop: 4, ...SHADOW.md,
  },
  loginBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },

  registerRow:  { flexDirection: 'row', justifyContent: 'center', marginTop: 18 },
  registerText: { fontSize: 13, color: COLORS.textSec },
  registerLink: { fontSize: 13, color: COLORS.primary, fontWeight: '700' },

  demoBox: {
    marginTop: 16, backgroundColor: COLORS.bg,
    borderRadius: RADIUS.md, padding: 10,
    borderWidth: 1, borderColor: COLORS.border,
  },
  demoText: { fontSize: 11, color: COLORS.textSec, textAlign: 'center' },
  footer:   { textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 10, marginTop: 20 },
});