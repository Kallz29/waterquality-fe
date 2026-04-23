import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, Image, TouchableOpacity,
  ActivityIndicator, RefreshControl, Modal, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import WaterQualityCard from './WaterQualityCard';
import StatusCard from './StatusCard';
import HistoryModal from './HistoryModal';
import {
  getAllSensors, getLatestSensor, getSensorStats,
  getAlerts, markAlertRead, markAllAlertsRead, getThreshold,
} from '../services/api';
import { dashboardStyles as styles } from '../styles/dashboardStyles';

// ─── Helpers ───────────────────────────────────────────────
const getStatus = (value, min, max) => {
  if (value == null || min == null || max == null) return 'good';
  const n = parseFloat(value);
  if (n < min || n > max) return 'danger';
  const range = max - min;
  if (n < min + range * 0.1 || n > max - range * 0.1) return 'warning';
  return 'good';
};

const STATUS_DOT = { good: '#4ADE80', warning: '#FCD34D', danger: '#F87171' };

const mapSensorToCards = (data, threshold) => {
  const th = threshold || {};
  return [
    {
      id: 1, title: 'pH Level',
      value: data.ph != null ? String(parseFloat(data.ph).toFixed(1)) : '-',
      unit: 'pH',
      status: getStatus(data.ph, th.ph_min ?? 6.5, th.ph_max ?? 8.5),
      iconName: 'water',
      range: `${th.ph_min ?? 6.5}–${th.ph_max ?? 8.5}`, accuracy: '±0.1 pH',
      colors: ['#7CB9D8', '#5AA3C8'], color: ['#7CB9D8', '#5AA3C8'],
    },
    {
      id: 2, title: 'Suhu Air',
      value: data.temperature != null ? String(parseFloat(data.temperature).toFixed(1)) : '-',
      unit: '°C',
      status: getStatus(data.temperature, th.temp_min ?? 10, th.temp_max ?? 35),
      iconName: 'thermometer',
      range: `${th.temp_min ?? 10}–${th.temp_max ?? 35}°C`, accuracy: '±0.5°C',
      colors: ['#B8DAE8', '#7CB9D8'], color: ['#B8DAE8', '#7CB9D8'],
    },
    {
      id: 3, title: 'Padatan Terlarut',
      value: data.tds != null ? String(parseFloat(data.tds).toFixed(0)) : '-',
      unit: 'ppm',
      status: getStatus(data.tds, th.tds_min ?? 0, th.tds_max ?? 500),
      iconName: 'flask',
      range: `${th.tds_min ?? 0}–${th.tds_max ?? 500}`, accuracy: '±10% F.S.',
      colors: ['#5AA3C8', '#3E8FB8'], color: ['#5AA3C8', '#3E8FB8'],
    },
    {
      id: 4, title: 'Kekeruhan',
      value: data.turbidity != null ? String(parseFloat(data.turbidity).toFixed(1)) : '-',
      unit: 'NTU',
      status: getStatus(data.turbidity, th.tss_min ?? 0, th.tss_max ?? 5),
      iconName: 'eyedrop',
      range: `${th.tss_min ?? 0}–${th.tss_max ?? 5} NTU`, accuracy: '±85%',
      colors: ['#7CB9D8', '#5AA3C8'], color: ['#7CB9D8', '#5AA3C8'],
    },
  ];
};

const buildHistory = (list, field, unit) =>
  list.map((item) => ({
    timestamp: new Date(item.created_at),
    value: parseFloat(item[field]).toFixed(1),
    unit, status: 'good',
  }));

const SEVERITY_BG   = { low: '#FEF3C7', medium: '#FED7AA', high: '#FEE2E2', critical: '#FECACA' };
const SEVERITY_TEXT = { low: '#92400E', medium: '#C2410C', high: '#991B1B', critical: '#7F1D1D' };
const SEVERITY_LABEL= { low: 'Rendah', medium: 'Sedang', high: 'Tinggi', critical: 'Kritis' };

