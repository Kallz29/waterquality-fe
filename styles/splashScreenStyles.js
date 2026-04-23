import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const splashScreenStyles = StyleSheet.create({

  /* ── Root ── */
  container: {
    flex: 1,
    backgroundColor: '#5AAEC8',   // satu shade lebih gelap dari header biasa
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  /* ── Background blobs (dekorasi sudut) ── */
  blobTopRight: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  blobBottomLeft: {
    position: 'absolute',
    bottom: -100,
    left: -60,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(30,80,120,0.18)',
  },

  /* ── Wave strip (bergerak horizontal di bawah) ── */
  waveStrip: {
    position: 'absolute',
    bottom: 60,
    width: width * 2,
    height: 90,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 45,
    transform: [{ scaleX: 2 }],
  },

  /* ── Ripple rings ── */
  rippleContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rippleRing: {
    position: 'absolute',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.55)',
    backgroundColor: 'transparent',
  },

  /* ── Logo area ── */
  content: {
    alignItems: 'center',
    marginBottom: 8,
  },
  logoCard: {
    width: 120,
    height: 120,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.40)',
    justifyContent: 'center',
    alignItems: 'center',
    // subtle shadow untuk depth
    shadowColor: '#1A4A6B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  logo: {
    width: 72,
    height: 72,
  },

  /* ── Text block ── */
  textBlock: {
    alignItems: 'center',
    marginTop: 32,
  },
  title: {
    fontSize: 38,
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 2,
    textShadowColor: 'rgba(20,70,110,0.25)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.80)',
    fontWeight: '500',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginTop: 6,
  },

  /* ── Divider ── */
  divider: {
    width: 40,
    height: 2,
    borderRadius: 1,
    backgroundColor: 'rgba(255,255,255,0.45)',
    marginTop: 20,
    marginBottom: 16,
  },

  /* ── Dots ── */
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  dotMid: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
});