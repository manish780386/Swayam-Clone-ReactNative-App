import React from 'react';
import {
  View, Text, TouchableOpacity, Modal,
  ScrollView, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { COLORS, RADIUS } from '../styles/theme';

const MENU_ITEMS = [
  { title: 'Home',             icon: 'home-outline',               screen: 'Home'          },
  { title: 'Dashboard',        icon: 'grid-outline',               screen: 'Dashboard'     },
  { title: 'My Courses',       icon: 'book-outline',               screen: 'MyCourses'     },
  { title: 'My Certifications',icon: 'ribbon-outline',             screen: 'Certifications'},
  { title: 'Course Catalog',   icon: 'list-outline',               screen: 'CourseCatalog' },
  { title: 'Categories',       icon: 'apps-outline',               screen: 'Categories'    },
  { title: 'Notifications',    icon: 'notifications-outline',      screen: 'Notifications' },
  { title: 'Profile',          icon: 'person-outline',             screen: 'Profile'       },
  { title: 'FAQ',              icon: 'help-circle-outline',        screen: 'FAQ'           },
  { title: 'About',            icon: 'information-circle-outline', screen: 'About'         },
];

export default function SideMenu({ visible, onClose, navigation }) {
  const { user, logout } = useAuth();

  const goTo = (screen) => {
    onClose();
    navigation.navigate(screen);
  };

  const handleLogout = () => {
    onClose();
    logout(navigation);
  };

  const initials = user?.full_name
    ? user.full_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.overlayTouch} onPress={onClose} activeOpacity={1} />

        <View style={styles.menu}>
          {/* User Header */}
          <View style={styles.menuHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName} numberOfLines={1}>
                {user?.full_name || 'User'}
              </Text>
              <Text style={styles.userEmail} numberOfLines={1}>
                {user?.email || ''}
              </Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={18} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          {/* Logo */}
          <View style={styles.logoRow}>
            <Text style={styles.logoText}>🎓 SWAYAM</Text>
            <Text style={styles.logoSub}>Free Quality Higher Education</Text>
          </View>

          {/* Nav Items */}
          <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
            {MENU_ITEMS.map((item) => (
              <TouchableOpacity
                key={item.screen}
                style={styles.navItem}
                onPress={() => goTo(item.screen)}
              >
                <View style={styles.navIconWrap}>
                  <Ionicons name={item.icon} size={19} color={COLORS.sidebarMuted || '#90CAF9'} />
                </View>
                <Text style={styles.navText}>{item.title}</Text>
                <Ionicons name="chevron-forward" size={13} color="rgba(255,255,255,0.3)" />
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Sign Out */}
          <TouchableOpacity style={styles.signOut} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={19} color="#EF9A9A" />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, flexDirection: 'row', backgroundColor: 'rgba(13,27,75,0.5)' },
  overlayTouch: { flex: 1 },
  menu: {
    width: 285,
    backgroundColor: COLORS.primaryDark,
    height: '100%',
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    paddingTop: 50,
    backgroundColor: 'rgba(0,0,0,0.2)',
    gap: 10,
  },
  avatar: {
    width: 44, height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.accentLight,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText:  { color: '#fff', fontSize: 17, fontWeight: '800' },
  userInfo:    { flex: 1 },
  userName:    { color: '#fff', fontSize: 14, fontWeight: '700' },
  userEmail:   { color: '#90CAF9', fontSize: 10, marginTop: 2 },
  closeBtn: {
    backgroundColor: 'rgba(255,82,82,0.3)',
    borderRadius: 20, padding: 5,
  },
  logoRow: {
    paddingHorizontal: 18, paddingVertical: 12,
    borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  logoText: { color: '#fff', fontSize: 15, fontWeight: '800', letterSpacing: 1 },
  logoSub:  { color: '#90CAF9', fontSize: 9, marginTop: 2 },
  navItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 18, paddingVertical: 13, gap: 12,
  },
  navIconWrap: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  navText: { flex: 1, color: '#fff', fontSize: 14, fontWeight: '500' },
  signOut: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 18, borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(239,154,154,0.08)',
  },
  signOutText: { color: '#EF9A9A', fontSize: 14, fontWeight: '600' },
});