// Hitung lebar card sekali di module level
const { width: SCREEN_W } = Dimensions.get('window');
const GRID_PADDING = 16;   // paddingHorizontal kiri & kanan
const GRID_GAP     = 10;   // jarak antar 2 kolom
const CARD_W = Math.floor((SCREEN_W - GRID_PADDING * 2 - GRID_GAP) / 2);

// ─── Parameter Card ────────────────────────────────────────
const ParamCard = ({ item, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.88}
    style={[styles.paramCard, { width: CARD_W }]}
  >
    <LinearGradient colors={item.colors} style={styles.paramCardTop} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
      <View style={[styles.paramCardStatusDot, { backgroundColor: STATUS_DOT[item.status] }]} />
      <View style={styles.paramCardIconWrap}>
        <Ionicons name={item.iconName} size={16} color="rgba(255,255,255,0.9)" />
      </View>
      <Text style={styles.paramCardLabel}>{item.title}</Text>
      <View style={styles.paramCardValueRow}>
        <Text style={styles.paramCardValue}>{item.value}</Text>
        <Text style={styles.paramCardUnit}>{item.unit}</Text>
      </View>
    </LinearGradient>
    <View style={[styles.paramCardBottom, { backgroundColor: item.colors[1] + 'CC' }]}>
      <Text style={styles.paramCardRange}>{item.range}</Text>
      <Text style={styles.paramCardAccuracy}>{item.accuracy}</Text>
    </View>
  </TouchableOpacity>
);

