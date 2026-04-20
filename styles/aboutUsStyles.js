import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const aboutUsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#7CB9D8',
    paddingTop: 48,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  titleSection: {
    paddingHorizontal: 24,
    paddingVertical: 48,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    letterSpacing: 2,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    color: '#111827',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
  },
  carousel: {
    marginBottom: 24,
  },
  slide: {
    width: width,
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  imageSection: {
    height: 300,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardContent: {
    backgroundColor: '#E8F4F8',
    padding: 32,
  },
  number: {
    fontSize: 48,
    fontWeight: '600',
    color: '#7CB9D8',
    marginBottom: 16,
  },
  role: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  cardDescription: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
  },
  activeDot: {
    width: 32,
    backgroundColor: '#7CB9D8',
  },
  infoCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderRadius: 16,
    padding: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#1E40AF',
    marginBottom: 8,
    textAlign: 'center',
  },
  infoSubtext: {
    fontSize: 12,
    color: '#2563EB',
    textAlign: 'center',
  },
});
