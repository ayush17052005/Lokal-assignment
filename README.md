## 🛠 Tech Stack

*   **Framework:** [React Native](https://reactnative.dev/) (via [Expo SDK 52](https://expo.dev/))
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **State Management:**
    *   [Redux Toolkit](https://redux-toolkit.js.org/) (Global state for Player, Library, History).
    *   [Redux Persist](https://github.com/rt2zz/redux-persist) (Local storage persistence via AsyncStorage).
    *   [React Context API](https://react.dev/reference/react/createContext) (Theme & Audio Controller).
*   **Navigation:** [React Navigation](https://reactnavigation.org/) (Native Stack & Bottom Tabs).
*   **Audio Engine:** `expo-audio`.
*   **UI Components:**
    *   `react-native-reanimated` (Smooth animations).
    *   `react-native-gesture-handler` (Swipe and touch interactions).
    *   `react-native-draggable-flatlist` (Queue reordering).
    *   `@react-native-community/slider` (Seek bars).

## 📐 Design & Architecture

### 1. Audio Handling Strategy
The app utilizes a **Centralized Audio Context (`AudioPlayerContext`)** pattern. Instead of managing audio instances within individual screens, a global Context wraps the application root. It interfaces directly with the `expo-av` sound object and listens to Redux state changes. This ensures that the MiniPlayer, Full Screen Player, and background audio services remain perfectly synchronized regardless of the active screen.

### 2. Data Persistence & State
We employ **Redux Persist** to handle local data caching. The `library` slice (Favorites, History) and `player` slice (Last played track) are whitelisted and stored in `AsyncStorage`. This ensures that user preferences and playback state survive app restarts. The **Artist** and **Album** tabs are designed as **derived states**; they use `useMemo` to dynamically aggregate and render unique entries from the user's listening history in real-time, rather than relying on static API calls.

### 3. Queue Management System
The playback queue is managed via Redux to support complex operations. It implements index-based tracking (`currentIndex`) allowing for features like "Play Next" (array insertion), "Add to Queue" (array push), and "Drag & Drop Reordering" (array splicing). The logic automatically handles edge cases, such as removing the currently playing track or shuffling the queue while maintaining the current song's context.

