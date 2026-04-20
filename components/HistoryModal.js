import React from 'react';
import {
  Modal, View, Text, ScrollView, TouchableOpacity, Share, Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { historyModalStyles as styles } from '../styles/historyModalStyles';
import { getSensorCSVUrl } from '../services/api';

export default function HistoryModal({ visible, onClose, data }) {
  const { title, color, history } = data;

  const statusConfig = {
    good:    { bg: '#D1FAE5', color: '#065F46', label: 'Normal' },
    warning: { bg: '#FEF3C7', color: '#92400E', label: 'Peringatan' },
    danger:  { bg: '#FEE2E2', color: '#991B1B', label: 'Bahaya' },
  };

  const formatDate = (date) => {
    const d = date instanceof Date ? date : new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const timeStr = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    if (d.toDateString() === today.toDateString()) return `Hari ini, ${timeStr}`;
    if (d.toDateString() === yesterday.toDateString()) return `Kemarin, ${timeStr}`;
    return `${d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}, ${timeStr}`;
  };

  const getTrend = (index) => {
    if (index === history.length - 1) return 'stable';
    const current = parseFloat(history[index].value);
    const previous = parseFloat(history[index + 1].value);
    if (current > previous) return 'up';
    if (current < previous) return 'down';
    return 'stable';
  };

  const getTrendIcon  = (t) => t === 'up' ? '↑' : t === 'down' ? '↓' : '—';
  const getTrendColor = (t) => t === 'up' ? '#16A34A' : t === 'down' ? '#DC2626' : '#9CA3AF';
  const getTrendLabel = (t) => t === 'up' ? 'Naik' : t === 'down' ? 'Turun' : 'Stabil';

  // Export: pakai endpoint backend CSV (90 hari), buka di browser/share
  const handleExport = async () => {
    const csvUrl = getSensorCSVUrl(90);
    try {
      const supported = await Linking.canOpenURL(csvUrl);
      if (supported) {
        await Linking.openURL(csvUrl);
      } else {
        // Fallback: share URL
        await Share.share({ message: `Download CSV data sensor: ${csvUrl}`, title: `UniFlow - Riwayat ${title}` });
      }
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Header */}
        <LinearGradient colors={color} style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>Riwayat {title}</Text>
              <Text style={styles.headerSubtitle}>
                {history.length} data tercatat (3 bulan terakhir)
              </Text>
            </View>
            <View style={styles.headerButtons}>
              <TouchableOpacity onPress={handleExport} style={styles.headerButton}>
                <Text style={styles.headerButtonIcon}>⬇</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={styles.headerButton}>
                <Text style={styles.headerButtonIcon}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* History List */}
        <ScrollView style={styles.scrollView}>
          <View style={styles.listContainer}>
            {history.length === 0 ? (
              <View style={{ padding: 32, alignItems: 'center' }}>
                <Text style={{ color: '#6B7280', fontSize: 14 }}>Belum ada data history</Text>
              </View>
            ) : (
              history.map((entry, index) => {
                const trend = getTrend(index);
                const config = statusConfig[entry.status] || statusConfig.good;
                return (
                  <View key={index} style={styles.card}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.cardDate}>
                        {formatDate(entry.timestamp)}
                      </Text>
                      <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
                        <Text style={[styles.statusText, { color: config.color }]}>{config.label}</Text>
                      </View>
                    </View>
                    <View style={styles.cardBody}>
                      <View style={styles.valueContainer}>
                        <Text style={styles.value}>{entry.value}</Text>
                        <Text style={styles.unit}>{entry.unit}</Text>
                      </View>
                      <View style={[styles.trendContainer, { backgroundColor: getTrendColor(trend) + '15' }]}>
                        <Text style={[styles.trendIcon, { color: getTrendColor(trend) }]}>{getTrendIcon(trend)}</Text>
                        <Text style={[styles.trendLabel, { color: getTrendColor(trend) }]}>{getTrendLabel(trend)}</Text>
                      </View>
                    </View>
                  </View>
                );
              })
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
