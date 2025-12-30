import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Player from '../components/Player/Player';
import { useTheme } from '../context/ThemeContext';
import AlbumDetails from '../screens/AlbumScreen/AlbumDetails';
import ArtistDetails from '../screens/ArtistScreen/ArtistDetails';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import SearchScreen from '../screens/SearchScreen/SearchScreen';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { colors } = useTheme();

  return (
    <NavigationContainer
      theme={{
        dark: false,
        colors: {
          primary: colors.primary,
          background: 'transparent',
          card: colors.background,
          text: colors.text,
          border: colors.border,
          notification: colors.primary,
        },
        fonts: {
          regular: {
            fontFamily: 'System',
            fontWeight: '400',
          },
          medium: {
            fontFamily: 'System',
            fontWeight: '500',
          },
          bold: {
            fontFamily: 'System',
            fontWeight: '700',
          },
          heavy: {
            fontFamily: 'System',
            fontWeight: '900',
          },
        },
      }}
    >
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
        />

        <Stack.Screen 
          name="Player" 
          component={Player}
          options={{ animation: 'slide_from_bottom' }}
        />
        
        <Stack.Screen 
          name="ArtistDetails" 
          component={ArtistDetails}
          options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
            name="AlbumDetails"
            component={AlbumDetails}
        />
        
        <Stack.Screen 
          name="Search" 
          component={SearchScreen}
        
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
