import AsyncStorage from '@react-native-async-storage/async-storage';

// ── Change this to your machine IP when using real device ──
// Android Emulator  → 10.0.2.2
// iOS Simulator     → localhost
// Real Device       → YOUR_WIFI_IP e.g. 192.168.1.5
export const BASE_URL = 'http://192.168.1.77:8000/api';

// ─────────────────────────────────────────────────────────
// // Token Helpers
// ─────────────────────────────────────────────────────────
export const getAccessToken  = () => AsyncStorage.getItem('access_token');
export const getRefreshToken = () => AsyncStorage.getItem('refresh_token');

export const saveTokens = async (access, refresh) => {
  await AsyncStorage.setItem('access_token',  access);
  await AsyncStorage.setItem('refresh_token', refresh);
};

export const clearTokens = async () => {
  await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'user']);
};

export const getStoredUser = async () => {
  const u = await AsyncStorage.getItem('user');
  return u ? JSON.parse(u) : null;
};

// ─────────────────────────────────────────────────────────
// Core Request Function
// ─────────────────────────────────────────────────────────
async function request(method, endpoint, body = null, auth = true) {
  const headers = { 'Content-Type': 'application/json' };

  if (auth) {
    const token = await getAccessToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);

  try {
    const res  = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await res.json();
    if (!res.ok) throw data;
    return data;
  } catch (error) {
    throw error;
  }
}

// ─────────────────────────────────────────────────────────
// AUTH API
// ─────────────────────────────────────────────────────────
export const AuthAPI = {
  register: (full_name, email, mobile, password, password2) =>
    request('POST', '/auth/register/', { full_name, email, mobile, password, password2 }, false),

  login: async (email, password) => {
    const data = await request('POST', '/auth/login/', { email, password }, false);
    await saveTokens(data.access, data.refresh);
    await AsyncStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },

  logout: async () => {
    try {
      const refresh = await getRefreshToken();
      await request('POST', '/auth/logout/', { refresh });
    } catch (_) {}
    await clearTokens();
  },

  getProfile:     ()     => request('GET',   '/auth/profile/'),
  updateProfile:  (data) => request('PATCH', '/auth/profile/', data),
  changePassword: (old_password, new_password) =>
    request('POST', '/auth/change-password/', { old_password, new_password }),
  getDashboard:   ()     => request('GET', '/auth/dashboard/'),
};

// ─────────────────────────────────────────────────────────
// COURSES API
// ─────────────────────────────────────────────────────────
export const CoursesAPI = {
  getAll: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request('GET', `/courses/?${q}`, null, false);
  },
  getDetail:      (id)       => request('GET', `/courses/${id}/`,  null, false),
  getPopular:     ()         => request('GET', '/courses/popular/', null, false),
  getUpcoming:    ()         => request('GET', '/courses/upcoming/', null, false),
  getCategories:  ()         => request('GET', '/courses/categories/', null, false),
  getByCategory:  (slug)     => request('GET', `/courses/categories/${slug}/courses/`, null, false),
  getInstitutions:()         => request('GET', '/courses/institutions/', null, false),
  addReview:      (id, data) => request('POST', `/courses/${id}/review/`, data),
};

// ─────────────────────────────────────────────────────────
// ENROLLMENTS API
// ─────────────────────────────────────────────────────────
export const EnrollmentsAPI = {
  getAll:       ()   => request('GET',    '/enrollments/'),
  enroll:       (id) => request('POST',   '/enrollments/', { course_id: id }),
  getDetail:    (id) => request('GET',    `/enrollments/${id}/`),
  drop:         (id) => request('DELETE', `/enrollments/${id}/`),
  getStats:     ()   => request('GET',    '/enrollments/my_stats/'),
  completeWeek: (enrollId, weekId, completed = true) =>
    request('POST', `/enrollments/${enrollId}/complete_week/`, { week_id: weekId, completed }),
};

// ─────────────────────────────────────────────────────────
// NOTIFICATIONS API
// ─────────────────────────────────────────────────────────
export const NotificationsAPI = {
  getAll:        () => request('GET',   '/notifications/'),
  getUnreadCount:() => request('GET',   '/notifications/unread_count/'),
  markRead:      (id)=> request('PATCH',`/notifications/${id}/mark_read/`),
  markAllRead:   () => request('PATCH', '/notifications/mark_all_read/'),
};

// ─────────────────────────────────────────────────────────
// CERTIFICATIONS API
// ─────────────────────────────────────────────────────────
export const CertificationsAPI = {
  getAll:    () => request('GET', '/certifications/'),
  getSummary:() => request('GET', '/certifications/summary/'),
  getDetail: (id)=> request('GET', `/certifications/${id}/`),
};