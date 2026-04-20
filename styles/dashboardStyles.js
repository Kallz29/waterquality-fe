import { StyleSheet } from 'react-native';

export const dashboardStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#7CB9D8',
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 56,
    height: 56,
  },
  headerTitle: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statusIndicator: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusSection: {
    paddingHorizontal: 24,
    marginTop: -24,
    marginBottom: 24,
  },
  metricsSection: {
    paddingHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#1F2937',
    fontWeight: '600',
  },
  updateTime: {
    fontSize: 14,
    color: '#6B7280',
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  infoSection: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  infoCard: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderRadius: 16,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoDot: {
    width: 8,
    height: 8,
    backgroundColor: '#3B82F6',
    borderRadius: 4,
    marginRight: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#1E40AF',
  },
  infoSubtext: {
    fontSize: 12,
    color: '#2563EB',
  },
});
