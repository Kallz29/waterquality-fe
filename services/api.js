// ============================================
// API Service - UniFlow React Native
// ============================================

import { BASE_URL } from '../config';

const handleResponse = async (res) => {
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Terjadi kesalahan');
  return json;
};

// ============================================
// SENSOR
// ============================================

/** GET /api/sensors/latest */
export const getLatestSensor = async () => {
  const res = await fetch(`${BASE_URL}/sensors/latest`);
  return handleResponse(res);
};

/** GET /api/sensors?limit=N */
export const getAllSensors = async (limit = 50) => {
  const res = await fetch(`${BASE_URL}/sensors?limit=${limit}`);
  return handleResponse(res);
};

/** GET /api/sensors/stats */
export const getSensorStats = async () => {
  const res = await fetch(`${BASE_URL}/sensors/stats`);
  return handleResponse(res);
};

/** GET /api/sensors/export/csv?days=N → returns blob URL string */
export const getSensorCSVUrl = (days = 90) =>
  `${BASE_URL}/sensors/export/csv?days=${days}`;

// ============================================
// ALERTS
// ============================================

/** GET /api/alerts?unread=true&limit=N */
export const getAlerts = async ({ unread = false, limit = 50 } = {}) => {
  const params = new URLSearchParams({ limit });
  if (unread) params.set('unread', 'true');
  const res = await fetch(`${BASE_URL}/alerts?${params}`);
  return handleResponse(res);
};

/** PATCH /api/alerts/:id/read */
export const markAlertRead = async (id) => {
  const res = await fetch(`${BASE_URL}/alerts/${id}/read`, { method: 'PATCH' });
  return handleResponse(res);
};

/** PATCH /api/alerts/read-all */
export const markAllAlertsRead = async () => {
  const res = await fetch(`${BASE_URL}/alerts/read-all`, { method: 'PATCH' });
  return handleResponse(res);
};

// ============================================
// THRESHOLD
// ============================================

/** GET /api/threshold */
export const getThreshold = async () => {
  const res = await fetch(`${BASE_URL}/threshold`);
  return handleResponse(res);
};

/** PUT /api/threshold */
export const updateThreshold = async (thresholdData) => {
  const res = await fetch(`${BASE_URL}/threshold`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(thresholdData),
  });
  return handleResponse(res);
};

/** POST /api/threshold/reset */
export const resetThreshold = async () => {
  const res = await fetch(`${BASE_URL}/threshold/reset`, { method: 'POST' });
  return handleResponse(res);
};

// ============================================
// DEVICES
// ============================================

/** GET /api/devices */
export const getAllDevices = async () => {
  const res = await fetch(`${BASE_URL}/devices`);
  return handleResponse(res);
};

/** GET /api/devices/:id */
export const getDeviceById = async (id) => {
  const res = await fetch(`${BASE_URL}/devices/${id}`);
  return handleResponse(res);
};

/** POST /api/devices */
export const createDevice = async (deviceData) => {
  const res = await fetch(`${BASE_URL}/devices`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(deviceData),
  });
  return handleResponse(res);
};

// ============================================
// CHAT
// ============================================

/** POST /api/chat/sessions */
export const createChatSession = async (title = 'Sesi Baru') => {
  const res = await fetch(`${BASE_URL}/chat/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  return handleResponse(res);
};

/** GET /api/chat/sessions */
export const getAllChatSessions = async () => {
  const res = await fetch(`${BASE_URL}/chat/sessions`);
  return handleResponse(res);
};

/** PATCH or PUT /api/chat/sessions/:id  — update session title */
export const updateChatSession = async (sessionId, title) => {
  // Try PATCH first, fall back to PUT if not supported
  for (const method of ['PATCH', 'PUT']) {
    try {
      const res = await fetch(`${BASE_URL}/chat/sessions/${sessionId}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      if (res.ok) {
        const json = await res.json().catch(() => ({}));
        console.log('[updateChatSession] OK via', method, json);
        return json;
      }
      console.warn('[updateChatSession]', method, 'returned', res.status);
    } catch (err) {
      console.warn('[updateChatSession]', method, 'error:', err.message);
    }
  }
  throw new Error('updateChatSession: both PATCH and PUT failed');
};

/** GET /api/chat/sessions/:id/messages */
export const getChatMessages = async (sessionId) => {
  const res = await fetch(`${BASE_URL}/chat/sessions/${sessionId}/messages`);
  return handleResponse(res);
};

/** POST /api/chat/sessions/:id/messages */
export const sendChatMessage = async (sessionId, message) => {
  const res = await fetch(`${BASE_URL}/chat/sessions/${sessionId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  return handleResponse(res);
};

export const deleteChatSession = async (sessionId) => {
  console.log('API DELETE START:', sessionId);

  const res = await fetch(`${BASE_URL}/chat/sessions/${sessionId}`, {
    method: 'DELETE',
  });

  console.log('API DELETE STATUS:', res.status);

  // ✅ kalau sukses (200 / 204 / dll)
  if (res.ok) return { success: true };

  // ❗ fallback parsing
  let text;
  try {
    text = await res.text();
  } catch {
    throw new Error('Gagal membaca response');
  }

  console.log('DELETE ERROR RESPONSE:', text);

  throw new Error(text || 'Gagal menghapus');
};