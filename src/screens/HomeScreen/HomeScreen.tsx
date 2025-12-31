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
import SettingsModal from '../../components/Settings/SettingsModal';
import { useTheme } from '../../context/ThemeContext';
import { useAppSelector } from '../../store/hooks';
import { RootStackParamList } from '../../types/navigation';
import FavoritesScreen from '../FavoriteScreen/FavoritesScreen';
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
  const [activeBottomTab, setActiveBottomTab] = useState<'Home' | 'Playlists' | 'Favorites'>('Home');
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const { history } = useAppSelector((state) => state.library);

  const tabs: TabType[] = ['Suggested', 'Songs', 'Artists', 'Albums'];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Suggested':
        return history.length > 0 ? <SuggestionScreen onSwitchTab={setActiveTab} /> : <PlaylistsScreen />;
      case 'Songs':
        return <SongsScreen />;
      case 'Artists':
        return <ArtistScreen />;
      case 'Albums':
        return <AlbumsScreen />;
      default:
        return history.length > 0 ? <SuggestionScreen onSwitchTab={setActiveTab} /> : <PlaylistsScreen />;
    }
  };

  const renderContent = () => {
    if (activeBottomTab === 'Playlists') {
      return <PlaylistsScreen />;
    }
    if (activeBottomTab === 'Favorites') {
      return <FavoritesScreen />;
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
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => navigation.navigate('Search')} style={styles.headerIcon}>
            <Ionicons name="search-outline" size={28} color={colors.text} />
          </TouchableOpacity>
         
        </View>
      </View>

      {renderContent()}

      {/* Mini Player */}
      <MiniPlayer />

      <SettingsModal 
        isVisible={isSettingsVisible} 
        onClose={() => setIsSettingsVisible(false)} 
      />

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
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => setActiveBottomTab('Favorites')}
        >
          <Ionicons 
            name={activeBottomTab === 'Favorites' ? "heart" : "heart-outline"} 
            size={24} 
            color={activeBottomTab === 'Favorites' ? colors.primary : colors.textSecondary} 
          />
          <Text style={[styles.navText, { color: activeBottomTab === 'Favorites' ? colors.primary : colors.textSecondary }]}>Favorites</Text>
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
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => setIsSettingsVisible(true)}
        >
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  headerIcon: {
    // padding: 4,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  tabsContainer: {
    paddingVertical: 6,
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
