# Build Instructions - UniFlow React Native

> **Panduan lengkap untuk build dan download aplikasi UniFlow React Native**

---

## 📋 Prerequisites

### Required Software
1. **Node.js** (v16 atau lebih baru)
   ```bash
   node --version  # Check versi
   ```

2. **React Native CLI**
   ```bash
   npm install -g react-native-cli
   ```

3. **Android Development** (untuk APK)
   - Java JDK 11 atau lebih baru
   - Android Studio
   - Android SDK

4. **iOS Development** (untuk IPA - Mac only)
   - Xcode 13 atau lebih baru
   - CocoaPods

---

## 🚀 Setup Project

### 1. Install Dependencies
```bash
cd react-native
npm install
```

### 2. Setup Assets (Logo & Maskot)
```bash
# Buat folder assets jika belum ada
mkdir -p assets

# Copy logo dan maskot Anda ke folder assets
# Atau gunakan fallback yang sudah ada
cp /path/to/your/logo-uniflow.png ./assets/
cp /path/to/your/ai-mascot-uniflow.png ./assets/
```

### 3. Verify Code
Pastikan path di `/react-native/components/AIAssistant.js` sudah benar:
```javascript
// Line ~222 (Logo)
source={require('../assets/logo-uniflow.png')}

// Line ~278 (Maskot)
source={require('../assets/ai-mascot-uniflow.png')}
```

---

## 📱 Build untuk Android (APK)

### Development Build
```bash
cd react-native

# Start Metro bundler
npm start

# Di terminal baru, run Android
npm run android

# Atau manual:
react-native run-android
```

### Production APK

#### Step 1: Generate Signing Key
```bash
cd android/app

# Generate keystore (hanya sekali)
keytool -genkeypair -v -storetype PKCS12 \
  -keystore uniflow-release-key.keystore \
  -alias uniflow-key-alias \
  -keyalg RSA -keysize 2048 -validity 10000

# Masukkan password yang kuat dan simpan!
# Contoh: UniFlow2026SecureKey
```

#### Step 2: Configure Gradle
Edit `android/gradle.properties`, tambahkan:
```properties
UNIFLOW_UPLOAD_STORE_FILE=uniflow-release-key.keystore
UNIFLOW_UPLOAD_KEY_ALIAS=uniflow-key-alias
UNIFLOW_UPLOAD_STORE_PASSWORD=YourPasswordHere
UNIFLOW_UPLOAD_KEY_PASSWORD=YourPasswordHere
```

Edit `android/app/build.gradle`, tambahkan di dalam `android { ... }`:
```gradle
signingConfigs {
    release {
        if (project.hasProperty('UNIFLOW_UPLOAD_STORE_FILE')) {
            storeFile file(UNIFLOW_UPLOAD_STORE_FILE)
            storePassword UNIFLOW_UPLOAD_STORE_PASSWORD
            keyAlias UNIFLOW_UPLOAD_KEY_ALIAS
            keyPassword UNIFLOW_UPLOAD_KEY_PASSWORD
        }
    }
}

buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled enableProguardInReleaseBuilds
        proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
    }
}
```

#### Step 3: Build APK
```bash
cd android

# Clean previous builds
./gradlew clean

# Build release APK
./gradlew assembleRelease

# APK akan ada di:
# android/app/build/outputs/apk/release/app-release.apk
```

#### Step 4: Copy APK
```bash
# Copy ke folder yang mudah diakses
cp app/build/outputs/apk/release/app-release.apk ~/Desktop/UniFlow.apk

# Atau langsung install ke device
adb install app/build/outputs/apk/release/app-release.apk
```

---

## 🍎 Build untuk iOS (IPA - Mac Only)

### Development Build
```bash
cd react-native

# Install pods
cd ios && pod install && cd ..

# Run iOS simulator
npm run ios

# Atau untuk device spesifik:
react-native run-ios --device "iPhone 13"
```

### Production IPA

#### Step 1: Setup Xcode
```bash
# Buka project di Xcode
open ios/UniFlow.xcworkspace
```

Di Xcode:
1. Select project "UniFlow" di sidebar
2. Select target "UniFlow"
3. Tab "Signing & Capabilities"
4. Enable "Automatically manage signing"
5. Pilih Team (Apple Developer Account required)

