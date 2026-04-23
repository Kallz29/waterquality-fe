import React, { useEffect, useRef } from 'react';
import { View, Text, Image, Animated, Easing, Dimensions } from 'react-native';
import { splashScreenStyles as styles } from '../styles/splashScreenStyles';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  // Logo entrance
  const scaleAnim   = useRef(new Animated.Value(0.3)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const floatAnim   = useRef(new Animated.Value(0)).current;

  // Text slide-up
  const titleY    = useRef(new Animated.Value(24)).current;
  const titleOpac = useRef(new Animated.Value(0)).current;
  const subY      = useRef(new Animated.Value(16)).current;
  const subOpac   = useRef(new Animated.Value(0)).current;

  // Ripple rings (3 rings)
  const ripples = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;
  const rippleOpacities = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  // Dots
  const dotsAnim = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  // Background wave
  const waveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // ── 1. Logo pop-in ──────────────────────────
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 60,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // ── 2. Text fade + slide up (staggered) ─────
    Animated.sequence([
      Animated.delay(300),
      Animated.parallel([
        Animated.timing(titleOpac, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(titleY, { toValue: 0, duration: 500, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      ]),
    ]).start();

    Animated.sequence([
      Animated.delay(500),
      Animated.parallel([
        Animated.timing(subOpac, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(subY, { toValue: 0, duration: 500, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      ]),
    ]).start();

    // ── 3. Logo float loop ───────────────────────
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -10, duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();

    // ── 4. Ripple rings ──────────────────────────
    const startRipple = (scale, opacity, delay) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(scale, { toValue: 1, duration: 2000, easing: Easing.out(Easing.ease), useNativeDriver: true }),
            Animated.sequence([
              Animated.timing(opacity, { toValue: 0.35, duration: 300, useNativeDriver: true }),
              Animated.timing(opacity, { toValue: 0, duration: 1700, useNativeDriver: true }),
            ]),
          ]),
          Animated.parallel([
            Animated.timing(scale, { toValue: 0, duration: 0, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 0, duration: 0, useNativeDriver: true }),
          ]),
        ])
      ).start();
    };

    startRipple(ripples[0], rippleOpacities[0], 800);
    startRipple(ripples[1], rippleOpacities[1], 1400);
    startRipple(ripples[2], rippleOpacities[2], 2000);

    // ── 5. Dots pulse ────────────────────────────
    Animated.sequence([
      Animated.delay(700),
      Animated.stagger(150,
        dotsAnim.map(anim =>
          Animated.loop(
            Animated.sequence([
              Animated.timing(anim, { toValue: 1, duration: 500, useNativeDriver: true }),
              Animated.timing(anim, { toValue: 0.25, duration: 500, useNativeDriver: true }),
            ])
          )
        )
      ),
    ]).start();

    // ── 6. Wave translate ────────────────────────
    Animated.loop(
      Animated.timing(waveAnim, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const RIPPLE_SIZE = 220;

  return (
    <View style={styles.container}>

      {/* ── Decorative background blobs ── */}
      <View style={styles.blobTopRight} />
      <View style={styles.blobBottomLeft} />

      {/* ── Wave strip at bottom ── */}
      <Animated.View
        style={[
          styles.waveStrip,
          {
            transform: [{
              translateX: waveAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -width],
              }),
            }],
          },
        ]}
      />

      {/* ── Ripple rings around logo ── */}
      <View style={styles.rippleContainer}>
        {ripples.map((scale, i) => (
          <Animated.View
            key={i}
            style={[
              styles.rippleRing,
              {
                width: RIPPLE_SIZE + i * 40,
                height: RIPPLE_SIZE + i * 40,
                borderRadius: (RIPPLE_SIZE + i * 40) / 2,
                opacity: rippleOpacities[i],
                transform: [{ scale: scale }],
              },
            ]}
          />
        ))}
      </View>

      {/* ── Main content ── */}
      <Animated.View
        style={[
          styles.content,
          {
            transform: [{ scale: scaleAnim }, { translateY: floatAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        {/* Logo card */}
        <View style={styles.logoCard}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </Animated.View>

      {/* ── Text block (separate so float doesn't affect it) ── */}
      <View style={styles.textBlock}>
        <Animated.Text
          style={[
            styles.title,
            { opacity: titleOpac, transform: [{ translateY: titleY }] },
          ]}
        >
          UniFlow
        </Animated.Text>
        <Animated.Text
          style={[
            styles.subtitle,
            { opacity: subOpac, transform: [{ translateY: subY }] },
          ]}
        >
          Monitoring Kualitas Air
        </Animated.Text>

        {/* Divider line */}
        <Animated.View style={[styles.divider, { opacity: subOpac }]} />

        {/* Dots */}
        <View style={styles.dotsContainer}>
          {dotsAnim.map((anim, index) => (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                index === 1 && styles.dotMid,
                { opacity: anim },
              ]}
            />
          ))}
        </View>
      </View>

    </View>
  );
}