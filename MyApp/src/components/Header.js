import React from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOW } from '../styles/theme';

export default function Header({ title, onMenuPress, navigation, showBack = false, unreadCount = 0 }) {
  return (
    <>
      <StatusBar backgroundColor={COLORS.primaryDark} barStyle="light-content" />
      <View style={styles.header}>

        {showBack ? (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={22} color={COLORS.white} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={onMenuPress} style={styles.iconBtn}>
            <Ionicons name="menu" size={24} color={COLORS.white} />
          </TouchableOpacity>
        )}

        <Text style={styles.title}>{title}</Text>

        <TouchableOpacity
          style={styles.bellWrap}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Ionicons name="notifications-outline" size={22} color={COLORS.white} />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>

      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.primaryDark,
    height: 58,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...SHADOW.md,
  },
  iconBtn: {
    padding: 7,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.13)',
  },
  title: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  bellWrap: {
    padding: 7,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.13)',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -3, right: -3,
    backgroundColor: '#E53935',
    borderRadius: 99,
    minWidth: 16, height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.primaryDark,
    paddingHorizontal: 2,
  },
  badgeText: { color: '#fff', fontSize: 8, fontWeight: '800' },
});