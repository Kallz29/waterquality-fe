import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { teamMembers } from '../data/teamMembers';
import { aboutUsStyles as styles, SNAP_INTERVAL } from '../styles/aboutUsStyles';

export default function AboutUs({ onBack }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event) => {
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.round(offset / SNAP_INTERVAL);
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
            <Text style={styles.backText}>Kembali</Text>
          </TouchableOpacity>
          <View style={styles.iconContainer}>
            <Ionicons name="people-outline" size={16} color="#FFFFFF" />
          </View>
        </View>

        <View style={styles.headerTitle}>
          <View style={styles.tagContainer}>
            <Text style={styles.tagText}>TENTANG KAMI</Text>
          </View>
          <Text style={styles.title}>
            Tim Ahli{' '}
            <Text style={styles.titleAccent}>Monitoring</Text>
            {'\n'}Kualitas Air.
          </Text>
          <Text style={styles.description}>
            Menjaga Kualitas Air untuk Kesehatan Civitas Telkom University
          </Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Carousel */}
        <View style={styles.carouselSection}>
          <ScrollView
            horizontal
            pagingEnabled={false}
            decelerationRate="fast"
            snapToInterval={SNAP_INTERVAL}
            snapToAlignment="start"
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContent}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {teamMembers.map((member) => (
              <View key={member.id} style={styles.slide}>
                <View style={styles.card}>

                  {/* Foto */}
                  <View style={styles.imageSection}>
                    <Image source={member.image} style={styles.image} />
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.32)']}
                      style={styles.imageOverlay}
                    />
                    <Text style={styles.decoNumber}>0{member.id}</Text>
                  </View>

                  {/* Info */}
                  <View style={styles.cardContent}>
                    <View style={styles.cardAccentBar} />
                    <Text style={styles.memberName}>{member.name}</Text>
                    <View style={styles.nimRow}>
                      <Ionicons name="card-outline" size={12} color="#8BAFC0" />
                      <Text style={styles.nimText}>{member.nim}</Text>
                    </View>
                  </View>

                </View>
              </View>
            ))}
          </ScrollView>

          {/* Dots */}
          <View style={styles.dotsContainer}>
            {teamMembers.map((_, index) => (
              <View
                key={index}
                style={[styles.dot, currentIndex === index && styles.activeDot]}
              />
            ))}
          </View>
        </View>

        {/* Info card */}
        <View style={styles.infoCard}>
          <View style={styles.infoIconDot} />
          <Text style={styles.infoText}>
            Tim kami berkomitmen untuk menyediakan solusi monitoring kualitas air terbaik
          </Text>
          <View style={styles.infoBadge}>
            <Text style={styles.infoBadgeText}>PERMENKES RI No. 32 Tahun 2017</Text>
          </View>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>

    </View>
  );
}