import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, Animated, Modal, Image, ActivityIndicator,
} from 'react-native';
import { colors } from '../constants/colors';
import { styles } from '../styles/aiAssistantStyles';
import {
  createChatSession,
  getAllChatSessions,
  getChatMessages,
  sendChatMessage,
} from '../services/api';
 
// Hapus formatting Markdown supaya tidak muncul sebagai bintang-bintang di React Native
const stripMarkdown = (text) => {
  if (!text) return '';
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')   // **bold** → bold
    .replace(/\*(.+?)\*/g, '$1')        // *italic* → italic
    .replace(/^[\*\-] /gm, '• ')        // * bullet / - bullet → •
    .replace(/#+\s/g, '')               // ## heading → heading
    .replace(/`(.+?)`/g, '$1')          // `code` → code
    .trim();
};
 
const AIAssistant = ({ onBack }) => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Halo! Saya asisten AI UniFlow. Saya siap membantu Anda dengan pertanyaan seputar kualitas air, parameter monitoring, dan standar PERMENKES. Ada yang bisa saya bantu?',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);
  // FIX: Tambah state error supaya user tahu kalau koneksi gagal
  const [sessionError, setSessionError] = useState(null);
  const scrollViewRef = useRef(null);
  const typingAnimation = useRef(new Animated.Value(0)).current;
 
  const suggestedQuestions = [
    'Apa standar pH air minum yang aman?',
    'Berapa suhu air yang ideal?',
    'Apa itu TDS dan berapa batas amannya?',
    'Bagaimana cara mengukur kekeruhan air?',
  ];
 
  useEffect(() => {
    initSession();
  }, []);
 
  const initSession = async () => {
    try {
      setLoadingSession(true);
      setSessionError(null);
 
      const sessionsRes = await getAllChatSessions();
      const sessions = sessionsRes.data || [];
 
      let sessionId;
      if (sessions.length > 0) {
        sessionId = sessions[0].id;
        const msgRes = await getChatMessages(sessionId);
        const msgs = (msgRes.data || []).flatMap((item) => [
          { id: `u-${item.id}`, text: item.user_message, sender: 'user', timestamp: new Date(item.created_at) },
          { id: `a-${item.id}`, text: stripMarkdown(item.ai_response), sender: 'ai', timestamp: new Date(item.created_at) },
        ]);
        if (msgs.length > 0) setMessages(msgs);
      } else {
        const newSession = await createChatSession('Sesi Baru');
        // FIX: Backend return { data: { id: ... } }
        sessionId = newSession.data.id;
      }
 
      setCurrentSessionId(sessionId);
 
      setChatHistory(sessions.map((s) => ({
        id: s.id,
        date: new Date(s.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
        preview: s.title || 'Sesi Chat',
      })));
    } catch (err) {
      console.error('Init session error:', err.message);
      // FIX: Simpan error supaya bisa ditampilkan & ada tombol retry
      setSessionError(err.message);
    } finally {
      setLoadingSession(false);
    }
  };
 
  const loadSession = async (sessionId) => {
    try {
      setShowHistory(false);
      setCurrentSessionId(sessionId);
      const msgRes = await getChatMessages(sessionId);
      const msgs = (msgRes.data || []).flatMap((item) => [
        { id: `u-${item.id}`, text: item.user_message, sender: 'user', timestamp: new Date(item.created_at) },
        { id: `a-${item.id}`, text: stripMarkdown(item.ai_response), sender: 'ai', timestamp: new Date(item.created_at) },
      ]);
      setMessages(msgs.length > 0 ? msgs : [{
        id: '1', text: 'Halo! Ada yang bisa saya bantu?', sender: 'ai', timestamp: new Date(),
      }]);
    } catch (err) {
      console.error('Load session error:', err.message);
    }
  };
 
  const newSession = async () => {
    try {
      setShowHistory(false);
      const res = await createChatSession('Sesi Baru');
      const sessionId = res.data.id;
      setCurrentSessionId(sessionId);
      setMessages([{
        id: '1',
        text: 'Halo! Saya asisten AI UniFlow. Ada yang bisa saya bantu?',
        sender: 'ai',
        timestamp: new Date(),
      }]);
      const sessionsRes = await getAllChatSessions();
      setChatHistory((sessionsRes.data || []).map((s) => ({
        id: s.id,
        date: new Date(s.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
        preview: s.title || 'Sesi Chat',
      })));
    } catch (err) {
      console.error('New session error:', err.message);
    }
  };
 
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages, isTyping]);
 
  useEffect(() => {
    if (isTyping) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnimation, { toValue: 1, duration: 600, useNativeDriver: true }),
          Animated.timing(typingAnimation, { toValue: 0, duration: 600, useNativeDriver: true }),
        ])
      ).start();
    } else {
      typingAnimation.setValue(0);
    }
  }, [isTyping]);
 
  const handleSend = async () => {
    // FIX: Guard yang lebih jelas — kalau session null, coba init ulang dulu
    if (!inputText.trim()) return;
 
    if (!currentSessionId) {
      // Kalau session belum ada, coba buat baru dulu
      try {
        const res = await createChatSession('Sesi Baru');
        setCurrentSessionId(res.data.id);
      } catch (err) {
        setMessages((prev) => [...prev, {
          id: Date.now().toString(),
          text: 'Gagal terhubung ke server. Pastikan koneksi internet kamu aktif.',
          sender: 'ai',
          timestamp: new Date(),
        }]);
        return;
      }
    }
 
    const userText = inputText.trim();
    const userMessage = {
      id: Date.now().toString(),
      text: userText,
      sender: 'user',
      timestamp: new Date(),
    };
 
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
 
    try {
      const res = await sendChatMessage(currentSessionId, userText);
      // FIX: Backend return { ai_response: "..." } di root, bukan di res.data
      const aiText = stripMarkdown(res.ai_response || res.data?.ai_response || 'Maaf, tidak ada respons dari AI.');
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: aiText,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: `Maaf, terjadi kesalahan: ${err.message}`,
          sender: 'ai',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };
 
  const handleSuggestedQuestion = (question) => setInputText(question);
 
  const formatTime = (date) =>
    date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
 
  const TypingIndicator = () => (
    <View style={styles.typingContainer}>
      <View style={styles.typingBubble}>
        <View style={styles.typingDotsContainer}>
          {[0, 1, 2].map((i) => (
            <Animated.View
              key={i}
              style={[styles.typingDot, {
                opacity: typingAnimation.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: i === 0 ? [0.3, 1, 0.3] : i === 1 ? [0.3, 0.3, 1] : [1, 0.3, 0.3],
                }),
              }]}
            />
          ))}
        </View>
      </View>
    </View>
  );
 
  // FIX: Kalau loading session gagal, tampilkan error + tombol retry
  if (loadingSession) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#22C55E" />
        <Text style={{ marginTop: 8, color: '#6B7280' }}>Memuat sesi chat...</Text>
      </View>
    );
  }
 
  if (sessionError) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 24 }]}>
        <Text style={{ fontSize: 32, marginBottom: 12 }}>⚠️</Text>
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#DC2626', marginBottom: 8 }}>
          Gagal terhubung ke server
        </Text>
        <Text style={{ fontSize: 13, color: '#6B7280', textAlign: 'center', marginBottom: 20 }}>
          {sessionError}
        </Text>
        <TouchableOpacity
          onPress={initSession}
          style={{ backgroundColor: '#22C55E', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 }}
        >
          <Text style={{ color: '#fff', fontWeight: '700' }}>Coba Lagi</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onBack} style={{ marginTop: 12 }}>
          <Text style={{ color: '#6B7280' }}>← Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }
 
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setShowHistory(true)} style={styles.hamburgerButton}>
          <Text style={styles.hamburgerIcon}>☰</Text>
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          {/* FIX: Hapus uri web yang tidak valid, pakai asset lokal */}
          <Image
            source={require('../assets/icon.png')}
            style={styles.logoImage}
          />
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>UniFlow</Text>
          <Text style={styles.headerSubtitle}>Siap membantu Anda menjaga kualitas air</Text>
        </View>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
      </View>
 
      {/* History Modal */}
      <Modal visible={showHistory} animationType="slide" transparent onRequestClose={() => setShowHistory(false)}>
        <View style={styles.historyModalOverlay}>
          <TouchableOpacity style={styles.historyModalBackground} activeOpacity={1} onPress={() => setShowHistory(false)} />
          <View style={styles.historyModalContent}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyTitle}>Riwayat Chat</Text>
              <TouchableOpacity onPress={newSession} style={{ marginRight: 8 }}>
                <Text style={{ color: '#22C55E', fontWeight: '600' }}>+ Baru</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowHistory(false)} style={styles.historyCloseButton}>
                <Text style={styles.historyCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.historyList}>
              {chatHistory.length > 0 ? chatHistory.map((item) => (
                <TouchableOpacity key={item.id} style={styles.historyItem} onPress={() => loadSession(item.id)}>
                  <Text style={styles.historyItemPreview}>{item.preview}</Text>
                  <Text style={styles.historyItemDate}>{item.date}</Text>
                </TouchableOpacity>
              )) : (
                <Text style={styles.historyEmptyText}>Belum ada riwayat chat</Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
 
      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[styles.messageRow, message.sender === 'user' ? styles.messageRowUser : styles.messageRowAI]}
          >
            <View style={[styles.messageBubble, message.sender === 'user' ? styles.messageBubbleUser : styles.messageBubbleAI]}>
              <Text style={[styles.messageText, message.sender === 'user' ? styles.messageTextUser : styles.messageTextAI]}>
                {message.text}
              </Text>
              <Text style={[styles.messageTime, message.sender === 'user' ? styles.messageTimeUser : styles.messageTimeAI]}>
                {formatTime(message.timestamp)}
              </Text>
            </View>
          </View>
        ))}
        {isTyping && <TypingIndicator />}
        {messages.length === 1 && (
          <View style={styles.suggestedContainer}>
            <Text style={styles.suggestedTitle}>Pertanyaan yang sering diajukan:</Text>
            <View style={styles.suggestedList}>
              {suggestedQuestions.map((q, i) => (
                <TouchableOpacity key={i} onPress={() => handleSuggestedQuestion(q)} style={styles.suggestedButton}>
                  <Text style={styles.suggestedButtonText}>{q}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
 
      {/* Mascot */}
      <View style={styles.mascotContainer} pointerEvents="none">
        <View style={styles.mascotFallback}>
          <Text style={styles.mascotEmoji}>🤖</Text>
        </View>
      </View>
 
      {/* Input */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Tanyakan sesuatu..."
            placeholderTextColor={colors.text?.tertiary || '#9CA3AF'}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            onPress={handleSend}
            // FIX: Tombol aktif kalau ada teks, meskipun session belum ready (akan dibuat otomatis)
            disabled={!inputText.trim() || isTyping}
            style={[styles.sendButton, (!inputText.trim() || isTyping) && styles.sendButtonDisabled]}
          >
            <Text style={styles.sendButtonText}>➤</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
 
export default AIAssistant;