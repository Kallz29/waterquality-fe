import { StyleSheet } from 'react-native';

export const splashScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7CB9D8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 24,
  },
  title: {
    fontSize: 36,
    color: '#FFFFFF',
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  dotsContainer: {
    flexDirection: 'row',
    marginTop: 32,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
});
