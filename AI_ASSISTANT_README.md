# UniFlow AI Assistant - React Native

Halaman AI Assistant untuk aplikasi UniFlow versi React Native.

## 📁 Files

- `components/AIAssistant.js` - Komponen utama AI Assistant
- `styles/aiAssistantStyles.js` - Styles terpisah sesuai pattern UniFlow
- `App.js` - Updated dengan routing ke AI Assistant

## 🎯 Fitur

- ✅ Chat interface dengan message bubbles (user & AI)
- ✅ Typing indicator dengan animasi smooth
- ✅ Suggested questions untuk pertanyaan umum
- ✅ KeyboardAvoidingView untuk iOS & Android
- ✅ Auto-scroll ke message terbaru
- ✅ Max 500 karakter per message
- ✅ Bahasa Indonesia untuk semua text

## 🚀 Cara Menggunakan

### 1. Import di App.js

```javascript
import AIAssistant from './components/AIAssistant';
```

### 2. Tambahkan State & Handler

```javascript
const [currentScreen, setCurrentScreen] = useState('dashboard');

const handleNavigateToAI = () => {
  setCurrentScreen('ai-assistant');
};
```

### 3. Render Conditional

```javascript
{currentScreen === 'ai-assistant' && (
  <AIAssistant onBack={handleNavigateToDashboard} />
)}
```

### 4. Tambahkan Button di Dashboard

```javascript
import { Ionicons } from '@expo/vector-icons';

// Di Dashboard header:
<TouchableOpacity
  onPress={onNavigateToAI}
  style={styles.statusIndicator}
>
  <Ionicons name="chatbubble-ellipses" size={20} color="#FFFFFF" />
</TouchableOpacity>
```

## 🎨 Styling

Semua styles mengikuti pattern UniFlow dengan file terpisah:

```javascript
// Import di AIAssistant.js:
import { styles } from '../styles/aiAssistantStyles';

// Import di aiAssistantStyles.js:
import { colors } from '../constants/colors';
```

### Struktur Styles:

- `container` - Main container
- `header` - Header dengan back button & icon
- `messagesContainer` - ScrollView untuk messages
- `messageBubble` - Bubble untuk user & AI
- `inputContainer` - Input area di bottom
- `typingIndicator` - Animasi typing dots

## 🤖 AI Response Logic

AI menggunakan keyword matching untuk memberikan response:

```javascript
const generateAIResponse = (userMessage) => {
  const lowerMessage = userMessage.toLowerCase();
  
  // pH
  if (lowerMessage.includes('ph')) {
    return 'Berdasarkan PERMENKES RI No. 32 Tahun 2017...';
  }
  
  // Suhu
  if (lowerMessage.includes('suhu')) {
    return 'Suhu air yang ideal untuk air minum...';
  }
  
  // ... dst
};
```

### Topik yang Didukung:

- pH Level
- Suhu Air
- Padatan Terlarut (TDS)
- Kekeruhan (Turbidity)
- Standar PERMENKES
- Akurasi Sensor
- Cara Penggunaan
- Keamanan Air
- History Data

## 🔧 Kustomisasi

### Menambah AI Response:

```javascript
const generateAIResponse = (userMessage) => {
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('keyword baru')) {
    return 'Response untuk keyword baru disini';
  }
  
  // ... existing responses
};
```

### Mengubah Suggested Questions:

```javascript
const suggestedQuestions = [
  'Pertanyaan baru 1?',
  'Pertanyaan baru 2?',
  'Pertanyaan baru 3?',
  'Pertanyaan baru 4?',
];
```

### Mengubah Delay Typing:

```javascript
setTimeout(() => {
  // AI response
}, 1500); // Ubah delay disini (ms)
```

### Mengubah Warna:

Edit `/constants/colors.js`:

```javascript
export const colors = {
  primary: {
    main: '#7CB9D8', // Ubah warna primary
    // ...
  },
  // ...
};
```

## 📱 Platform Specific

### iOS:

```javascript
<KeyboardAvoidingView
  behavior="padding"
  keyboardVerticalOffset={0}
>
```

### Android:

```javascript
<KeyboardAvoidingView
  behavior="height"
  keyboardVerticalOffset={20}
>
```

### Handling:

```javascript
Platform.OS === 'ios' ? 'padding' : 'height'
```

## 🎭 Animasi

### Typing Indicator:

Menggunakan Animated API dengan 3 dots yang bounce:

```javascript
const typingAnimation = useRef(new Animated.Value(0)).current;

useEffect(() => {
  if (isTyping) {
    Animated.loop(
      Animated.sequence([
        Animated.timing(typingAnimation, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(typingAnimation, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }
}, [isTyping]);
```

### Auto Scroll:

```javascript
scrollViewRef.current?.scrollToEnd({ animated: true });
```

## 🧪 Testing

Test dengan berbagai skenario:

```javascript
// 1. Empty input
handleSend('');

// 2. Normal question
handleSend('Apa standar pH air minum?');

// 3. Long text (max 500 chars)
handleSend('Lorem ipsum dolor sit amet...');

// 4. Special characters
handleSend('pH 7.2 = aman? 😊');

// 5. Multiple messages
for (let i = 0; i < 10; i++) {
  handleSend(`Message ${i}`);
}
```

## 🚨 Common Issues

### Issue: Gap property tidak bekerja di Android

**Solution:**

```javascript
// Jangan:
<View style={{ flexDirection: 'row', gap: 12 }}>

// Gunakan:
<View style={{ flexDirection: 'row' }}>
  <View style={{ marginRight: 12 }} />
  <View />
</View>
```

### Issue: Keyboard menutupi input

**Solution:**

```javascript
// Pastikan KeyboardAvoidingView setup benar
// dan tambahkan keyboardVerticalOffset
```

### Issue: Scroll tidak smooth

**Solution:**

```javascript
// Gunakan onContentSizeChange:
<ScrollView
  onContentSizeChange={() => 
    scrollViewRef.current?.scrollToEnd({ animated: true })
  }
>
```

## 🌐 Integrasi API Real (Optional)

Untuk integrasi dengan AI API real (OpenAI, Gemini, dll):

### 1. Install dependency:

```bash
npm install axios
# atau
yarn add axios
```

### 2. Update generateAIResponse:

```javascript
import axios from 'axios';

const generateAIResponse = async (userMessage) => {
  try {
    const response = await axios.post('YOUR_AI_API_ENDPOINT', {
      message: userMessage,
      context: 'UniFlow water quality monitoring',
    }, {
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json',
      },
    });
    
    return response.data.response;
  } catch (error) {
    console.error('AI API Error:', error);
    // Fallback to mock response
    return mockResponse(userMessage);
  }
};
```

### 3. Update handleSend menjadi async:

```javascript
const handleSend = async () => {
  if (!inputText.trim()) return;
  
  // ... add user message
  
  setIsTyping(true);
  
  try {
    const aiResponseText = await generateAIResponse(inputText);
    
    const aiResponse = {
      id: (Date.now() + 1).toString(),
      text: aiResponseText,
      sender: 'ai',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, aiResponse]);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setIsTyping(false);
  }
};
```

## 📦 Dependencies

```json
{
  "dependencies": {
    "react-native": ">=0.70.0",
    "@expo/vector-icons": "^13.0.0"
  }
}
```

## 📄 License

Copyright © 2026 UniFlow Team. All rights reserved.
