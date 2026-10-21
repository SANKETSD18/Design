import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePip, VideoData } from '../../Context/PipContext';
import { s, vs, ms } from '../../Util/Scale';
import PipPlayerSheet from './PipPlayerSheet';

export const SAMPLE_VIDEOS: VideoData[] = [
  {
    id: '1',
    title: 'Big Buck Bunny - Animated Short Film',
    channel: 'Blender Foundation',
    views: '15.4M views',
    timestamp: '2 years ago',
    url: 'https://raw.githubusercontent.com/cseitz/sample-files/main/assets/video/mp4/bbb_short.mp4',
  },
  {
    id: '2',
    title: 'Oceans - Deep Sea Nature Exploration',
    channel: 'National Exploration',
    views: '8.2M views',
    timestamp: '1 year ago',
    url: 'https://vjs.zencdn.net/v/oceans.mp4',
  },
  {
    id: '3',
    title: 'Blooming Flower - Time-lapse Nature Cinematography',
    channel: 'Nature Studio',
    views: '3.1M views',
    timestamp: '6 months ago',
    url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  },
  {
    id: '4',
    title: 'Classroom Detection - AI Tech Showcase',
    channel: 'Tech & Vision',
    views: '4.8M views',
    timestamp: '3 years ago',
    url: 'https://github.com/intel-iot-devkit/sample-videos/raw/master/classroom.mp4',
  },
];

const CATEGORIES = ['All', 'Blender', 'Animations', 'Open Source', 'Movies', '4K HDR'];

