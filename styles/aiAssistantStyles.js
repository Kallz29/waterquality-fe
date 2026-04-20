import { StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
  
  // Header
  header: {
    backgroundColor: colors.primary.main,
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  hamburgerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  hamburgerIcon: {
    fontSize: 22,
    color: '#FFFFFF',
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  logoImage: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  headerIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerIcon: {
    fontSize: 20,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 14,
  },

  // History Modal
  historyModalOverlay: {
    flex: 1,
    flexDirection: 'row',
  },
  historyModalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  historyModalContent: {
    width: 300,
    backgroundColor: '#FFFFFF',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  historyHeader: {
    backgroundColor: colors.primary.main,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  historyCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyCloseText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  historyList: {
    flex: 1,
    padding: 16,
  },
  historyItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border.light,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  historyItemPreview: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 6,
  },
  historyItemDate: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  historyEmptyText: {
    fontSize: 14,
    color: colors.text.tertiary,
    textAlign: 'center',
    paddingVertical: 32,
  },

  // Messages
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 24,
  },
  messageRow: {
    marginBottom: 16,
    flexDirection: 'row',
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  messageRowAI: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '85%',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageBubbleUser: {
    backgroundColor: colors.primary.main,
    borderTopRightRadius: 4,
  },
  messageBubbleAI: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  messageTextUser: {
    color: '#FFFFFF',
  },
  messageTextAI: {
    color: colors.text.primary,
  },
  messageTime: {
    fontSize: 11,
    marginTop: 6,
  },
  messageTimeUser: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  messageTimeAI: {
    color: colors.text.tertiary,
  },

  // Typing Indicator
  typingContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 16,
  },
  typingBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderTopLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  typingDotsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary.main,
  },

  // Suggested Questions
  suggestedContainer: {
    marginTop: 8,
  },
  suggestedTitle: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  suggestedList: {
    gap: 10,
  },
  suggestedButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border.main,
    alignSelf: 'flex-start',
  },
  suggestedButtonText: {
    fontSize: 13,
    color: colors.primary.dark,
  },

  // Input Area
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: colors.background.main,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    maxHeight: 100,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border.main,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
  sendButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
  },

  // Maskot AI
  mascotContainer: {
    position: 'absolute',
    bottom: 80,
    right: 16,
    width: 120,
    height: 120,
  },
  mascotImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  mascotFallback: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary.light,
    borderWidth: 3,
    borderColor: colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  mascotEmoji: {
    fontSize: 36,
  },
});