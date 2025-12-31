import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Modal from 'react-native-modal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';

interface SettingsModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isVisible, onClose }) => {
  const { colors, isDark, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();
  const [userName, setUserName] = useState('User');
  const [isEditingName, setIsEditingName] = useState(false);

  const permissions = [
    { id: '1', name: 'Storage Access', enabled: true, description: 'Required to play local files' },
    { id: '2', name: 'Notifications', enabled: false, description: 'For playback controls' },
    { id: '3', name: 'Background Audio', enabled: true, description: 'Play music when app is closed' },
  ];

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection={['down']}
      style={styles.modal}
      propagateSwipe={true}
      backdropOpacity={0.5}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            paddingBottom: Math.max(insets.bottom, 20),
          },
        ]}
      >
        {/* Handle Bar */}
        <View style={styles.handleBar}>
          <View style={[styles.handle, { backgroundColor: colors.textSecondary }]} />
        </View>

        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Profile Section */}
          <View style={[styles.section, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Profile</Text>
            <View style={styles.profileContainer}>
              <View style={styles.avatarContainer}>
                <Image
                  source={{ uri: 'https://picsum.photos/200' }}
                  style={styles.avatar}
                />
                <View style={[styles.editBadge, { backgroundColor: colors.primary }]}>
                  <Ionicons name="camera" size={12} color="#FFF" />
                </View>
              </View>
              <View style={styles.profileInfo}>
                {isEditingName ? (
                  <View style={styles.nameInputContainer}>
                    <TextInput
                      style={[styles.nameInput, { color: colors.text, borderBottomColor: colors.primary }]}
                      value={userName}
                      onChangeText={setUserName}
                      autoFocus
                      onBlur={() => setIsEditingName(false)}
                    />
                    <TouchableOpacity onPress={() => setIsEditingName(false)}>
                      <Ionicons name="checkmark" size={20} color={colors.primary} />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity 
                    style={styles.nameContainer} 
                    onPress={() => setIsEditingName(true)}
                  >
                    <Text style={[styles.userName, { color: colors.text }]}>{userName}</Text>
                    <Ionicons name="pencil" size={16} color={colors.textSecondary} />
                  </TouchableOpacity>
                )}
                
              </View>
            </View>
          </View>

          {/* Appearance Section */}
          <View style={[styles.section, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Appearance</Text>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Ionicons name={isDark ? "moon" : "sunny"} size={24} color={colors.text} style={styles.settingIcon} />
                <Text style={[styles.settingLabel, { color: colors.text }]}>Dark Mode</Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: '#767577', true: colors.primary }}
                thumbColor={isDark ? '#fff' : '#f4f3f4'}
              />
            </View>
          </View>

          {/* Permissions Section */}
          <View style={[styles.section, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Permissions</Text>
            {permissions.map((perm) => (
              <View key={perm.id} style={styles.permissionRow}>
                <View style={styles.permissionInfo}>
                  <Text style={[styles.permissionName, { color: colors.text }]}>{perm.name}</Text>
                  <Text style={[styles.permissionDesc, { color: colors.textSecondary }]}>{perm.description}</Text>
                </View>
                <Switch
                  value={perm.enabled}
                  disabled
                  trackColor={{ false: '#767577', true: colors.primary + '80' }}
                  thumbColor={perm.enabled ? colors.primary : '#f4f3f4'}
                />
              </View>
            ))}
          </View>

          {/* Developer Info Section */}
          <View style={[styles.section, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>About</Text>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.text }]}>Version</Text>
              <Text style={[styles.infoValue, { color: colors.textSecondary }]}>1.0.0</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.text }]}>Developer</Text>
              <Text style={[styles.infoValue, { color: colors.textSecondary }]}>Ayush</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.text }]}>Framework</Text>
              <Text style={[styles.infoValue, { color: colors.textSecondary }]}>React Native / Expo</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    height: '85%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handleBar: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nameInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nameInput: {
    fontSize: 18,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    paddingVertical: 0,
    minWidth: 100,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userStatus: {
    fontSize: 14,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  permissionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  permissionInfo: {
    flex: 1,
    paddingRight: 16,
  },
  permissionName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  permissionDesc: {
    fontSize: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  infoLabel: {
    fontSize: 16,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default SettingsModal;
