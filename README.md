# 🩸 BloodLink Donor (Mobile)

The **BloodLink Donor Mobile App** empowers everyday heroes out in the field. Built with Expo and React Native, this application allows users to discover local hospitals, receive real-time blood shortage alerts tailored to their blood type and city, and manage their donation history dynamically.

## 🚀 Key Features

* **Emergency Alerts:** Push notifications utilizing Expo Push Tokens.
* **Interactive Map:** `react-native-maps` integration pinpointing partner hospitals and calculating exact distances using the Haversine formula.
* **Smart Filtering:** Matches specific emergencies exactly with the donor's blood type.
* **Donation History:** Tracks total "Lives Saved" and donation dates.

## 🛠️ Tech Stack

* React Native
* Expo & Expo Router
* NativeWind (Tailwind CSS for React Native)
* SQLite / AsyncStorage (Local caching)
* React Native Maps

## 🏃‍♂️ Running Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start Metro Bundler:**
   ```bash
   npx expo start -c
   ```
3. Scan the generated QR code with the **Expo Go** app on your device, or press `a` to run on Android Emulator / `i` to run on iOS Simulator.

*Note: Due to native modules like `react-native-maps`, some features may require generating a custom development client using EAS Build rather than the standard Expo Go client.*

## 📦 Building via EAS

```bash
eas build -p android --profile preview
```