#### Step 2: Archive
1. Di Xcode: Product → Scheme → Edit Scheme
2. Set Build Configuration ke "Release"
3. Product → Archive
4. Tunggu proses archive selesai

#### Step 3: Export IPA
1. Setelah archive selesai, window "Organizer" akan muncul
2. Klik "Distribute App"
3. Pilih method distribusi:
   - **App Store Connect** - untuk upload ke App Store
   - **Ad Hoc** - untuk testing internal
   - **Enterprise** - untuk distribusi internal perusahaan
   - **Development** - untuk testing development
4. Follow wizard, export IPA
5. IPA akan tersimpan di folder yang Anda pilih

#### Alternative: Command Line
```bash
cd ios

# Build archive
xcodebuild -workspace UniFlow.xcworkspace \
  -scheme UniFlow \
  -configuration Release \
  -archivePath ./build/UniFlow.xcarchive \
  archive

# Export IPA
xcodebuild -exportArchive \
  -archivePath ./build/UniFlow.xcarchive \
  -exportPath ./build \
  -exportOptionsPlist ExportOptions.plist
```

---

## 📦 Build Bundle (AAB) untuk Google Play

```bash
cd android

# Build Android App Bundle
./gradlew bundleRelease

# AAB akan ada di:
# android/app/build/outputs/bundle/release/app-release.aab
```

Upload AAB ke Google Play Console untuk publish.

---

## 🔧 Configuration

### App Name
Edit di:
- `android/app/src/main/res/values/strings.xml`
  ```xml
  <string name="app_name">UniFlow</string>
  ```
- `ios/UniFlow/Info.plist`
  ```xml
  <key>CFBundleDisplayName</key>
  <string>UniFlow</string>
  ```

### App Icon
1. Generate icons di: https://appicon.co/ atau https://easyappicon.com/
2. Android: Replace di `android/app/src/main/res/mipmap-*/`
3. iOS: Replace di `ios/UniFlow/Images.xcassets/AppIcon.appiconset/`

### Version Number
**Android** - `android/app/build.gradle`:
```gradle
android {
    defaultConfig {
        versionCode 1       // Increment setiap build
        versionName "1.0.0" // Semantic versioning
    }
}
```

**iOS** - `ios/UniFlow/Info.plist`:
```xml
<key>CFBundleShortVersionString</key>
<string>1.0.0</string>
<key>CFBundleVersion</key>
<string>1</string>
```

---

## 🧪 Testing APK/IPA

### Android
```bash
# Install via adb
adb install -r app-release.apk

# Check logs
adb logcat | grep ReactNative
```

### iOS
1. Open Xcode
2. Window → Devices and Simulators
3. Drag & drop IPA ke device
4. Atau gunakan TestFlight untuk beta testing

---

## 📊 Build Size Optimization

### Reduce APK Size
1. **Enable Proguard** (already configured)
2. **Remove unused resources:**
   ```gradle
   android {
       buildTypes {
           release {
               shrinkResources true
               minifyEnabled true
           }
       }
   }
   ```

3. **Enable App Bundle:**
   ```bash
   ./gradlew bundleRelease
   ```
   Upload AAB ke Play Store (auto split per architecture)

4. **Compress images:**
   ```bash
   # Optimize PNG
   optipng -o7 assets/*.png
   
   # Atau gunakan online tools
   ```

### Reduce IPA Size
1. Enable Bitcode (Xcode default)
2. Compress images
3. Remove unused resources
4. Strip debug symbols (Release config default)

---

## 🐛 Common Build Issues

### Android

