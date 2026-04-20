import React, { useEffect, useRef } from 'react';
import { View, Text, Image, Animated } from 'react-native';
import { splashScreenStyles as styles } from '../styles/splashScreenStyles';

export default function SplashScreen() {
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(-20)).current;
  const dotsAnim = useRef([
    new Animated.Value(0.3),
    new Animated.Value(0.3),
    new Animated.Value(0.3),
  ]).current;

  useEffect(() => {
    // Main animation
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Float animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: -20,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Dots animation
    dotsAnim.forEach((anim, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 500,
            delay: index * 200,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0.3,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            transform: [{ scale: scaleAnim }, { translateY: floatAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>UniFlow</Text>
        <Text style={styles.subtitle}>Monitoring Kualitas Air</Text>
        
        <View style={styles.dotsContainer}>
          {dotsAnim.map((anim, index) => (
            <Animated.View
              key={index}
              style={[styles.dot, { opacity: anim }]}
            />
          ))}
        </View>
      </Animated.View>
    </View>
  );
}