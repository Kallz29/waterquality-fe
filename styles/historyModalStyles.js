import { StyleSheet, Platform } from 'react-native';

export const historyModalStyles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F0F7FB',
  },

  /* ── Header ── */
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 44,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTextWrap: {
    flex: 1,
    paddingRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 3,
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.78)',
  },
  headerBtns: {
    flexDirection: 'row',
    gap: 8,
  },
  headerBtn: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* ── List ── */
  scrollView: {
    flex: 1,
  },
  listWrap: {
    padding: 16,
    gap: 10,
  },

  /* ── Empty ── */
  emptyWrap: {
    paddingVertical: 48,
    alignItems: 'center',
    gap: 10,
  },
  emptyText: {
    fontSize: 13,
    color: '#8BAFC0',
  },

  /* ── Card ── */
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#D4E8F2',
    shadowColor: '#7CB9D8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardDate: {
    fontSize: 11,
    color: '#8BAFC0',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  value: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A3040',
    lineHeight: 30,
  },
  unit: {
    fontSize: 13,
    color: '#8BAFC0',
    fontWeight: '500',
  },
  trendPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 4,
  },
  trendText: {
    fontSize: 11,
    fontWeight: '600',
  },
});