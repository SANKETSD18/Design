import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { VideoView } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { usePip } from '../../Context/PipContext';
import { s, vs, ms } from '../../Util/Scale';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MINI_HEIGHT = vs(66);
const BOTTOM_OFFSET = vs(10);

const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);

export default function PortraitScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { currentVideo, player, minimizePlayer } = usePip();

  // Normalized 0 to 1 drag progress (0% = Full screen, 100% = Docked at PiP position)
  const progress = useSharedValue<number>(0);

  // Exact distance from 0% (top) to 100% (mini PiP dock at bottom)
  const targetDistance = SCREEN_HEIGHT - insets.bottom - MINI_HEIGHT - BOTTOM_OFFSET;

  const handleMinimize = () => {
    minimizePlayer();
    router.back();
  };

  // Option 2 Pan Gesture (wrapping Top Header + Video Player)
  const panGesture = Gesture.Pan()
    .activeOffsetY(10)
    .onUpdate((e) => {
      if (e.translationY > 0) {
        // Calculate progress from 0% (0) to 100% (1)
        progress.value = Math.min(e.translationY / targetDistance, 1);
      }
    })
    .onEnd((e) => {
      // 50% Rule: If dragged past 50% or flicked downwards with velocity
      if (progress.value > 0.5 || e.velocityY > 700) {
        // Complete the remaining drag to 100% smoothly
        progress.value = withTiming(1, { duration: 220 }, () => {
          runOnJS(handleMinimize)();
        });
      } else {
        // If 50% or less, snap back to 0% (Full Screen)
        progress.value = withSpring(0, {
          damping: 18,
          stiffness: 150,
        });
      }
    });

  const animatedScreenStyle = useAnimatedStyle(() => {
    const translateY = progress.value * targetDistance;
    const scale = interpolate(progress.value, [0, 1], [1, 0.94], Extrapolation.CLAMP);
    const borderRadius = interpolate(progress.value, [0, 1], [0, s(16)], Extrapolation.CLAMP);

    return {
      transform: [
        { translateY },
        { scale },
      ],
      borderRadius,
      overflow: 'hidden',
    };
  });

  const animatedDetailsStyle = useAnimatedStyle(() => {
    const opacity = interpolate(progress.value, [0, 0.5], [1, 0], Extrapolation.CLAMP);
    return {
      opacity,
    };
  });

  if (!currentVideo) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No video selected</Text>
          <TouchableOpacity
            style={styles.backHomeButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backHomeText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <AnimatedSafeAreaView
      style={[styles.safeContainer, animatedScreenStyle]}
      edges={['top', 'left', 'right']}
    >
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Option 2: Gesture on Top Header + Video Player */}
      <GestureDetector gesture={panGesture}>
        <View style={styles.topDraggableSection}>
          {/* Top Header with Back / PiP Minimize Icon */}
          <View style={styles.topHeader}>
            <TouchableOpacity
              style={styles.headerIconButton}
              onPress={handleMinimize}
              hitSlop={{ top: vs(12), bottom: vs(12), left: s(12), right: s(12) }}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-down" size={s(26)} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {currentVideo.title}
            </Text>
            <TouchableOpacity
              style={styles.headerIconButton}
              hitSlop={{ top: vs(12), bottom: vs(12), left: s(12), right: s(12) }}
            >
              <Ionicons name="ellipsis-vertical" size={s(20)} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Video Player at Top */}
          <View style={styles.videoContainer}>
            <VideoView
              player={player}
              style={styles.videoPlayer}
              contentFit="cover"
              nativeControls
              allowsFullscreen
              allowsPictureInPicture
            />
          </View>

          {/* Subtle Pull-Down Drag Bar Hint */}
          <View style={styles.dragPillWrapper}>
            <View style={styles.dragPillIndicator} />
          </View>
        </View>
      </GestureDetector>

      {/* Video Details & Description Scrollable Section */}
      <Animated.ScrollView
        style={[styles.detailsScroll, animatedDetailsStyle]}
        contentContainerStyle={styles.detailsContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text style={styles.videoTitle}>{currentVideo.title}</Text>

        {/* Views & Timestamp */}
        <Text style={styles.metaText}>
          {currentVideo.views} • {currentVideo.timestamp}
        </Text>

        {/* Channel Row */}
        <View style={styles.channelRow}>
          <View style={styles.channelAvatar}>
            <Text style={styles.avatarText}>{currentVideo.channel[0]}</Text>
          </View>
          <View style={styles.channelInfo}>
            <Text style={styles.channelName}>{currentVideo.channel}</Text>
            <Text style={styles.subscriberCount}>2.45M subscribers</Text>
          </View>
          <TouchableOpacity style={styles.subscribeButton} activeOpacity={0.8}>
            <Text style={styles.subscribeText}>Subscribe</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Action Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.actionRow}
        >
          <View style={styles.likeDislikePill}>
            <TouchableOpacity style={styles.likeButton}>
              <Ionicons name="thumbs-up-outline" size={s(18)} color="#FFFFFF" />
              <Text style={styles.actionPillText}>128K</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.dislikeButton}>
              <Ionicons name="thumbs-down-outline" size={s(18)} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.actionPill}>
            <Ionicons name="share-social-outline" size={s(18)} color="#FFFFFF" />
            <Text style={styles.actionPillText}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionPill}>
            <Ionicons name="download-outline" size={s(18)} color="#FFFFFF" />
            <Text style={styles.actionPillText}>Download</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionPill}>
            <Ionicons name="bookmark-outline" size={s(18)} color="#FFFFFF" />
            <Text style={styles.actionPillText}>Save</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Description Box */}
        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionHeader}>Description</Text>
          <Text style={styles.descriptionBody}>
            Experience stunning cinematography and visual storytelling in this featured showcase.
            High bitrate streaming powered by expo-video with seamless Picture-in-Picture capability.
          </Text>
          <View style={styles.tagRow}>
            <Text style={styles.tagText}>#Trending</Text>
            <Text style={styles.tagText}>#Cinematic</Text>
            <Text style={styles.tagText}>#4KUltraHD</Text>
          </View>
        </View>
      </Animated.ScrollView>
    </AnimatedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: s(20),
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: ms(16),
    fontWeight: '600',
  },
  backHomeButton: {
    marginTop: vs(16),
    backgroundColor: '#FF0000',
    paddingHorizontal: s(20),
    paddingVertical: vs(10),
    borderRadius: s(8),
  },
  backHomeText: {
    color: '#FFFFFF',
    fontSize: ms(14),
    fontWeight: '700',
  },
  topDraggableSection: {
    backgroundColor: '#0F0F0F',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(12),
    paddingVertical: vs(8),
    backgroundColor: '#0F0F0F',
  },
  headerIconButton: {
    padding: s(6),
  },
  headerTitle: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: ms(14),
    fontWeight: '600',
    marginHorizontal: s(12),
  },
  videoContainer: {
    width: '100%',
    height: vs(220),
    backgroundColor: '#000000',
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
  },
  dragPillWrapper: {
    width: '100%',
    paddingVertical: vs(6),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F0F0F',
  },
  dragPillIndicator: {
    width: s(40),
    height: vs(4),
    borderRadius: s(2),
    backgroundColor: '#404040',
  },
  detailsScroll: {
    flex: 1,
  },
  detailsContent: {
    paddingHorizontal: s(16),
    paddingTop: vs(8),
    paddingBottom: vs(40),
  },
  videoTitle: {
    color: '#FFFFFF',
    fontSize: ms(18),
    fontWeight: '700',
    lineHeight: vs(24),
  },
  metaText: {
    color: '#AAAAAA',
    fontSize: ms(12),
    marginTop: vs(6),
  },
  channelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(16),
    paddingBottom: vs(14),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#262626',
  },
  channelAvatar: {
    width: s(40),
    height: s(40),
    borderRadius: s(20),
    backgroundColor: '#E50914',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: ms(16),
    fontWeight: '700',
  },
  channelInfo: {
    flex: 1,
    marginLeft: s(12),
  },
  channelName: {
    color: '#FFFFFF',
    fontSize: ms(14),
    fontWeight: '700',
  },
  subscriberCount: {
    color: '#AAAAAA',
    fontSize: ms(11),
    marginTop: vs(2),
  },
  subscribeButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: s(16),
    paddingVertical: vs(8),
    borderRadius: s(20),
  },
  subscribeText: {
    color: '#000000',
    fontSize: ms(13),
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(14),
    gap: s(10),
  },
  likeDislikePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#272727',
    borderRadius: s(20),
    paddingHorizontal: s(14),
    paddingVertical: vs(8),
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
  },
  divider: {
    width: s(1),
    height: vs(16),
    backgroundColor: '#404040',
    marginHorizontal: s(10),
  },
  dislikeButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#272727',
    borderRadius: s(20),
    paddingHorizontal: s(14),
    paddingVertical: vs(8),
    gap: s(6),
  },
  actionPillText: {
    color: '#FFFFFF',
    fontSize: ms(12),
    fontWeight: '600',
  },
  descriptionCard: {
    backgroundColor: '#222222',
    borderRadius: s(12),
    padding: s(14),
    marginTop: vs(8),
  },
  descriptionHeader: {
    color: '#FFFFFF',
    fontSize: ms(13),
    fontWeight: '700',
    marginBottom: vs(6),
  },
  descriptionBody: {
    color: '#CCCCCC',
    fontSize: ms(12),
    lineHeight: vs(18),
  },
  tagRow: {
    flexDirection: 'row',
    gap: s(8),
    marginTop: vs(10),
  },
  tagText: {
    color: '#3EA6FF',
    fontSize: ms(11),
    fontWeight: '600',
  },
});
