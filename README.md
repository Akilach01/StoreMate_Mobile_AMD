# StoreMate 📦  
*A Local Shop Product Catalog Mobile Application*

## 📱 Project Overview
StoreMate is a mobile application developed as the **Advanced Mobile Development final project**.  
It helps local shop owners manage their product catalog digitally with secure authentication and full CRUD functionality.

The app is built using **React Native (Expo)** for the frontend and **Firebase** for backend services such as authentication, Firestore database, and image storage.

---

## 🚀 Features
- User Authentication (Login & Register)
- Product Management (Create, Read, Update, Delete)
- Firebase Firestore integration
- Image upload using device camera/gallery
- Modern UI using Tailwind (NativeWind)
- Expo Router based navigation
- APK build using Expo EAS

---

## 🛠️ Tech Stack
- **Frontend:** React Native (Expo)
- **Navigation:** Expo Router
- **Styling:** Tailwind CSS (NativeWind)
- **Backend:** Firebase
  - Firebase Authentication
  - Firestore Database
  - Firebase Storage
- **Build Tool:** Expo EAS

---

## 📋 Prerequisites
Make sure you have the following installed:

- Node.js (LTS recommended)
- npm or yarn
- Expo CLI
- Expo Go app (on Android device)
- Firebase project (with Auth, Firestore & Storage enabled)

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone <your-github-repo-url>
cd StoreMate
2️⃣ Install dependencies
npm install
3️⃣ Firebase Configuration

Create a Firebase project and enable:

Email/Password Authentication
Firestore Database
Firebase Storage

Update the Firebase config file:
📁 services/firebase.ts

4️⃣ Run the app (Expo Go)
npx expo start or npx expo start --tunnel

app/
 ├── (auth)/
 │   ├── login.tsx
 │   └── register.tsx
 ├── (dashboard)/
 │   ├── home.tsx
 │   └── products/
 │       ├── index.tsx
 │       ├── add.tsx
 │       └── edit/[id].tsx
 ├── _layout.tsx
 └── index.tsx

context/
 └── AuthContext.tsx

services/
 ├── firebase.ts
 └── productService.ts


📦 APK Build (Expo EAS)

To generate an APK file:

npx expo prebuild
npx expo run:android

Or using EAS:

npx expo install expo-dev-client
npx expo prebuild
npx expo run:android
