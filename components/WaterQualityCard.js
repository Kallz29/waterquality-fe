import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { waterQualityCardStyles as styles } from '../styles/waterQualityCardStyles';

export default function WaterQualityCard({
  title,
  value,
  unit,
  status,
  iconName,
  range,
  accuracy,
  color,
  onPress,
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const statusConfig = {
    good: { bg: '#DCFCE7', color: '#15803D', icon: '✓' },
    warning: { bg: '#FEF3C7', color: '#A16207', icon: '⚠' },
    danger: { bg: '#FEE2E2', color: '#991B1B', icon: '✕' },
  };

  return (
    <Animated.View
      style={[
        styles.card,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        disabled={!onPress}
      >
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <LinearGradient colors={color} style={styles.iconContainer}>
            <Ionicons name={iconName} size={20} color="#FFFFFF" />
          </LinearGradient>
        </Animated.View>

        <Text style={styles.title}>{title}</Text>

        <View style={styles.valueContainer}>
          <Text style={styles.value}>{value}</Text>
          <Text style={styles.unit}>{unit}</Text>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.rangeRow}>
            <Text style={styles.rangeText}>Rentang: {range}</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: statusConfig[status].bg },
              ]}
            >
              <Text
                style={[styles.statusText, { color: statusConfig[status].color }]}
              >
                {statusConfig[status].icon}
              </Text>
            </View>
          </View>
          {accuracy ? (
            <Text style={styles.accuracyText}>Akurasi: {accuracy}</Text>
          ) : null}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}