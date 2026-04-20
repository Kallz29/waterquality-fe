import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, Image, TouchableOpacity,
  ActivityIndicator, RefreshControl, Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WaterQualityCard from './WaterQualityCard';
import StatusCard from './StatusCard';
import HistoryModal from './HistoryModal';
import {
  getAllSensors, getLatestSensor, getSensorStats,
  getAlerts, markAlertRead, markAllAlertsRead, getThreshold,
} from '../services/api';
import { dashboardStyles as styles } from '../styles/dashboardStyles';

// ---- Helper: status dari nilai vs threshold dinamis ----
const getStatus = (value, min, max) => {
  if (value == null || min == null || max == null) return 'good';
  const num = parseFloat(value);
  if (num < min || num > max) return 'danger';
  const range = max - min;
  if (num < min + range * 0.1 || num > max - range * 0.1) return 'warning';
  return 'good';
};

// ---- Map sensor + threshold → cards ----
const mapSensorToCards = (data, threshold) => {
  const th = threshold || {};
  return [
    {
      id: 1, title: 'pH Level',
      value: data.ph != null ? String(parseFloat(data.ph).toFixed(1)) : '-',
      unit: 'pH',
      status: getStatus(data.ph, th.ph_min ?? 6.5, th.ph_max ?? 8.5),
      iconName: 'water', range: `${th.ph_min ?? 6.5}–${th.ph_max ?? 8.5}`, accuracy: '±0.1 pH',
      color: ['#7CB9D8', '#5AA3C8'],
    },
    {
      id: 2, title: 'Suhu Air',
      value: data.temperature != null ? String(parseFloat(data.temperature).toFixed(1)) : '-',
      unit: '°C',
      status: getStatus(data.temperature, th.temp_min ?? 10, th.temp_max ?? 35),
      iconName: 'thermometer', range: `${th.temp_min ?? 10}–${th.temp_max ?? 35}°C`, accuracy: '±0.5°C',
      color: ['#B8DAE8', '#7CB9D8'],
    },
    {
      id: 3, title: 'Padatan Terlarut',
      value: data.tds != null ? String(parseFloat(data.tds).toFixed(0)) : '-',
      unit: 'ppm',
      status: getStatus(data.tds, th.tds_min ?? 0, th.tds_max ?? 500),
      iconName: 'flask', range: `${th.tds_min ?? 0}–${th.tds_max ?? 500}`, accuracy: '±10% F.S.',
      color: ['#5AA3C8', '#3E8FB8'],
    },
    {
      id: 4, title: 'Kekeruhan',
      value: data.turbidity != null ? String(parseFloat(data.turbidity).toFixed(1)) : '-',
      unit: 'NTU',
      status: getStatus(data.turbidity, th.tss_min ?? 0, th.tss_max ?? 5),
      iconName: 'eyedrop', range: `${th.tss_min ?? 0}–${th.tss_max ?? 5} NTU`, accuracy: '±85%',
      color: ['#7CB9D8', '#5AA3C8'],
    },
  ];
};

const buildHistory = (sensorList, field, unit) =>
  sensorList.map((item) => ({
    timestamp: new Date(item.created_at),
    value: parseFloat(item[field]).toFixed(1),
    unit,
    status: 'good',
  }));

const SEVERITY_COLOR = { low: '#FEF3C7', medium: '#FED7AA', high: '#FEE2E2', critical: '#FECACA' };
const SEVERITY_TEXT  = { low: '#92400E', medium: '#C2410C', high: '#991B1B', critical: '#7F1D1D' };
const SEVERITY_LABEL = { low: 'Rendah', medium: 'Sedang', high: 'Tinggi', critical: 'Kritis' };

