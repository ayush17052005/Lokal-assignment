import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MiniPlayer from '../../components/MiniPlayer/MiniPlayer';
import { useTheme } from '../../context/ThemeContext';
import { RootStackParamList } from '../../types/navigation';
import PlaylistsScreen from '../PlaylistScreen/PlaylistsScreen';
import AlbumsScreen from './TabsScreen/AlbumsScreen';
import ArtistScreen from './TabsScreen/ArtistScreen';
import SongsScreen from './TabsScreen/SongsScreen';
import SuggestionScreen from './TabsScreen/SuggestionScreen';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

type TabType = 'Suggested' | 'Songs' | 'Artists' | 'Albums';

const HomeScreen = ({ navigation }: Props) => {
  const { colors, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('Suggested');
  const [activeBottomTab, setActiveBottomTab] = useState<'Home' | 'Playlists'>('Home');

  const tabs: TabType[] = ['Suggested', 'Songs', 'Artists', 'Albums'];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Suggested':
        return <SuggestionScreen />;
      case 'Songs':
        return <SongsScreen />;
      case 'Artists':
        return <ArtistScreen />;
      case 'Albums':
        return <AlbumsScreen />;
      default:
        return <SuggestionScreen />;
    }
  };

  const renderContent = () => {
    if (activeBottomTab === 'Playlists') {
      return <PlaylistsScreen />;
    }

    return (
      <>
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={styles.tab}
              >
                <Text
                  style={[
                    styles.tabText,
                    {
                      color: activeTab === tab ? colors.primary : colors.tabInactive,
                    },
                  ]}
                >
                  {tab}
                </Text>
                {activeTab === tab && (
                  <View style={[styles.tabIndicator, { backgroundColor: colors.primary }]} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Tab Content */}
        <View style={styles.content}>
          {renderTabContent()}
        </View>
      </>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <View style={styles.headerLeft}>
          <Ionicons name="musical-notes" size={32} color={colors.primary} />
          <Text style={[styles.logo, { color: colors.text }]}>Mume</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
          <Ionicons name="search-outline" size={28} color={colors.text} />
        </TouchableOpacity>
      </View>

      {renderContent()}

      {/* Mini Player */}
      <MiniPlayer />

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => setActiveBottomTab('Home')}
        >
          <Ionicons 
            name={activeBottomTab === 'Home' ? "home" : "home-outline"} 
            size={24} 
            color={activeBottomTab === 'Home' ? colors.primary : colors.textSecondary} 
          />
          <Text style={[styles.navText, { color: activeBottomTab === 'Home' ? colors.primary : colors.textSecondary }]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="heart-outline" size={24} color={colors.textSecondary} />
          <Text style={[styles.navText, { color: colors.textSecondary }]}>Favorites</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => setActiveBottomTab('Playlists')}
        >
          <Ionicons 
            name={activeBottomTab === 'Playlists' ? "list" : "list-outline"} 
            size={24} 
            color={activeBottomTab === 'Playlists' ? colors.primary : colors.textSecondary} 
          />
          <Text style={[styles.navText, { color: activeBottomTab === 'Playlists' ? colors.primary : colors.textSecondary }]}>Playlists</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="settings-outline" size={24} color={colors.textSecondary} />
          <Text style={[styles.navText, { color: colors.textSecondary }]}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  tabsContainer: {
    paddingVertical: 12,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  tabIndicator: {
    height: 3,
    borderRadius: 2,
    marginTop: 8,
  },
  content: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
  },
  navText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default HomeScreen;