**Issue: SDK not found**
```bash
# Set ANDROID_HOME
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

**Issue: Build failed - license**
```bash
cd $ANDROID_HOME/tools/bin
./sdkmanager --licenses
# Accept all licenses
```

**Issue: Metro bundler error**
```bash
# Clean cache
npm start --reset-cache
watchman watch-del-all
rm -rf node_modules && npm install
```

### iOS

**Issue: Pod install failed**
```bash
cd ios
pod deintegrate
pod install --repo-update
```

**Issue: Code signing error**
1. Check Developer Account valid
2. Check certificate di Keychain Access
3. Regenerate signing di Xcode

**Issue: Build failed - swift version**
```bash
# Update CocoaPods
sudo gem install cocoapods
cd ios && pod update
```

---

## 📤 Distribution

### Android
1. **Google Play Store:**
   - Upload AAB di https://play.google.com/console
   - Fill metadata, screenshots
   - Submit for review

2. **Direct APK:**
   - Host APK di server
   - Share download link
   - User: Enable "Install from Unknown Sources"

### iOS
1. **App Store:**
   - Upload IPA via Xcode or Application Loader
   - Fill metadata di App Store Connect
   - Submit for review

2. **TestFlight:**
   - Upload build to App Store Connect
   - Add internal/external testers
   - Share invite link

3. **Enterprise:**
   - Requires Apple Developer Enterprise Account
   - Distribute via MDM or direct download

---

## ✅ Pre-Release Checklist

- [ ] All features tested
- [ ] Logo & Maskot customized
- [ ] App name & icon configured
- [ ] Version number updated
- [ ] Build berhasil di Release mode
- [ ] Test di berbagai devices
- [ ] Check performance (CPU, memory)
- [ ] Check app size (< 50MB ideal)
- [ ] Review permissions di manifest
- [ ] Privacy policy ready (if required)
- [ ] Terms of service ready (if required)

---

## 📝 Build Command Reference

### Quick Commands

```bash
# Development
npm start                    # Start Metro
npm run android             # Run Android dev
npm run ios                 # Run iOS dev

# Production
cd android && ./gradlew assembleRelease    # Build APK
cd android && ./gradlew bundleRelease      # Build AAB
cd ios && xcodebuild ...                   # Build IPA

# Clean
npm start --reset-cache     # Clean Metro
cd android && ./gradlew clean  # Clean Android
rm -rf ios/build            # Clean iOS

# Install
adb install app-release.apk  # Install APK
```

---

## 🎯 Post-Build

### After Building APK
```bash
# Rename untuk versioning
mv app-release.apk UniFlow-v1.0.0-release.apk

# Test install
adb install -r UniFlow-v1.0.0-release.apk

# Create release notes
echo "Version 1.0.0 - Initial release" > release-notes.txt
```

### After Building IPA
1. Archive IPA dengan version number
2. Upload to TestFlight untuk beta test
3. Kumpulkan feedback dari testers
4. Fix bugs sebelum submit ke App Store

---

## 📚 Additional Resources

### Official Docs
- React Native: https://reactnative.dev/docs/signed-apk-android
- Android: https://developer.android.com/studio/build
- iOS: https://developer.apple.com/documentation/xcode

### Tools
- App Icon Generator: https://appicon.co/
- Screenshot Generator: https://screenshots.pro/
- App Store Tools: https://www.appstoreconnect.apple.com/

### Communities
- React Native Discord
- Stack Overflow: tag `react-native`
- Reddit: r/reactnative

---

## 💡 Pro Tips

1. **Automate dengan Fastlane:**
   ```bash
   gem install fastlane
   cd android && fastlane init
   cd ios && fastlane init
   ```

2. **CI/CD:**
   - GitHub Actions
   - Bitrise
   - CircleCI
   - GitLab CI

3. **Version Management:**
   - Use semantic versioning (1.0.0)
   - Tag releases di git
   - Maintain CHANGELOG.md

4. **Backup:**
   - Simpan keystore di safe place
   - Backup certificates (iOS)
   - Document passwords securely

---

## 🎉 Ready to Build!

Ikuti langkah-langkah di atas untuk build aplikasi UniFlow Anda.

**Quick Start:**
```bash
# 1. Install dependencies
cd react-native && npm install

# 2. Add your assets
# Copy logo-uniflow.png & ai-mascot-uniflow.png to assets/

# 3. Build APK
cd android && ./gradlew assembleRelease

# 4. APK ready!
# Location: android/app/build/outputs/apk/release/app-release.apk
```

Good luck! 🚀

---

**Build Guide**  
**UniFlow - Water Quality Monitoring App**  
**Platform:** React Native (Android & iOS)  
**Version:** 2.0 | **Updated:** April 14, 2026