export default function Dashboard({ onNavigateToAbout, onNavigateToAI }) {
  const [selectedParameter, setSelectedParameter] = useState(null);
  const [showOverallHistory, setShowOverallHistory] = useState(false);
  const [showAlertsModal, setShowAlertsModal] = useState(false);

  const [qualityData, setQualityData]   = useState([]);
  const [overallData, setOverallData]   = useState(null);
  const [historyList, setHistoryList]   = useState([]);
  const [stats, setStats]               = useState(null);
  const [alerts, setAlerts]             = useState([]);
  const [unreadCount, setUnreadCount]   = useState(0);
  const [threshold, setThreshold]       = useState(null);

  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError]         = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const [latestRes, allRes, statsRes, alertsRes, thresholdRes] = await Promise.all([
        getLatestSensor(),
        getAllSensors(100),
        getSensorStats(),
        getAlerts({ limit: 20 }),
        getThreshold(),
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
        color: ['#4ADE80', '#22C55E'],
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
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const onRefresh = () => { setRefreshing(true); fetchData(); };

  const handleMarkRead = async (alertId) => {
    try {
      await markAlertRead(alertId);
      setAlerts((prev) => prev.map((a) => a.id === alertId ? { ...a, is_read: true } : a));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) { console.error(err); }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAlertsRead();
      setAlerts((prev) => prev.map((a) => ({ ...a, is_read: true })));
      setUnreadCount(0);
    } catch (err) { console.error(err); }
  };

  const getHistoryForParam = (id) => {
    const fieldMap = { 1: ['ph', 'pH'], 2: ['temperature', '°C'], 3: ['tds', 'ppm'], 4: ['turbidity', 'NTU'] };
    const [field, unit] = fieldMap[id] || [];
    return buildHistory(historyList, field, unit);
  };

  const selectedData = qualityData.find((d) => d.id === selectedParameter);
  const selectedDataWithHistory = selectedData
    ? { ...selectedData, history: getHistoryForParam(selectedParameter) }
    : null;

  const formatLastUpdated = () => {
    if (!lastUpdated) return 'Memuat...';
    const diffMin = Math.floor((Date.now() - lastUpdated.getTime()) / 60000);
    if (diffMin < 1) return 'Baru saja';
    return `${diffMin} menit lalu`;
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
            <View>
              <Text style={styles.headerTitle}>UniFlow</Text>
              <Text style={styles.headerSubtitle}>Monitoring Kualitas Air</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {/* Bell icon dengan badge unread */}
            <TouchableOpacity onPress={() => setShowAlertsModal(true)} style={styles.statusIndicator}>
              <Ionicons name="notifications" size={20} color="#FFFFFF" />
              {unreadCount > 0 && (
                <View style={{
                  position: 'absolute', top: -4, right: -4,
                  backgroundColor: '#EF4444', borderRadius: 8,
                  minWidth: 16, height: 16, justifyContent: 'center', alignItems: 'center',
                }}>
                  <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>
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

      {/* Error banner */}
      {error && (
        <View style={{ backgroundColor: '#FEE2E2', margin: 16, padding: 12, borderRadius: 8 }}>
          <Text style={{ color: '#DC2626', fontSize: 13 }}>⚠️ Gagal mengambil data: {error}</Text>
          <TouchableOpacity onPress={fetchData}>
            <Text style={{ color: '#DC2626', fontWeight: '600', marginTop: 4 }}>Coba lagi</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <View style={{ padding: 32, alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#22C55E" />
          <Text style={{ marginTop: 8, color: '#6B7280' }}>Memuat data sensor...</Text>
        </View>
      ) : (
        <>
          {/* Status Overview */}
          <View style={styles.statusSection}>
            <StatusCard
              onHistoryClick={() => setShowOverallHistory(true)}
              wqiScore={overallData?.value}
              wqiStatus={overallData?.status}
            />
          </View>

          {/* Statistik Hari Ini */}
          {stats && (
            <View style={{ marginHorizontal: 16, marginBottom: 12 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
                📊 Statistik Hari Ini ({stats.total_readings} pembacaan)
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {[
                  { label: 'Avg pH', value: stats.avg_ph },
                  { label: 'Avg Suhu', value: stats.avg_temperature ? `${stats.avg_temperature}°C` : '-' },
                  { label: 'Avg TDS', value: stats.avg_tds ? `${stats.avg_tds} ppm` : '-' },
                  { label: 'Avg WQI', value: stats.avg_wqi_score },
                ].map((item) => (
                  <View key={item.label} style={{
                    backgroundColor: '#F0F9FF', borderRadius: 8, padding: 8,
                    flex: 1, minWidth: '45%', alignItems: 'center',
                  }}>
                    <Text style={{ fontSize: 11, color: '#6B7280' }}>{item.label}</Text>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: '#1E40AF' }}>{item.value ?? '-'}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Quality Metrics */}
          <View style={styles.metricsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Parameter Air</Text>
              <Text style={styles.updateTime}>Diperbarui {formatLastUpdated()}</Text>
            </View>
            <View style={styles.cardsGrid}>
              {qualityData.map((data) => (
                <WaterQualityCard key={data.id} {...data} onPress={() => setSelectedParameter(data.id)} />
              ))}
            </View>
          </View>

          {/* Info */}
          <View style={styles.infoSection}>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.infoDot} />
                <Text style={styles.infoText}>
                  {overallData?.status === 'danger'
                    ? 'Ada parameter di luar batas aman'
                    : overallData?.status === 'warning'
                    ? 'Beberapa parameter mendekati batas'
                    : 'Semua parameter dalam batas aman'}
                </Text>
              </View>
              <Text style={styles.infoSubtext}>Sesuai PERMENKES RI No. 32 Tahun 2017</Text>
            </View>
          </View>
        </>
      )}

      {/* ===== ALERTS MODAL ===== */}
      <Modal visible={showAlertsModal} animationType="slide" transparent onRequestClose={() => setShowAlertsModal(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '75%' }}>
            {/* Header */}
            <View style={{
              flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
              padding: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
            }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827' }}>
                🔔 Notifikasi Alert
              </Text>
              <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                {unreadCount > 0 && (
                  <TouchableOpacity onPress={handleMarkAllRead}>
                    <Text style={{ fontSize: 12, color: '#3B82F6', fontWeight: '600' }}>Tandai semua dibaca</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => setShowAlertsModal(false)}>
                  <Ionicons name="close" size={22} color="#6B7280" />
                </TouchableOpacity>
              </View>
            </View>

            {/* List */}
            <ScrollView style={{ padding: 16 }}>
              {alerts.length === 0 ? (
                <View style={{ padding: 32, alignItems: 'center' }}>
                  <Text style={{ fontSize: 32 }}>✅</Text>
                  <Text style={{ color: '#6B7280', marginTop: 8 }}>Tidak ada alert</Text>
                </View>
              ) : (
                alerts.map((alert) => (
                  <TouchableOpacity
                    key={alert.id}
                    onPress={() => !alert.is_read && handleMarkRead(alert.id)}
                    style={{
                      backgroundColor: alert.is_read ? '#F9FAFB' : (SEVERITY_COLOR[alert.severity] || '#FEE2E2'),
                      borderRadius: 10, padding: 12, marginBottom: 10,
                      borderLeftWidth: 4,
                      borderLeftColor: alert.is_read ? '#D1D5DB' : (SEVERITY_TEXT[alert.severity] || '#DC2626'),
                    }}
                  >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                      <Text style={{
                        fontSize: 12, fontWeight: '700',
                        color: alert.is_read ? '#6B7280' : (SEVERITY_TEXT[alert.severity] || '#DC2626'),
                      }}>
                        {alert.parameter?.toUpperCase()} — {SEVERITY_LABEL[alert.severity] || alert.severity}
                      </Text>
                      {!alert.is_read && (
                        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444', marginTop: 2 }} />
                      )}
                    </View>
                    <Text style={{ fontSize: 13, color: '#374151' }}>{alert.message}</Text>
                    <Text style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>
                      Nilai: {alert.value} | Batas: {alert.threshold_min}–{alert.threshold_max}
                    </Text>
                    <Text style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2 }}>
                      {new Date(alert.created_at).toLocaleString('id-ID')}
                    </Text>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* History Modal - Parameter */}
      {selectedDataWithHistory && (
        <HistoryModal visible={true} data={selectedDataWithHistory} onClose={() => setSelectedParameter(null)} />
      )}

      {/* History Modal - Overall */}
      {showOverallHistory && overallData && (
        <HistoryModal visible={true} data={overallData} onClose={() => setShowOverallHistory(false)} />
      )}
    </ScrollView>
  );
}