// ─── Dashboard ─────────────────────────────────────────────
export default function Dashboard({ onNavigateToAbout, onNavigateToAI }) {
  const [selectedParameter, setSelectedParameter] = useState(null);
  const [showOverallHistory, setShowOverallHistory] = useState(false);
  const [showAlertsModal, setShowAlertsModal] = useState(false);

  const [qualityData, setQualityData] = useState([]);
  const [overallData, setOverallData] = useState(null);
  const [historyList, setHistoryList] = useState([]);
  const [stats, setStats]             = useState(null);
  const [alerts, setAlerts]           = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [threshold, setThreshold]     = useState(null);

  const [loading, setLoading]         = useState(true);
  const [refreshing, setRefreshing]   = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError]             = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const [latestRes, allRes, statsRes, alertsRes, thresholdRes] = await Promise.all([
        getLatestSensor(), getAllSensors(100), getSensorStats(),
        getAlerts({ limit: 20 }), getThreshold(),
      ]);
      const latest    = latestRes.data;
      const list      = allRes.data || [];
      const statsData = statsRes.data || {};
      const alertList = alertsRes.data || [];
      const th        = thresholdRes.data || {};

      setThreshold(th);
      setQualityData(mapSensorToCards(latest, th));
      setHistoryList(list);
      setStats(statsData);
      setAlerts(alertList);
      setUnreadCount(alertList.filter((a) => !a.is_read).length);
      setOverallData({
        id: 0, title: 'Kualitas Air Overall',
        value: latest.wqi_score != null ? String(Math.round(latest.wqi_score)) : '-',
        unit: 'Skor', status: latest.wqi_status || 'good',
        colors: ['#4ADE80', '#22C55E'], color: ['#4ADE80', '#22C55E'],
        history: list.map((item) => ({
          timestamp: new Date(item.created_at),
          value: Math.round(item.wqi_score),
          unit: 'Skor', status: item.wqi_status || 'good',
        })),
      });
      setLastUpdated(new Date(latest.created_at));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const iv = setInterval(fetchData, 30000);
    return () => clearInterval(iv);
  }, [fetchData]);

  const onRefresh = () => { setRefreshing(true); fetchData(); };

  const handleMarkRead = async (id) => {
    try {
      await markAlertRead(id);
      setAlerts((p) => p.map((a) => a.id === id ? { ...a, is_read: true } : a));
      setUnreadCount((p) => Math.max(0, p - 1));
    } catch (err) { console.error(err); }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAlertsRead();
      setAlerts((p) => p.map((a) => ({ ...a, is_read: true })));
      setUnreadCount(0);
    } catch (err) { console.error(err); }
  };

  const getHistoryForParam = (id) => {
    const map = { 1: ['ph','pH'], 2: ['temperature','°C'], 3: ['tds','ppm'], 4: ['turbidity','NTU'] };
    const [field, unit] = map[id] || [];
    return buildHistory(historyList, field, unit);
  };

  const selectedData = qualityData.find((d) => d.id === selectedParameter);
  const selectedDataWithHistory = selectedData
    ? { ...selectedData, history: getHistoryForParam(selectedParameter) }
    : null;

  // ── UPDATED: show minutes → hours → days → date ──────────
  const formatLastUpdated = () => {
    if (!lastUpdated) return 'Memuat...';
    const diffMs  = Date.now() - lastUpdated.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1)   return 'Baru saja';
    if (diffMin < 60)  return `${diffMin} menit lalu`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour} jam lalu`;
    const diffDay = Math.floor(diffHour / 24);
    if (diffDay < 7)   return `${diffDay} hari lalu`;
    return lastUpdated.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const overallStatusText =
    overallData?.status === 'danger'  ? 'Ada parameter di luar batas aman' :
    overallData?.status === 'warning' ? 'Beberapa parameter mendekati batas' :
    'Semua parameter dalam batas aman';

  const cardRows = [];
  for (let i = 0; i < qualityData.length; i += 2) {
    cardRows.push(qualityData.slice(i, i + 2));
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7CB9D8" />}
    >
      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            {/* ── UPDATED: logoCircle & logo lebih besar ── */}
            <View style={styles.logoCircle}>
              <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
            </View>
            <View>
              <Text style={styles.headerTitle}>UniFlow</Text>
              <Text style={styles.headerSubtitle}>Monitoring Kualitas Air</Text>
            </View>
          </View>

          <View style={styles.headerIcons}>
            {/* Bell */}
            <TouchableOpacity onPress={() => setShowAlertsModal(true)} style={styles.statusIndicator}>
              <Ionicons name="notifications" size={20} color="#FFFFFF" />
              {unreadCount > 0 && (
                <View style={{
                  position: 'absolute', top: -4, right: -4,
                  backgroundColor: '#EF4444', borderRadius: 8,
                  minWidth: 16, height: 16, justifyContent: 'center', alignItems: 'center',
                }}>
                  <Text style={{ color: '#fff', fontSize: 9, fontWeight: '700' }}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={onNavigateToAbout} style={styles.statusIndicator}>
              <Ionicons name="person" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onNavigateToAI} style={styles.statusIndicator}>
              <Ionicons name="chatbubble-ellipses" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ── Error banner ── */}
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>Gagal mengambil data: {error}</Text>
          <TouchableOpacity onPress={fetchData}>
            <Text style={styles.errorRetry}>Coba lagi →</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#7CB9D8" />
          <Text style={styles.loadingText}>Memuat data sensor...</Text>
        </View>
      ) : (
        <>
          {/* ── WQI floating card ── */}
          <View style={styles.statusSection}>
            <StatusCard
              onHistoryClick={() => setShowOverallHistory(true)}
              wqiScore={overallData?.value}
              wqiStatus={overallData?.status}
            />
          </View>

          {/* ── Stats strip ── */}
          {stats && (
            <View style={styles.statsStrip}>
              {[
                { label: 'Avg pH',   value: stats.avg_ph ?? '-' },
                { label: 'Avg Suhu', value: stats.avg_temperature ? `${stats.avg_temperature}°C` : '-' },
                { label: 'Avg TDS',  value: stats.avg_tds ? `${stats.avg_tds}` : '-' },
                { label: 'Avg WQI',  value: stats.avg_wqi_score ?? '-' },
              ].map((s) => (
                <View key={s.label} style={styles.statItem}>
                  <Text style={styles.statValue}>{s.value}</Text>
                  <Text style={styles.statLabel}>{s.label}</Text>
                </View>
              ))}
            </View>
          )}

          {/* ── Section header ── */}
          <View style={styles.metricsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Parameter Air</Text>
              <Text style={styles.updateTime}>Diperbarui {formatLastUpdated()}</Text>
            </View>
          </View>

          {/* ── Parameter cards 2×2 grid ── */}
          <View style={styles.cardsGrid}>
            {cardRows.map((row, rowIdx) => (
              <View key={rowIdx} style={styles.cardRow}>
                {row.map((item) => (
                  <ParamCard
                    key={item.id}
                    item={item}
                    onPress={() => setSelectedParameter(item.id)}
                  />
                ))}
              </View>
            ))}
          </View>

          {/* ── Info card ── */}
          <View style={styles.infoSection}>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.infoDot} />
                <Text style={styles.infoText}>{overallStatusText}</Text>
              </View>
              <Text style={styles.infoSubtext}>PERMENKES RI No. 32 Tahun 2017</Text>
            </View>
          </View>
        </>
      )}

      {/* ── Alerts Modal ── */}
      <Modal visible={showAlertsModal} animationType="slide" transparent onRequestClose={() => setShowAlertsModal(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '75%' }}>
            <View style={{
              flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
              padding: 16, borderBottomWidth: 1, borderBottomColor: '#EAF4FB',
            }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#1A3040' }}>Notifikasi Alert</Text>
              <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                {unreadCount > 0 && (
                  <TouchableOpacity onPress={handleMarkAllRead}>
                    <Text style={{ fontSize: 12, color: '#7CB9D8', fontWeight: '600' }}>Tandai semua dibaca</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => setShowAlertsModal(false)}>
                  <Ionicons name="close" size={22} color="#8BAFC0" />
                </TouchableOpacity>
              </View>
            </View>
            <ScrollView style={{ padding: 16 }}>
              {alerts.length === 0 ? (
                <View style={{ padding: 32, alignItems: 'center' }}>
                  <Ionicons name="checkmark-circle" size={40} color="#7CB9D8" />
                  <Text style={{ color: '#8BAFC0', marginTop: 8, fontSize: 13 }}>Tidak ada alert</Text>
                </View>
              ) : alerts.map((alert) => (
                <TouchableOpacity
                  key={alert.id}
                  onPress={() => !alert.is_read && handleMarkRead(alert.id)}
                  style={{
                    backgroundColor: alert.is_read ? '#F9FAFB' : (SEVERITY_BG[alert.severity] || '#FEE2E2'),
                    borderRadius: 12, padding: 13, marginBottom: 10,
                    borderLeftWidth: 3,
                    borderLeftColor: alert.is_read ? '#D1D5DB' : (SEVERITY_TEXT[alert.severity] || '#DC2626'),
                  }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: alert.is_read ? '#9CA3AF' : (SEVERITY_TEXT[alert.severity] || '#DC2626') }}>
                      {alert.parameter?.toUpperCase()} — {SEVERITY_LABEL[alert.severity] || alert.severity}
                    </Text>
                    {!alert.is_read && <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#EF4444', marginTop: 2 }} />}
                  </View>
                  <Text style={{ fontSize: 13, color: '#374151', lineHeight: 18 }}>{alert.message}</Text>
                  <Text style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>
                    Nilai: {alert.value} | Batas: {alert.threshold_min}–{alert.threshold_max}
                  </Text>
                  <Text style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2 }}>
                    {new Date(alert.created_at).toLocaleString('id-ID')}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ── History Modals ── */}
      {selectedDataWithHistory && (
        <HistoryModal visible data={selectedDataWithHistory} onClose={() => setSelectedParameter(null)} />
      )}
      {showOverallHistory && overallData && (
        <HistoryModal visible data={overallData} onClose={() => setShowOverallHistory(false)} />
      )}
    </ScrollView>
  );
}