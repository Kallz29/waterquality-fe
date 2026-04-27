import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const DRAWER_W = 272;

export const styles = StyleSheet.create({

  /* ── Root ── */
  container: { flex: 1, backgroundColor: '#F4F9FC' },

  centerScreen: {
    flex: 1, backgroundColor: '#F4F9FC',
    justifyContent: 'center', alignItems: 'center', padding: 28,
  },

  /* ── Header ── */
  header: {
    backgroundColor: '#7CB9D8',
    paddingTop: 52,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    elevation: 3,
    shadowColor: '#4A90B8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  headerBtn: {
    width: 36, height: 36, borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center', alignItems: 'center', flexShrink: 0,
  },
  hamburgerLine: {
    width: 14, height: 1.5, backgroundColor: '#fff',
    borderRadius: 2, marginVertical: 2,
  },
  headerTextWrap: { flex: 1 },
  headerTitle: { fontSize: 15, fontWeight: '700', color: '#fff', letterSpacing: 0.2 },
  headerSub: { fontSize: 10, color: 'rgba(255,255,255,0.75)', marginTop: 1 },

  /* ── Messages ── */
  messages: { flex: 1 },
  messagesContent: { padding: 14, paddingBottom: 20, gap: 10 },

  rowUser: { flexDirection: 'row', justifyContent: 'flex-end' },
  rowAI: { flexDirection: 'row', alignItems: 'flex-end', gap: 7 },

  aiAvatar: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: '#7CB9D8',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 2, flexShrink: 0,
  },
  aiAvatarDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#fff' },

  bubble: {
    maxWidth: width * 0.72,
    borderRadius: 16,
    paddingHorizontal: 13,
    paddingVertical: 10,
  },
  bubbleUser: {
    backgroundColor: '#7CB9D8',
    borderBottomRightRadius: 4,
  },
  bubbleAI: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    borderWidth: 1, borderColor: '#DCE9F0',
  },
  bubbleTextUser: { fontSize: 13, lineHeight: 19, color: '#fff' },
  bubbleTextAI: { fontSize: 13, lineHeight: 19, color: '#1A3040' },
  timeUser: { fontSize: 9, color: 'rgba(255,255,255,0.6)', marginTop: 5, textAlign: 'right' },
  timeAI: { fontSize: 9, color: '#8BAFC0', marginTop: 5 },

  /* ── Typing ── */
  typingBubble: {
    backgroundColor: '#fff',
    borderWidth: 1, borderColor: '#DCE9F0',
    borderRadius: 16, borderBottomLeftRadius: 4,
    paddingHorizontal: 14, paddingVertical: 13,
    flexDirection: 'row', gap: 5, alignItems: 'center',
  },
  typingDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#7CB9D8' },

  /* ── Suggested ── */
  suggestedWrap: { marginTop: 4 },
  suggestedLabel: { fontSize: 11, color: '#8BAFC0', marginBottom: 9 },
  suggestedList: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  suggestedPill: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#C5DDE8',
    borderRadius: 20, paddingHorizontal: 13, paddingVertical: 7,
  },
  suggestedPillText: { fontSize: 11.5, color: '#2A7DA0', fontWeight: '500' },

  /* ── Input ── */
  inputBar: {
    backgroundColor: '#fff',
    borderTopWidth: 1, borderTopColor: '#DCE9F0',
    paddingHorizontal: 12, paddingVertical: 10,
    flexDirection: 'row', alignItems: 'flex-end', gap: 8,
  },
  input: {
    flex: 1, backgroundColor: '#F4F9FC',
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 9,
    fontSize: 13, maxHeight: 90, color: '#1A3040',
    borderWidth: 1, borderColor: '#C8DDE8',
  },
  sendBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#7CB9D8',
    justifyContent: 'center', alignItems: 'center', flexShrink: 0,
  },
  sendBtnDisabled: { opacity: 0.35 },

  /* ── Overlay ── */
  overlay: {
    position: 'absolute', top: 0, left: 0,
    width: width, height: height,
    backgroundColor: 'rgba(10,24,36,0.38)',
    zIndex: 10,
  },

  /* ── Drawer ── */
  drawer: {
    position: 'absolute', top: 0, left: 0, bottom: 0,
    width: DRAWER_W,
    backgroundColor: '#fff',
    zIndex: 11,
    elevation: 16,
    shadowColor: '#1A3040',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
  },
  drawerHead: {
    backgroundColor: '#7CB9D8',
    paddingTop: 52, paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  drawerTitle: { fontSize: 15, fontWeight: '700', color: '#fff' },
  drawerHeadRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  drawerNewBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)',
    borderRadius: 8, paddingHorizontal: 12, paddingVertical: 5,
  },
  drawerNewText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  drawerCloseBtn: {
    width: 30, height: 30, borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  drawerLabel: {
    fontSize: 9, fontWeight: '700', color: '#8BAFC0',
    letterSpacing: 0.9, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 6,
  },
  drawerList: { flex: 1, paddingHorizontal: 10, paddingBottom: 16 },

  /* ── Session Item (dengan delete) ── */
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingLeft: 11,
    paddingRight: 8,
    borderRadius: 10,
    marginBottom: 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  sessionItemActive: { backgroundColor: '#EAF4FB', borderColor: '#C5DDE8' },
  sessionItemContent: { flex: 1, paddingRight: 6 },
  sessionTitle: { fontSize: 12.5, fontWeight: '500', color: '#3A6070', marginBottom: 3, lineHeight: 16 },
  sessionTitleActive: { fontWeight: '700', color: '#155272' },
  sessionDate: { fontSize: 10, color: '#8BAFC0' },
  sessionDeleteBtn: {
    width: 28, height: 28, borderRadius: 8,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'transparent',
    flexShrink: 0,
  },
  sessionEmpty: { fontSize: 12, color: '#8BAFC0', textAlign: 'center', marginTop: 20 },

  /* ── Error / Loading ── */
  loadingText: { marginTop: 10, color: '#8BAFC0', fontSize: 13 },
  errorIconWrap: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: '#EAF4FB',
    justifyContent: 'center', alignItems: 'center', marginBottom: 14,
  },
  errorTitle: { fontSize: 15, fontWeight: '700', color: '#1A3040', marginBottom: 6, textAlign: 'center' },
  errorDesc: { fontSize: 12, color: '#8BAFC0', textAlign: 'center', marginBottom: 20, lineHeight: 18 },
  retryBtn: { backgroundColor: '#7CB9D8', paddingHorizontal: 28, paddingVertical: 12, borderRadius: 10 },
  retryText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  errorBack: { color: '#8BAFC0', fontSize: 13 },
});