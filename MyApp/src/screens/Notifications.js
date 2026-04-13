import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header   from '../components/Header';
import SideMenu from '../components/SideMenu';
import { NotificationsAPI } from '../api/apiService';
import { COLORS, RADIUS, SHADOW } from '../styles/theme';

const TYPE_COLORS = {
  exam:         { bg: '#E3F2FD', accent: '#1565C0' },
  assignment:   { bg: '#FFF3E0', accent: '#E65100' },
  certificate:  { bg: '#E8F5E9', accent: '#2E7D32' },
  course:       { bg: '#F3E5F5', accent: '#6A1B9A' },
  announcement: { bg: '#ECEFF1', accent: '#455A64' },
};

export default function Notifications({ navigation }) {
  const [menuVisible,    setMenuVisible]    = useState(false);
  const [notifications,  setNotifications]  = useState([]);
  const [loading,        setLoading]        = useState(true);

  useEffect(() => { fetchNotifications(); }, []);

  const fetchNotifications = async () => {
    try {
      const data = await NotificationsAPI.getAll();
      setNotifications(Array.isArray(data) ? data : data.results || []);
    } catch (_) {}
    setLoading(false);
  };

  const handleMarkRead = async (id) => {
    try {
      await NotificationsAPI.markRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (_) {}
  };

  const handleMarkAllRead = async () => {
    try {
      await NotificationsAPI.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (_) {}
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const renderItem = ({ item }) => {
    const tc = TYPE_COLORS[item.type] || TYPE_COLORS.announcement;
    return (
      <TouchableOpacity
        style={[styles.card, !item.is_read && styles.cardUnread]}
        onPress={() => handleMarkRead(item.id)}
      >
        <View style={[styles.iconWrap, { backgroundColor: tc.bg }]}>
          <Text style={{ fontSize: 22 }}>{item.icon}</Text>
        </View>
        <View style={styles.cardBody}>
          <View style={styles.cardTop}>
            <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
            {!item.is_read && <View style={styles.unreadDot} />}
          </View>
          <Text style={styles.cardMsg} numberOfLines={2}>{item.message}</Text>
          <View style={styles.cardMeta}>
            <View style={[styles.typeBadge, { backgroundColor: tc.bg }]}>
              <Text style={[styles.typeBadgeText, { color: tc.accent }]}>
                {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
              </Text>
            </View>
            <Text style={styles.timeText}>
              {new Date(item.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.root}>
      <Header title="Notifications" onMenuPress={() => setMenuVisible(true)} navigation={navigation} />
      <SideMenu visible={menuVisible} onClose={() => setMenuVisible(false)} navigation={navigation} />

      {/* Summary Bar */}
      <View style={styles.summaryBar}>
        <View style={styles.summaryLeft}>
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
          </View>
          <Text style={styles.summaryText}>{unreadCount} unread</Text>
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity style={styles.markAllBtn} onPress={handleMarkAllRead}>
            <Ionicons name="checkmark-done-outline" size={14} color={COLORS.primary} />
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading
        ? <ActivityIndicator color={COLORS.primary} style={{ flex: 1 }} />
        : (
          <FlatList
            data={notifications}
            keyExtractor={item => String(item.id)}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text style={{ fontSize: 44 }}>🔔</Text>
                <Text style={styles.emptyText}>No notifications yet</Text>
              </View>
            }
            renderItem={renderItem}
            ListFooterComponent={<View style={{ height: 30 }} />}
          />
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  summaryBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: '#fff', borderBottomWidth: 1, borderColor: COLORS.border,
  },
  summaryLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  unreadBadge: { backgroundColor: '#E53935', borderRadius: 99, width: 22, height: 22, alignItems: 'center', justifyContent: 'center' },
  unreadBadgeText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  summaryText: { fontSize: 13, color: COLORS.text, fontWeight: '600' },
  markAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.primaryBg, paddingHorizontal: 10, paddingVertical: 6, borderRadius: RADIUS.full },
  markAllText: { fontSize: 11, color: COLORS.primary, fontWeight: '700' },
  list: { padding: 16 },
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: RADIUS.lg, padding: 14, gap: 12, borderWidth: 1, borderColor: COLORS.border, ...SHADOW.sm },
  cardUnread: { borderColor: COLORS.primary + '40', backgroundColor: '#F7F9FF' },
  iconWrap: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  cardBody: { flex: 1 },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  cardTitle: { fontSize: 13, fontWeight: '700', color: COLORS.text, flex: 1 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#E53935', marginLeft: 6 },
  cardMsg: { fontSize: 12, color: COLORS.textSec, lineHeight: 18, marginBottom: 8 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.full },
  typeBadgeText: { fontSize: 9, fontWeight: '800' },
  timeText: { fontSize: 10, color: COLORS.textMuted },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15, color: COLORS.textMuted, fontWeight: '600' },
});