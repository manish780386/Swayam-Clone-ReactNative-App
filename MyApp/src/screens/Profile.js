import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Switch, Alert, TextInput,
  ActivityIndicator, Modal, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header   from '../components/Header';
import SideMenu from '../components/SideMenu';
import { useAuth } from '../context/AuthContext';
import { AuthAPI } from '../api/apiService';
import { COLORS, RADIUS, SHADOW } from '../styles/theme';

export default function Profile({ navigation }) {
  const { user, logout, updateUser } = useAuth();

  const [menuVisible,  setMenuVisible]  = useState(false);
  const [editModal,    setEditModal]    = useState(false);
  const [passModal,    setPassModal]    = useState(false);
  const [saving,       setSaving]       = useState(false);

  // Edit form state
  const [fullName,    setFullName]    = useState(user?.full_name || '');
  const [mobile,      setMobile]      = useState(user?.mobile || '');
  const [city,        setCity]        = useState(user?.city || '');
  const [institution, setInstitution] = useState(user?.institution || '');
  const [bio,         setBio]         = useState(user?.bio || '');

  // Change password state
  const [oldPass,  setOldPass]  = useState('');
  const [newPass,  setNewPass]  = useState('');
  const [newPass2, setNewPass2] = useState('');

  // Notification toggles
  const [notifPush,  setNotifPush]  = useState(user?.notif_push  ?? true);
  const [notifEmail, setNotifEmail] = useState(user?.notif_email ?? true);

  const initials = user?.full_name
    ? user.full_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const updated = await AuthAPI.updateProfile({
        full_name: fullName, mobile, city, institution, bio,
      });
      updateUser(updated);
      setEditModal(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (err) {
      Alert.alert('Error', 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleNotif = async (type, val) => {
    try {
      if (type === 'push') {
        setNotifPush(val);
        await AuthAPI.updateProfile({ notif_push: val });
        updateUser({ notif_push: val });
      } else {
        setNotifEmail(val);
        await AuthAPI.updateProfile({ notif_email: val });
        updateUser({ notif_email: val });
      }
    } catch (_) {}
  };

  const handleChangePassword = async () => {
    if (!oldPass || !newPass || !newPass2) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }
    if (newPass !== newPass2) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }
    if (newPass.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters.');
      return;
    }
    setSaving(true);
    try {
      await AuthAPI.changePassword(oldPass, newPass);
      setPassModal(false);
      setOldPass(''); setNewPass(''); setNewPass2('');
      Alert.alert('Success', 'Password changed successfully!');
    } catch (err) {
      const msg = err?.old_password?.[0] || err?.detail || 'Failed to change password.';
      Alert.alert('Error', msg);
    } finally {
      setSaving(false);
    }
  };

  const MENU_SECTIONS = [
    {
      title: 'Account',
      items: [
        { icon: 'create-outline',       label: 'Edit Profile',     action: () => setEditModal(true) },
        { icon: 'lock-closed-outline',  label: 'Change Password',  action: () => setPassModal(true) },
      ],
    },
    {
      title: 'Learning',
      items: [
        { icon: 'book-outline',    label: 'My Courses',       action: () => navigation.navigate('MyCourses')     },
        { icon: 'ribbon-outline',  label: 'My Certifications',action: () => navigation.navigate('Certifications')},
        { icon: 'list-outline',    label: 'Course Catalog',   action: () => navigation.navigate('CourseCatalog') },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: 'help-circle-outline',       label: 'FAQ',            action: () => navigation.navigate('FAQ')   },
        { icon: 'information-circle-outline',label: 'About SWAYAM',   action: () => navigation.navigate('About') },
        { icon: 'chatbubble-outline',        label: 'Contact Support',action: () => Alert.alert('Support', 'support@swayam.gov.in') },
      ],
    },
  ];

  return (
    <View style={styles.root}>
      <Header title="My Profile" onMenuPress={() => setMenuVisible(true)} navigation={navigation} />
      <SideMenu visible={menuVisible} onClose={() => setMenuVisible(false)} navigation={navigation} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
          </View>
          <Text style={styles.heroName}>{user?.full_name}</Text>
          <Text style={styles.heroEmail}>{user?.email}</Text>
          {user?.mobile ? <Text style={styles.heroMobile}>{user.mobile}</Text> : null}
          {user?.city   ? <Text style={styles.heroCity}>📍 {user.city}</Text> : null}
          <View style={styles.heroBadge}>
            <Ionicons name="school-outline" size={12} color="#FFB300" />
            <Text style={styles.heroBadgeText}>SWAYAM Learner</Text>
          </View>
        </View>

        {/* Notification Toggles */}
        <View style={styles.toggleCard}>
          <Text style={styles.toggleCardTitle}>Notification Preferences</Text>
          <View style={styles.toggleRow}>
            <Ionicons name="notifications-outline" size={18} color={COLORS.primary} />
            <Text style={styles.toggleLabel}>Push Notifications</Text>
            <Switch
              value={notifPush}
              onValueChange={val => handleToggleNotif('push', val)}
              trackColor={{ false: COLORS.border, true: COLORS.primary + '80' }}
              thumbColor={notifPush ? COLORS.primary : COLORS.textMuted}
            />
          </View>
          <View style={[styles.toggleRow, styles.toggleRowBorder]}>
            <Ionicons name="mail-outline" size={18} color={COLORS.primary} />
            <Text style={styles.toggleLabel}>Email Updates</Text>
            <Switch
              value={notifEmail}
              onValueChange={val => handleToggleNotif('email', val)}
              trackColor={{ false: COLORS.border, true: COLORS.primary + '80' }}
              thumbColor={notifEmail ? COLORS.primary : COLORS.textMuted}
            />
          </View>
        </View>

        {/* Menu Sections */}
        {MENU_SECTIONS.map(section => (
          <View key={section.title} style={styles.menuSection}>
            <Text style={styles.menuSectionTitle}>{section.title}</Text>
            <View style={styles.menuCard}>
              {section.items.map((item, idx) => (
                <TouchableOpacity
                  key={item.label}
                  style={[styles.menuRow, idx < section.items.length - 1 && styles.menuRowBorder]}
                  onPress={item.action}
                >
                  <View style={styles.menuIconWrap}>
                    <Ionicons name={item.icon} size={18} color={COLORS.primary} />
                  </View>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Sign Out */}
        <TouchableOpacity
          style={styles.signOutBtn}
          onPress={() => Alert.alert('Sign Out', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Sign Out', style: 'destructive', onPress: () => logout(navigation) },
          ])}
        >
          <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>SWAYAM v2.0 · Government of India</Text>
        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={editModal} animationType="slide" transparent>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setEditModal(false)}>
                <Ionicons name="close" size={22} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {[
                { label: 'Full Name',   value: fullName,    setter: setFullName,    placeholder: 'Your full name',   key: 'name'  },
                { label: 'Mobile',      value: mobile,      setter: setMobile,      placeholder: '+91 XXXXXXXXXX',   key: 'mob'   },
                { label: 'City',        value: city,        setter: setCity,        placeholder: 'Your city',        key: 'city'  },
                { label: 'Institution', value: institution, setter: setInstitution, placeholder: 'Your institution', key: 'inst'  },
              ].map(f => (
                <View key={f.key} style={styles.modalField}>
                  <Text style={styles.modalLabel}>{f.label}</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={f.value}
                    onChangeText={f.setter}
                    placeholder={f.placeholder}
                    placeholderTextColor={COLORS.textMuted}
                  />
                </View>
              ))}

              <View style={styles.modalField}>
                <Text style={styles.modalLabel}>Bio</Text>
                <TextInput
                  style={[styles.modalInput, styles.modalTextarea]}
                  value={bio}
                  onChangeText={setBio}
                  placeholder="Tell us about yourself…"
                  placeholderTextColor={COLORS.textMuted}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSaveProfile}
                disabled={saving}
              >
                {saving
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={styles.saveBtnText}>Save Changes</Text>
                }
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Change Password Modal */}
      <Modal visible={passModal} animationType="slide" transparent>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Change Password</Text>
              <TouchableOpacity onPress={() => setPassModal(false)}>
                <Ionicons name="close" size={22} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            {[
              { label: 'Current Password', value: oldPass,  setter: setOldPass,  placeholder: 'Enter current password' },
              { label: 'New Password',      value: newPass,  setter: setNewPass,  placeholder: 'Min 6 characters'       },
              { label: 'Confirm Password',  value: newPass2, setter: setNewPass2, placeholder: 'Re-enter new password'  },
            ].map((f, i) => (
              <View key={i} style={styles.modalField}>
                <Text style={styles.modalLabel}>{f.label}</Text>
                <TextInput
                  style={styles.modalInput}
                  value={f.value}
                  onChangeText={f.setter}
                  placeholder={f.placeholder}
                  placeholderTextColor={COLORS.textMuted}
                  secureTextEntry
                />
              </View>
            ))}

            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleChangePassword}
              disabled={saving}
            >
              {saving
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.saveBtnText}>Update Password</Text>
              }
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },

  hero: { backgroundColor: COLORS.primaryDark, alignItems: 'center', paddingTop: 30, paddingBottom: 32, paddingHorizontal: 20 },
  avatarWrap: { marginBottom: 14 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.accentLight, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: 'rgba(255,255,255,0.3)' },
  avatarText: { color: '#fff', fontSize: 34, fontWeight: '800' },
  heroName:   { color: '#fff', fontSize: 22, fontWeight: '800', marginBottom: 4 },
  heroEmail:  { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 2 },
  heroMobile: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginBottom: 2 },
  heroCity:   { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginBottom: 12 },
  heroBadge:  { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 12, paddingVertical: 5, borderRadius: RADIUS.full },
  heroBadgeText: { color: '#FFD54F', fontSize: 11, fontWeight: '700' },

  toggleCard: { margin: 16, backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: 16, borderWidth: 1, borderColor: COLORS.border, ...SHADOW.sm },
  toggleCardTitle: { fontSize: 13, fontWeight: '700', color: COLORS.text, marginBottom: 14 },
  toggleRow:       { flexDirection: 'row', alignItems: 'center', gap: 10 },
  toggleRowBorder: { borderTopWidth: 1, borderColor: COLORS.border, marginTop: 12, paddingTop: 12 },
  toggleLabel:     { flex: 1, fontSize: 14, color: COLORS.text, fontWeight: '500' },

  menuSection:      { paddingHorizontal: 16, marginBottom: 16 },
  menuSectionTitle: { fontSize: 11, fontWeight: '800', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 },
  menuCard:         { backgroundColor: COLORS.white, borderRadius: RADIUS.lg, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border, ...SHADOW.sm },
  menuRow:          { flexDirection: 'row', alignItems: 'center', padding: 14 },
  menuRowBorder:    { borderBottomWidth: 1, borderColor: COLORS.border },
  menuIconWrap:     { width: 34, height: 34, borderRadius: 9, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  menuLabel:        { flex: 1, fontSize: 14, fontWeight: '500', color: COLORS.text },

  signOutBtn:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 16, marginBottom: 12, height: 50, borderRadius: RADIUS.md, borderWidth: 1.5, borderColor: COLORS.error + '50', backgroundColor: COLORS.errorBg },
  signOutText: { color: COLORS.error, fontSize: 15, fontWeight: '700' },
  version:     { textAlign: 'center', fontSize: 11, color: COLORS.textMuted, marginBottom: 8 },

  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalCard:    { backgroundColor: COLORS.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '85%' },
  modalHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle:   { fontSize: 18, fontWeight: '800', color: COLORS.text },
  modalField:   { marginBottom: 14 },
  modalLabel:   { fontSize: 12, fontWeight: '700', color: COLORS.text, marginBottom: 6 },
  modalInput:   { backgroundColor: COLORS.bg, borderRadius: RADIUS.md, paddingHorizontal: 14, height: 48, borderWidth: 1, borderColor: COLORS.border, fontSize: 14, color: COLORS.text },
  modalTextarea:{ height: 80, paddingTop: 12, textAlignVertical: 'top' },
  saveBtn:      { backgroundColor: COLORS.primaryDark, borderRadius: RADIUS.md, height: 50, alignItems: 'center', justifyContent: 'center', marginTop: 8, ...SHADOW.md },
  saveBtnText:  { color: '#fff', fontSize: 15, fontWeight: '800' },
});