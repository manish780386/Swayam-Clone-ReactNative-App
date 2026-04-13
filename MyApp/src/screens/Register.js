import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, KeyboardAvoidingView,
  Platform, StatusBar, Alert, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { COLORS, RADIUS, SHADOW } from '../styles/theme';

export default function Register({ navigation }) {
  const { register } = useAuth();

  const [fullName,  setFullName]  = useState('');
  const [email,     setEmail]     = useState('');
  const [mobile,    setMobile]    = useState('');
  const [password,  setPassword]  = useState('');
  const [password2, setPassword2] = useState('');
  const [showPass,  setShowPass]  = useState(false);
  const [loading,   setLoading]   = useState(false);

  const handleRegister = async () => {
    if (!fullName.trim() || !email.trim() || !password || !password2) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }
    if (password !== password2) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await register(fullName.trim(), email.trim(), mobile.trim(), password, password2);
      Alert.alert('Success 🎉', 'Account created successfully!', [
        { text: 'OK', onPress: () => navigation.replace('Home') },
      ]);
    } catch (err) {
      const firstError = Object.values(err)?.[0];
      const msg = Array.isArray(firstError) ? firstError[0] : (firstError || 'Registration failed.');
      Alert.alert('Registration Failed', msg);
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

      {/* Top */}
      <View style={styles.top}>
        <Text style={{ fontSize: 40, marginBottom: 8 }}>🎓</Text>
        <Text style={styles.brandName}>SWAYAM</Text>
        <Text style={styles.brandSub}>Create your free account</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Join SWAYAM 🚀</Text>
          <Text style={styles.cardSub}>
            Access 3,200+ free courses from IITs & IIMs
          </Text>

          {/* Full Name */}
          <Text style={styles.label}>Full Name *</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="person-outline" size={18} color={COLORS.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor={COLORS.textMuted}
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />
          </View>

          {/* Email */}
          <Text style={styles.label}>Email Address *</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="mail-outline" size={18} color={COLORS.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor={COLORS.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Mobile */}
          <Text style={styles.label}>Mobile Number</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="call-outline" size={18} color={COLORS.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="+91 9876543210 (optional)"
              placeholderTextColor={COLORS.textMuted}
              value={mobile}
              onChangeText={setMobile}
              keyboardType="phone-pad"
            />
          </View>

          {/* Password */}
          <Text style={styles.label}>Password *</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="lock-closed-outline" size={18} color={COLORS.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Minimum 6 characters"
              placeholderTextColor={COLORS.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPass}
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)} style={{ padding: 4 }}>
              <Ionicons
                name={showPass ? 'eye-outline' : 'eye-off-outline'}
                size={18} color={COLORS.textMuted}
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password */}
          <Text style={styles.label}>Confirm Password *</Text>
          <View style={[
            styles.inputWrap,
            password2 && password !== password2 && { borderColor: COLORS.error },
          ]}>
            <Ionicons name="shield-checkmark-outline" size={18} color={COLORS.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Re-enter your password"
              placeholderTextColor={COLORS.textMuted}
              value={password2}
              onChangeText={setPassword2}
              secureTextEntry={!showPass}
            />
            {password2.length > 0 && (
              <Ionicons
                name={password === password2 ? 'checkmark-circle' : 'close-circle'}
                size={18}
                color={password === password2 ? COLORS.success : COLORS.error}
              />
            )}
          </View>

          {/* Password mismatch warning */}
          {password2.length > 0 && password !== password2 && (
            <Text style={styles.errorText}>Passwords do not match</Text>
          )}

          {/* Register Button */}
          <TouchableOpacity
            style={[styles.regBtn, loading && { opacity: 0.7 }]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <>
                  <Ionicons name="person-add-outline" size={20} color="#fff" />
                  <Text style={styles.regBtnText}>Create Account</Text>
                </>
            }
          </TouchableOpacity>

          {/* Terms note */}
          <Text style={styles.terms}>
            By registering, you agree to SWAYAM's Terms of Service and Privacy Policy.
          </Text>

          {/* Login Link */}
          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.footer}>Government of India · Free Higher Education</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root:  { flex: 1, backgroundColor: COLORS.primaryDark },
  top:   { alignItems: 'center', paddingTop: 48, paddingBottom: 16 },
  brandName: { color: '#fff', fontSize: 24, fontWeight: '800', letterSpacing: 2 },
  brandSub:  { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 4 },

  scroll: { flexGrow: 1, padding: 20, paddingBottom: 30 },
  card:   { backgroundColor: '#fff', borderRadius: RADIUS.xl, padding: 22, ...SHADOW.lg },
  cardTitle: { fontSize: 22, fontWeight: '800', color: COLORS.text, marginBottom: 4 },
  cardSub:   { fontSize: 13, color: COLORS.textSec, marginBottom: 20 },

  label: { fontSize: 12, fontWeight: '700', color: COLORS.text, marginBottom: 6, marginTop: 4 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.bg, borderRadius: RADIUS.md,
    marginBottom: 10, paddingHorizontal: 14,
    borderWidth: 1, borderColor: COLORS.border, height: 50,
  },
  inputIcon: { marginRight: 10 },
  input:     { flex: 1, fontSize: 14, color: COLORS.text },
  errorText: { fontSize: 11, color: COLORS.error, marginTop: -6, marginBottom: 8, marginLeft: 4 },

  regBtn: {
    backgroundColor: COLORS.primaryDark, borderRadius: RADIUS.md,
    height: 52, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 8, marginTop: 10, ...SHADOW.md,
  },
  regBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },

  terms:    { fontSize: 10, color: COLORS.textMuted, textAlign: 'center', marginTop: 12, lineHeight: 15 },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  loginText:{ fontSize: 13, color: COLORS.textSec },
  loginLink:{ fontSize: 13, color: COLORS.primary, fontWeight: '700' },
  footer:   { textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 10, marginTop: 20 },
});