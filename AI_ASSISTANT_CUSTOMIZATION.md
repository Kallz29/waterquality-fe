# AI Assistant Customization Guide - React Native

## Cara Mengganti Logo UniFlow

### Langkah 1: Siapkan File Logo
1. Pastikan logo UniFlow Anda dalam format PNG atau JPG
2. Ukuran yang direkomendasikan: 512x512 pixels atau lebih tinggi untuk kualitas terbaik
3. Background transparan (PNG) lebih disarankan

### Langkah 2: Simpan File Logo
Simpan file logo Anda di folder assets React Native dengan nama:
```
react-native/assets/logo-uniflow.png
```

### Langkah 3: Update Kode (Opsional)
Jika Anda menyimpan logo dengan nama berbeda, update di file:
**`/react-native/components/AIAssistant.js`**

Cari baris ini:
```javascript
<Image
  source={{ uri: '/logo-uniflow.png' }}
  style={styles.logoImage}
  defaultSource={require('../assets/icon.png')}
/>
```

Ganti dengan:
```javascript
<Image
  source={require('../assets/nama-logo-anda.png')}
  style={styles.logoImage}
/>
```

---

## Cara Mengganti Maskot AI UniFlow

### Langkah 1: Siapkan File Maskot
1. Format yang didukung: PNG dengan background transparan
2. Ukuran yang direkomendasikan: 512x512 pixels atau lebih tinggi
3. Desain maskot yang friendly dan relate dengan tema air/kualitas air

### Langkah 2: Simpan File Maskot
Simpan file maskot Anda di folder assets React Native dengan nama:
```
react-native/assets/ai-mascot-uniflow.png
```

### Langkah 3: Update Kode (Opsional)
Jika Anda menyimpan maskot dengan nama berbeda, update di file:
**`/react-native/components/AIAssistant.js`**

Cari baris ini:
```javascript
<Image
  source={{ uri: '/ai-mascot-uniflow.png' }}
  style={styles.mascotImage}
/>
```

Ganti dengan:
```javascript
<Image
  source={require('../assets/nama-maskot-anda.png')}
  style={styles.mascotImage}
/>
```

---

## Menyesuaikan Ukuran dan Posisi

### Ukuran Logo
Edit di **`/react-native/styles/aiAssistantStyles.js`**:
```javascript
logoContainer: {
  width: 40,    // Ubah sesuai kebutuhan
  height: 40,   // Ubah sesuai kebutuhan
  // ...
},
logoImage: {
  width: 32,    // Ukuran image di dalam container
  height: 32,   // Ukuran image di dalam container
  // ...
},
```

### Ukuran dan Posisi Maskot
Edit di **`/react-native/styles/aiAssistantStyles.js`**:
```javascript
mascotContainer: {
  position: 'absolute',
  bottom: 80,   // Jarak dari bawah
  right: 16,    // Jarak dari kanan
  width: 120,   // Lebar maskot
  height: 120,  // Tinggi maskot
},
mascotImage: {
  width: 120,   // Ukuran image
  height: 120,  // Ukuran image
  // ...
},
```

### Fallback Emoji (jika image gagal load)
```javascript
mascotFallback: {
  width: 80,    // Ukuran fallback
  height: 80,   // Ukuran fallback
  // ...
},
mascotEmoji: {
  fontSize: 36, // Ukuran emoji
},
```

---

## Tips Desain

### Logo UniFlow
- Gunakan warna yang kontras dengan background biru header
- Bentuk circular atau square dengan sudut rounded
- Simple dan mudah dikenali dalam ukuran kecil

### Maskot AI
- Desain yang friendly dan approachable
- Warna yang sesuai dengan palette biru UniFlow
- Bisa berupa: tetesan air dengan wajah, robot berwarna biru, atau karakter custom
- Pastikan tidak menutupi area input chat

---

## Troubleshooting

### Logo tidak muncul
1. Pastikan file ada di folder `react-native/assets/`
2. Pastikan path di kode sudah benar
3. Coba restart Metro bundler: `npm start --reset-cache`

### Maskot tidak muncul
1. Periksa apakah file PNG valid dan tidak corrupt
2. Gunakan background transparan untuk hasil terbaik
3. Fallback emoji (🤖) akan muncul jika image gagal load

### Image blur atau pecah
1. Gunakan resolusi lebih tinggi (minimal 512x512)
2. Export dengan kualitas tinggi dari design tool
3. Gunakan format PNG untuk transparansi

---

## Contoh Struktur Folder

```
react-native/
├── assets/
│   ├── icon.png                    (existing)
│   ├── logo-uniflow.png            (buat file ini)
│   └── ai-mascot-uniflow.png       (buat file ini)
├── components/
│   └── AIAssistant.js              (edit di sini)
└── styles/
    └── aiAssistantStyles.js        (edit styling di sini)
```

---

## Dukungan Format File

### Logo
- ✅ PNG (recommended - dengan transparansi)
- ✅ JPG (solid background)
- ❌ SVG (tidak didukung langsung, perlu convert ke PNG)

### Maskot
- ✅ PNG (recommended - dengan transparansi)
- ❌ JPG (tidak disarankan karena tidak ada transparansi)
- ❌ SVG (tidak didukung langsung, perlu convert ke PNG)

---

## Build untuk Production

Setelah mengganti logo dan maskot, pastikan untuk:

1. **Test di simulator/emulator:**
   ```bash
   npm run android
   # atau
   npm run ios
   ```

2. **Build APK/IPA untuk production:**
   ```bash
   # Android
   cd android && ./gradlew assembleRelease
   
   # iOS
   cd ios && pod install
   xcodebuild -workspace UniFlow.xcworkspace -scheme UniFlow -configuration Release
   ```

3. **Verify size file tidak terlalu besar:**
   - Logo: maksimal 100KB
   - Maskot: maksimal 200KB

---

## Kontak Support

Jika ada pertanyaan lebih lanjut tentang customization:
- Check dokumentasi React Native Image: https://reactnative.dev/docs/image
- Review kode di `/react-native/components/AIAssistant.js`
- Test perubahan di simulator sebelum build production

Happy customizing! 🎨
