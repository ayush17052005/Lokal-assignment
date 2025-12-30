import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as NavigationBar from 'expo-navigation-bar';
import { useEffect } from 'react';
import { StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { AudioPlayerProvider } from './src/context/AudioPlayerContext';
import { ThemeProvider } from './src/context/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';
import { persistor, store } from './src/store/store';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export default function App() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Set Android navigation bar color based on theme
    if (colorScheme === 'dark') {
      NavigationBar.setBackgroundColorAsync('#1A1A1A');
      NavigationBar.setButtonStyleAsync('light');
    } else {
      NavigationBar.setBackgroundColorAsync('#FFFFFF');
      NavigationBar.setButtonStyleAsync('dark');
    }
  }, [colorScheme]);

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider>
            <AudioPlayerProvider>
              <SafeAreaProvider>
                <SafeAreaView style={styles.container} edges={['top','bottom']}>
                  <AppNavigator />
                </SafeAreaView>
              </SafeAreaProvider>
            </AudioPlayerProvider>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
