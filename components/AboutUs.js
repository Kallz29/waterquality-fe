import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { teamMembers } from '../data/teamMembers';
import { aboutUsStyles as styles } from '../styles/aboutUsStyles';

export default function AboutUs({ onBack }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
            <Text style={styles.backText}>Kembali</Text>
          </TouchableOpacity>
          <View style={styles.iconContainer}>
            <Ionicons name="person" size={24} color="#FFFFFF" />
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.subtitle}>TENTANG KAMI</Text>
          <Text style={styles.title}>
            Tim Ahli Monitoring{'\n'}Kualitas Air.
          </Text>
          <Text style={styles.description}>
            Menjaga Kualitas Air untuk Kesehatan Masyarakat.
          </Text>
        </View>

        {/* Carousel */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.carousel}
        >
          {teamMembers.map((member) => (
            <View key={member.id} style={styles.slide}>
              <View style={styles.card}>
                {/* Image Section */}
                <View style={styles.imageSection}>
                  <Image source={member.image} style={styles.image} />
                </View>

                {/* Content Section */}
                <View style={styles.cardContent}>
                  <Text style={styles.number}>0{member.id}</Text>
                  <Text style={styles.role}>{member.name}</Text>
                  <Text style={styles.cardDescription}>{member.nim}</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Dots Indicator */}
        <View style={styles.dotsContainer}>
          {teamMembers.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index && styles.activeDot,
              ]}
            />
          ))}
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            Tim kami berkomitmen untuk menyediakan solusi monitoring kualitas air
            terbaik
          </Text>
          <Text style={styles.infoSubtext}>
            Sesuai dengan standar PERMENKES RI No. 32 Tahun 2017
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}