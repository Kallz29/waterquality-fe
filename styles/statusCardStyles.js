import { StyleSheet } from 'react-native';

export const statusCardStyles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    gap: 20,
    position: 'relative',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    color: '#111827',
    fontWeight: '600',
    marginBottom: 4,
  },
  status: {
    fontSize: 16,
    color: '#16A34A',
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#22C55E',
    borderRadius: 4,
  },
  scoreContainer: {
    alignItems: 'center',
  },
  score: {
    fontSize: 28,
    color: '#111827',
    fontWeight: '600',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
});
