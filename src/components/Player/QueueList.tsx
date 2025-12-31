import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import { useTheme } from '../../context/ThemeContext';
import { Track } from '../../store/slices/playerSlice';

interface QueueListProps {
  queue: Track[];
  currentTrack: Track | null;
  currentIndex: number;
  onReorder: (from: number, to: number) => void;
  onRemove: (index: number) => void;
  onPlay: (index: number) => void;
}

const QueueList: React.FC<QueueListProps> = ({ queue, currentTrack, currentIndex, onReorder, onRemove, onPlay }) => {
  const { colors } = useTheme();

  const renderItem = ({ item, drag, isActive, getIndex }: RenderItemParams<Track>) => {
    const index = getIndex();
    const isCurrent = index === currentIndex;

    return (
      <ScaleDecorator>
        <TouchableOpacity
          onLongPress={drag}
          disabled={isActive}
          style={[
            styles.itemContainer,
            { backgroundColor: isActive ? colors.card : colors.background },
            isCurrent && { backgroundColor: colors.primary + '20' }
          ]}
          onPress={() => onPlay(index || 0)}
        >
          <TouchableOpacity onPressIn={drag} style={styles.dragHandle}>
             <Ionicons name="menu" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
          
          <Image source={{ uri: item.coverUrl }} style={styles.cover} />
          
          <View style={styles.info}>
            <Text style={[styles.title, { color: colors.text }, isCurrent && { color: colors.primary }]} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={[styles.artist, { color: colors.textSecondary }]} numberOfLines={1}>
              {item.artist}
            </Text>
          </View>

          {isCurrent && (
             <Ionicons name="musical-notes" size={20} color={colors.primary} style={{ marginRight: 10 }} />
          )}

          <TouchableOpacity onPress={() => onRemove(index || 0)} style={styles.removeButton}>
            <Ionicons name="close" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  return (
    <DraggableFlatList
      data={queue}
      onDragEnd={({ from, to }) => onReorder(from, to)}
      keyExtractor={(item, index) => `queue-${item.id}-${index}`}
      renderItem={renderItem}
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
  },
  dragHandle: {
    padding: 10,
  },
  cover: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
  },
  artist: {
    fontSize: 12,
  },
  removeButton: {
    padding: 10,
  },
});

export default QueueList;