export default function PipScreen() {
  const router = useRouter();
  const { playVideo, currentVideo, isOpen } = usePip();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  return (
    <View style={styles.rootWrapper}>
      <SafeAreaView style={styles.safeContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#0F0F0F" />

        {/* YouTube Style Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            hitSlop={{ top: vs(10), bottom: vs(10), left: s(10), right: s(10) }}
          >
            <Ionicons name="arrow-back" size={s(22)} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.logoRow}>
            <View style={styles.ytIconBadge}>
              <Ionicons name="play" size={s(12)} color="#FFFFFF" />
            </View>
            <Text style={styles.logoText}>WatchPiP</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIconButton}>
            <Ionicons name="search" size={s(20)} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconButton}>
            <Ionicons name="notifications-outline" size={s(20)} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.profileBadge}>
            <Text style={styles.profileInitial}>S</Text>
          </View>
        </View>
      </View>

      {/* Category Pills */}
      <View style={styles.categoryContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map((item) => {
            const isSelected = selectedCategory === item;
            return (
              <TouchableOpacity
                key={item}
                style={[styles.categoryPill, isSelected && styles.categoryPillActive]}
                onPress={() => setSelectedCategory(item)}
              >
                <Text
                  style={[styles.categoryText, isSelected && styles.categoryTextActive]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Video Feed */}
      <ScrollView
        style={styles.feedScroll}
        contentContainerStyle={styles.feedContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.infoBanner}>
          <Ionicons name="information-circle-outline" size={s(18)} color="#4CA7FF" />
          <Text style={styles.infoText}>
            Tap any video to play. Drag down to minimize to PiP, and navigate anywhere in the app!
          </Text>
        </View>

        {SAMPLE_VIDEOS.map((video) => {
          const isCurrentlyPlaying = isOpen && currentVideo?.id === video.id;

          return (
            <TouchableOpacity
              key={video.id}
              style={[styles.videoCard, isCurrentlyPlaying && styles.videoCardActive]}
              activeOpacity={0.85}
              onPress={() => {
                const { width, height } = Dimensions.get('window');
                console.log('--- [VIDEO CLICKED] ---');
                console.log('Video:', video.title);
                console.log('Screen Dimensions:', { width, height });
                playVideo(video);
              }}
            >
              {/* Video Thumbnail Placeholder / Card */}
              <View style={styles.thumbnailContainer}>
                <View style={styles.thumbnailBackground}>
                  <Ionicons name="film-outline" size={s(44)} color="#444444" />
                  <View style={styles.playOverlayBadge}>
                    <Ionicons name="play" size={s(22)} color="#FFFFFF" />
                  </View>
                </View>
                <View style={styles.durationBadge}>
                  <Text style={styles.durationText}>10:53</Text>
                </View>
                {isCurrentlyPlaying && (
                  <View style={styles.playingBadge}>
                    <Text style={styles.playingBadgeText}>NOW PLAYING</Text>
                  </View>
                )}
              </View>

              {/* Video Info Row */}
              <View style={styles.videoMetaRow}>
                <View style={styles.channelAvatar}>
                  <Text style={styles.avatarInitial}>{video.channel[0]}</Text>
                </View>
                <View style={styles.metaContent}>
                  <Text style={styles.videoTitle} numberOfLines={2}>
                    {video.title}
                  </Text>
                  <Text style={styles.videoSubMeta}>
                    {video.channel} • {video.views} • {video.timestamp}
                  </Text>
                </View>
                <TouchableOpacity style={styles.moreButton}>
                  <Ionicons name="ellipsis-vertical" size={s(16)} color="#AAAAAA" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>

    {/* 0% to 100% Bottom-to-Top Portrait View & Mini PiP Dock */}
    <PipPlayerSheet />
  </View>
);
}

const styles = StyleSheet.create({
  rootWrapper: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  safeContainer: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(16),
    paddingVertical: vs(10),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#222222',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(12),
  },
  backButton: {
    padding: s(4),
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
  },
  ytIconBadge: {
    backgroundColor: '#FF0000',
    paddingHorizontal: s(6),
    paddingVertical: vs(4),
    borderRadius: s(6),
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: ms(17),
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(12),
  },
  headerIconButton: {
    padding: s(4),
  },
  profileBadge: {
    width: s(28),
    height: s(28),
    borderRadius: s(14),
    backgroundColor: '#3E51B5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: {
    color: '#FFFFFF',
    fontSize: ms(12),
    fontWeight: '700',
  },
  categoryContainer: {
    paddingVertical: vs(8),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#222222',
  },
  categoryScroll: {
    paddingHorizontal: s(14),
    gap: s(8),
  },
  categoryPill: {
    backgroundColor: '#272727',
    paddingHorizontal: s(14),
    paddingVertical: vs(6),
    borderRadius: s(16),
  },
  categoryPillActive: {
    backgroundColor: '#FFFFFF',
  },
  categoryText: {
    color: '#F1F1F1',
    fontSize: ms(12),
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#000000',
  },
  feedScroll: {
    flex: 1,
  },
  feedContent: {
    paddingBottom: vs(100),
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#162338',
    marginHorizontal: s(14),
    marginVertical: vs(12),
    padding: s(12),
    borderRadius: s(10),
    gap: s(10),
    borderWidth: 1,
    borderColor: '#1E3E66',
  },
  infoText: {
    flex: 1,
    color: '#A8D2FF',
    fontSize: ms(12),
    lineHeight: vs(16),
  },
  videoCard: {
    marginBottom: vs(18),
  },
  videoCardActive: {
    borderColor: '#FF0000',
  },
  thumbnailContainer: {
    width: '100%',
    height: vs(200),
    backgroundColor: '#1E1E1E',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailBackground: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  playOverlayBadge: {
    position: 'absolute',
    width: s(48),
    height: s(48),
    borderRadius: s(24),
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationBadge: {
    position: 'absolute',
    bottom: vs(8),
    right: s(8),
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: s(6),
    paddingVertical: vs(2),
    borderRadius: s(4),
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: ms(10),
    fontWeight: '600',
  },
  playingBadge: {
    position: 'absolute',
    top: vs(8),
    left: s(8),
    backgroundColor: '#FF0000',
    paddingHorizontal: s(8),
    paddingVertical: vs(3),
    borderRadius: s(4),
  },
  playingBadgeText: {
    color: '#FFFFFF',
    fontSize: ms(10),
    fontWeight: '800',
  },
  videoMetaRow: {
    flexDirection: 'row',
    paddingHorizontal: s(14),
    marginTop: vs(10),
  },
  channelAvatar: {
    width: s(36),
    height: s(36),
    borderRadius: s(18),
    backgroundColor: '#444444',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(12),
  },
  avatarInitial: {
    color: '#FFFFFF',
    fontSize: ms(14),
    fontWeight: '700',
  },
  metaContent: {
    flex: 1,
  },
  videoTitle: {
    color: '#FFFFFF',
    fontSize: ms(14),
    fontWeight: '600',
    lineHeight: vs(19),
  },
  videoSubMeta: {
    color: '#AAAAAA',
    fontSize: ms(11),
    marginTop: vs(4),
  },
  moreButton: {
    padding: s(4),
    marginLeft: s(6),
  },
});
