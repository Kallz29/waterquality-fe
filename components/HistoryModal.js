import React from 'react';
import {
  Modal, View, Text, ScrollView, TouchableOpacity, Share, Linking, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { historyModalStyles as styles } from '../styles/historyModalStyles';
import { getSensorCSVUrl } from '../services/api';

export default function HistoryModal({ visible, onClose, data }) {
  const { title, color, history = [] } = data;

  // Pastikan color selalu array untuk LinearGradient
  const gradientColors = Array.isArray(color) ? color : [color, color];

  const statusConfig = {
    good:    { bg: '#DCFCE7', color: '#166534', label: 'Normal' },
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
    const cur = parseFloat(history[index].value);
    const prv = parseFloat(history[index + 1].value);
    if (cur > prv) return 'up';
    if (cur < prv) return 'down';
    return 'stable';
  };

  const trendMeta = {
    up:     { icon: 'trending-up',   color: '#16A34A', label: 'Naik' },
    down:   { icon: 'trending-down', color: '#DC2626', label: 'Turun' },
    stable: { icon: 'remove',        color: '#8BAFC0', label: 'Stabil' },
  };

  const handleExport = async () => {
    const csvUrl = getSensorCSVUrl(90);
    try {
      if (await Linking.canOpenURL(csvUrl)) {
        await Linking.openURL(csvUrl);
      } else {
        await Share.share({ message: `Download CSV data sensor: ${csvUrl}`, title: `UniFlow - Riwayat ${title}` });
      }
    } catch (err) { console.error('Export error:', err); }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>

        {/* Header */}
        <LinearGradient colors={gradientColors} style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <View style={styles.headerContent}>
            <View style={styles.headerTextWrap}>
              <Text style={styles.headerTitle}>Riwayat {title}</Text>
              <Text style={styles.headerSubtitle}>{history.length} data · 3 bulan terakhir</Text>
            </View>
            <View style={styles.headerBtns}>
              <TouchableOpacity onPress={handleExport} style={styles.headerBtn}>
                <Ionicons name="download-outline" size={18} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={styles.headerBtn}>
                <Ionicons name="close" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* List */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.listWrap}>
            {history.length === 0 ? (
              <View style={styles.emptyWrap}>
                <Ionicons name="time-outline" size={36} color="#C5DDE8" />
                <Text style={styles.emptyText}>Belum ada data riwayat</Text>
              </View>
            ) : history.map((entry, index) => {
              const trend  = getTrend(index);
              const tmeta  = trendMeta[trend];
              const config = statusConfig[entry.status] || statusConfig.good;
              return (
                <View key={index} style={styles.card}>
                  <View style={styles.cardTop}>
                    <Text style={styles.cardDate}>{formatDate(entry.timestamp)}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
                      <Text style={[styles.statusText, { color: config.color }]}>{config.label}</Text>
                    </View>
                  </View>
                  <View style={styles.cardBody}>
                    <View style={styles.valueRow}>
                      <Text style={styles.value}>{entry.value}</Text>
                      <Text style={styles.unit}>{entry.unit}</Text>
                    </View>
                    <View style={[styles.trendPill, { backgroundColor: tmeta.color + '18' }]}>
                      <Ionicons name={tmeta.icon} size={13} color={tmeta.color} />
                      <Text style={[styles.trendText, { color: tmeta.color }]}>{tmeta.label}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>

      </View>
    </Modal>
  );
}