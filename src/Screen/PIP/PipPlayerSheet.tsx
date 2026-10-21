import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  StatusBar,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  interpolateColor,
  Extrapolation,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { VideoView } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';
import { usePip } from '../../Context/PipContext';
import { s, vs, ms } from '../../Util/Scale';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const FULL_VIDEO_HEIGHT = vs(220);
const MINI_HEIGHT = vs(66);
const MINI_WIDTH = SCREEN_WIDTH - s(20);
const MINI_VIDEO_WIDTH = s(105);
const MINI_VIDEO_HEIGHT = vs(58);
const MINI_LEFT = s(10);
const MINI_RADIUS = s(14);
const VIDEO_RADIUS = s(8);
const VIDEO_TOP_MINI = vs(4);
const VIDEO_LEFT_MINI = s(4);
const DISMISS_SWIPE_THRESHOLD = s(110);
const BOTTOM_OFFSET = vs(10);

const SPRING_CONFIG = {
  damping: 20,
  stiffness: 145,
  mass: 0.9,
};

export default function PipPlayerSheet() {
  const insets = useSafeAreaInsets();
  const {
    currentVideo,
    isOpen,
    isMinimized,
    expandPlayer,
    closePlayer,
    setIsMinimized,
    player,
  } = usePip();

  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // progress: 0 = Full Screen Portrait (0%), 1 = Mini PiP Dock at Bottom (100%)
  const progress = useSharedValue<number>(0);
  const translateYAnim = useSharedValue<number>(SCREEN_HEIGHT);
  const miniTranslateX = useSharedValue<number>(0);

  const targetTranslateY = SCREEN_HEIGHT - insets.bottom - MINI_HEIGHT - BOTTOM_OFFSET;

  // Bottom-to-Top slide up on initial video click
  useEffect(() => {
    if (isOpen && currentVideo) {
      if (isMinimized) {
        progress.value = withSpring(1, SPRING_CONFIG);
        translateYAnim.value = withSpring(targetTranslateY, SPRING_CONFIG);
      } else {
        // Slide up from bottom (SCREEN_HEIGHT) to top (0) 100% full screen
        translateYAnim.value = withSpring(0, SPRING_CONFIG);
        progress.value = withSpring(0, SPRING_CONFIG);
        miniTranslateX.value = 0;
      }
    } else {
      translateYAnim.value = withTiming(SCREEN_HEIGHT, { duration: 250 });
      progress.value = 0;
    }
  }, [isOpen, isMinimized, currentVideo]);

  const togglePlayPause = () => {
    if (!player) return;
    if (isPlaying) {
      player.pause();
      setIsPlaying(false);
    } else {
      player.play();
      setIsPlaying(true);
    }
  };

  const handleClose = () => {
    closePlayer();
  };

  const handleTapExpand = () => {
    console.log('--- [EXPAND MINI PLAYER CLICKED] ---');
    console.log('Target Dimensions:', {
      fullScreenWidth: SCREEN_WIDTH,
      fullScreenHeight: SCREEN_HEIGHT,
      fullVideoHeight: FULL_VIDEO_HEIGHT,
    });

    progress.value = withSpring(0, SPRING_CONFIG);
    translateYAnim.value = withSpring(0, SPRING_CONFIG);
    setIsMinimized(false);
    expandPlayer();
  };

  const handleButtonMinimize = () => {
    console.log('--- [MINIMIZE BUTTON CLICKED] ---');
    console.log('Target Dimensions:', {
      fullWidth: SCREEN_WIDTH,
      fullHeight: SCREEN_HEIGHT,
      miniDockWidth: MINI_WIDTH,
      miniDockHeight: MINI_HEIGHT,
      miniVideoWidth: MINI_VIDEO_WIDTH,
      miniVideoHeight: MINI_VIDEO_HEIGHT,
    });

    progress.value = withSpring(1, SPRING_CONFIG);
    translateYAnim.value = withSpring(targetTranslateY, SPRING_CONFIG);
    setIsMinimized(true);
  };

  // Option 2 Pan Gesture on Header + Video (0-100% calculation with 50% release rule)
  const panGesture = Gesture.Pan()
    .activeOffsetY(10)
    .enabled(isOpen && !isMinimized)
    .onUpdate((e) => {
      if (e.translationY > 0) {
        // Normalized drag progress: 0 (top) to 1 (bottom dock)
        progress.value = Math.min(e.translationY / targetTranslateY, 1);
        translateYAnim.value = e.translationY;
      }
    })
    .onEnd((e) => {
      // 50% Rule: If dragged past 50% or flicked downwards
      if (progress.value > 0.5 || e.velocityY > 700) {
        progress.value = withTiming(1, { duration: 200 }, () => {
          runOnJS(setIsMinimized)(true);
        });
        translateYAnim.value = withTiming(targetTranslateY, { duration: 200 });
      } else {
        // Snap back up to 0% (Full Screen)
        progress.value = withSpring(0, SPRING_CONFIG);
        translateYAnim.value = withSpring(0, SPRING_CONFIG);
        runOnJS(setIsMinimized)(false);
      }
    });

  // Swipe Dismiss Gesture on Mini Player
  const miniPanGesture = Gesture.Pan()
    .enabled(isOpen && isMinimized)
    .onUpdate((e) => {
      miniTranslateX.value = e.translationX;
    })
    .onEnd((e) => {
      if (Math.abs(e.translationX) > DISMISS_SWIPE_THRESHOLD || Math.abs(e.velocityX) > 600) {
        const direction = e.translationX > 0 ? 1 : -1;
        miniTranslateX.value = withTiming(SCREEN_WIDTH * direction, { duration: 200 }, () => {
          runOnJS(handleClose)();
        });
      } else {
        miniTranslateX.value = withSpring(0, SPRING_CONFIG);
      }
    });

  // Tap Gesture to expand Mini Player back to Full Screen
  const miniTapGesture = Gesture.Tap()
    .enabled(isOpen && isMinimized)
    .onEnd(() => {
      runOnJS(handleTapExpand)();
    });

  const miniCombinedGesture = Gesture.Race(miniPanGesture, miniTapGesture);

  // Real-time morphing styles
  const containerAnimatedStyle = useAnimatedStyle(() => {
    const width = interpolate(progress.value, [0, 1], [SCREEN_WIDTH, MINI_WIDTH], Extrapolation.CLAMP);
    const height = interpolate(progress.value, [0, 1], [SCREEN_HEIGHT, MINI_HEIGHT], Extrapolation.CLAMP);
    const left = interpolate(progress.value, [0, 1], [0, MINI_LEFT], Extrapolation.CLAMP);
    const borderRadius = interpolate(progress.value, [0, 1], [0, MINI_RADIUS], Extrapolation.CLAMP);
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 0.7, 1],
      ['#0F0F0F', '#1B1C20', '#222327']
    );

    return {
      transform: [
        { translateY: translateYAnim.value },
        { translateX: miniTranslateX.value },
      ],
      width,
      height,
      left,
      top: 0,
      borderRadius,
      backgroundColor,
    };
  });

  const videoAnimatedStyle = useAnimatedStyle(() => {
    const width = interpolate(progress.value, [0, 1], [SCREEN_WIDTH, MINI_VIDEO_WIDTH], Extrapolation.CLAMP);
    const height = interpolate(progress.value, [0, 1], [FULL_VIDEO_HEIGHT, MINI_VIDEO_HEIGHT], Extrapolation.CLAMP);
    const borderRadius = interpolate(progress.value, [0, 1], [0, VIDEO_RADIUS], Extrapolation.CLAMP);
    const marginTop = interpolate(progress.value, [0, 1], [insets.top, VIDEO_TOP_MINI], Extrapolation.CLAMP);
    const marginLeft = interpolate(progress.value, [0, 1], [0, VIDEO_LEFT_MINI], Extrapolation.CLAMP);

    return {
      width,
      height,
      borderRadius,
      marginTop,
      marginLeft,
    };
  });

  // Down Icon on Video
  const videoControlsAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(progress.value, [0, 0.15], [1, 0], Extrapolation.CLAMP);
    return {
      opacity,
      display: progress.value > 0.2 ? 'none' : 'flex',
    };
  });

  // Mini Controls on Mini PiP Dock
  const miniControlsAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(progress.value, [0.65, 1], [0, 1], Extrapolation.CLAMP);
    return {
      opacity,
      display: progress.value < 0.5 ? 'none' : 'flex',
    };
  });

  // Details Section (fades out as you drag down)
  const detailsAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(progress.value, [0, 0.25], [1, 0], Extrapolation.CLAMP);
    return {
      opacity,
      display: progress.value > 0.3 ? 'none' : 'flex',
    };
  });

  if (!isOpen || !currentVideo) {
    return null;
  }

  return (
    <View
      style={styles.sheetOverlay}
      pointerEvents={isMinimized ? 'box-none' : 'auto'}
    >
      <StatusBar barStyle="light-content" />

      {/* Morphing Full Screen to Mini PiP Sheet */}
      <Animated.View
        style={[styles.playerContainer, containerAnimatedStyle]}
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          console.log('--- [PLAYER CONTAINER LAYOUT] ---', {
            mode: isMinimized ? 'Mini PiP Dock' : 'Full Screen Portrait',
            renderedWidth: width,
            renderedHeight: height,
          });
        }}
      >
        {/* Top Section (Video + Mini Controls Side by Side in Mini Mode) */}
        <View style={styles.topRow}>
          {/* Draggable Video Area */}
          <GestureDetector gesture={panGesture}>
            <Animated.View
              style={[styles.videoWrapper, videoAnimatedStyle]}
              onLayout={(e) => {
                const { width, height } = e.nativeEvent.layout;
                console.log('--- [VIDEO VIEW LAYOUT] ---', {
                  videoWidth: width,
                  videoHeight: height,
                });
              }}
            >
              <VideoView
                player={player}
                style={styles.video}
                contentFit="cover"
                nativeControls={!isMinimized}
                allowsFullscreen={!isMinimized}
                allowsPictureInPicture
              />

              {/* In-Player Down Chevron Button */}
              <Animated.View style={[styles.playerHeaderOverlay, videoControlsAnimatedStyle]}>
                <TouchableOpacity
                  style={styles.pipDownButton}
                  onPress={handleButtonMinimize}
                  hitSlop={{ top: vs(12), bottom: vs(12), left: s(12), right: s(12) }}
                  activeOpacity={0.7}
                >
                  <View style={styles.pipDownCircle}>
                    <Ionicons name="chevron-down" size={s(24)} color="#FFFFFF" />
                  </View>
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>
          </GestureDetector>

          {/* Mini-Player Side Content (Title, Channel, Play/Close buttons) */}
          <GestureDetector gesture={miniCombinedGesture}>
            <Animated.View style={[styles.miniBarContent, miniControlsAnimatedStyle]}>
              <View style={styles.miniTextContainer}>
                <Text style={styles.miniTitle} numberOfLines={1}>
                  {currentVideo.title}
                </Text>
                <Text style={styles.miniChannel} numberOfLines={1}>
                  {currentVideo.channel}
                </Text>
              </View>

              <View style={styles.miniButtonsRow}>
                <TouchableOpacity
                  style={styles.miniIconButton}
                  onPress={togglePlayPause}
                  hitSlop={{ top: vs(10), bottom: vs(10), left: s(10), right: s(10) }}
                >
                  <Ionicons
                    name={isPlaying ? 'pause' : 'play'}
                    size={s(20)}
                    color="#FFFFFF"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.miniIconButton}
                  onPress={handleClose}
                  hitSlop={{ top: vs(10), bottom: vs(10), left: s(10), right: s(10) }}
                >
                  <Ionicons name="close" size={s(20)} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </Animated.View>
          </GestureDetector>
        </View>

        {/* Full Player Scrollable Content (Under Video) */}
        <Animated.View style={[styles.detailsContainer, detailsAnimatedStyle]}>
          <ScrollView
            style={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Drag Handle Bar to pull down to PiP */}
            <GestureDetector gesture={panGesture}>
              <View style={styles.dragHandleArea}>
                <View style={styles.dragHandleBar} />
              </View>
            </GestureDetector>

            {/* Video Details */}
            <View style={styles.metaSection}>
              <Text style={styles.videoTitle}>{currentVideo.title}</Text>
              <Text style={styles.viewCount}>
                {currentVideo.views} • {currentVideo.timestamp}
              </Text>
            </View>

            {/* Channel Info Row */}
            <View style={styles.channelRow}>
              <View style={styles.channelAvatar}>
                <Text style={styles.avatarInitial}>{currentVideo.channel[0]}</Text>
              </View>
              <View style={styles.channelMeta}>
                <Text style={styles.channelName}>{currentVideo.channel}</Text>
                <Text style={styles.subscriberCount}>2.45M subscribers</Text>
              </View>
              <TouchableOpacity style={styles.subscribeButton} activeOpacity={0.85}>
                <Text style={styles.subscribeText}>Subscribe</Text>
              </TouchableOpacity>
            </View>

            {/* Action Bar (Like, Dislike, Share, Download, Save) */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.actionPillRow}
            >
              <View style={styles.likeDislikePill}>
                <TouchableOpacity style={styles.likeButton}>
                  <Ionicons name="thumbs-up-outline" size={s(17)} color="#FFFFFF" />
                  <Text style={styles.actionText}>245K</Text>
                </TouchableOpacity>
                <View style={styles.pillDivider} />
                <TouchableOpacity style={styles.dislikeButton}>
                  <Ionicons name="thumbs-down-outline" size={s(17)} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.actionPill}>
                <Ionicons name="share-social-outline" size={s(17)} color="#FFFFFF" />
                <Text style={styles.actionText}>Share</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionPill}>
                <Ionicons name="download-outline" size={s(17)} color="#FFFFFF" />
                <Text style={styles.actionText}>Download</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionPill}>
                <Ionicons name="bookmark-outline" size={s(17)} color="#FFFFFF" />
                <Text style={styles.actionText}>Save</Text>
              </TouchableOpacity>
            </ScrollView>

            {/* Description Card */}
            <View style={styles.descriptionCard}>
              <Text style={styles.descriptionHeader}>Description</Text>
              <Text style={styles.descriptionSnippet}>
                Experience seamless 4K video streaming with continuous Picture-in-Picture playback.
                Drag downwards to dock as a floating mini player anywhere in the app!
              </Text>
            </View>
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  sheetOverlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 99999,
    elevation: 99999,
  },
  playerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: vs(4) },
    shadowOpacity: 0.45,
    shadowRadius: s(12),
    elevation: 14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  videoWrapper: {
    overflow: 'hidden',
    backgroundColor: '#000000',
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  playerHeaderOverlay: {
    position: 'absolute',
    top: vs(10),
    left: s(10),
    zIndex: 30,
  },
  pipDownButton: {
    padding: s(4),
  },
  pipDownCircle: {
    width: s(36),
    height: s(36),
    borderRadius: s(18),
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dragHandleArea: {
    width: '100%',
    paddingVertical: vs(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  dragHandleBar: {
    width: s(40),
    height: vs(4),
    borderRadius: s(2),
    backgroundColor: '#555555',
  },
  miniBarContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(8),
    justifyContent: 'space-between',
  },
  miniTextContainer: {
    flex: 1,
    marginRight: s(6),
  },
  miniTitle: {
    color: '#FFFFFF',
    fontSize: ms(13),
    fontWeight: '600',
  },
  miniChannel: {
    color: '#A0A0A0',
    fontSize: ms(11),
    marginTop: vs(2),
  },
  miniButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
  },
  miniIconButton: {
    padding: s(6),
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: s(16),
  },
  metaSection: {
    marginTop: vs(4),
  },
  videoTitle: {
    color: '#FFFFFF',
    fontSize: ms(17),
    fontWeight: '700',
    lineHeight: vs(22),
  },
  viewCount: {
    color: '#AAAAAA',
    fontSize: ms(12),
    marginTop: vs(4),
  },
  channelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(14),
  },
  channelAvatar: {
    width: s(38),
    height: s(38),
    borderRadius: s(19),
    backgroundColor: '#E50914',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: '#FFFFFF',
    fontSize: ms(15),
    fontWeight: '700',
  },
  channelMeta: {
    flex: 1,
    marginLeft: s(10),
  },
  channelName: {
    color: '#FFFFFF',
    fontSize: ms(14),
    fontWeight: '600',
  },
  subscriberCount: {
    color: '#AAAAAA',
    fontSize: ms(11),
    marginTop: vs(2),
  },
  subscribeButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: s(14),
    paddingVertical: vs(7),
    borderRadius: s(18),
  },
  subscribeText: {
    color: '#000000',
    fontSize: ms(12),
    fontWeight: '700',
  },
  actionPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(14),
    gap: s(8),
  },
  likeDislikePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#272727',
    borderRadius: s(18),
    paddingHorizontal: s(12),
    paddingVertical: vs(7),
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
  },
  pillDivider: {
    width: s(1),
    height: vs(16),
    backgroundColor: '#3E3E3E',
    marginHorizontal: s(8),
  },
  dislikeButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#272727',
    borderRadius: s(18),
    paddingHorizontal: s(12),
    paddingVertical: vs(7),
    gap: s(6),
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: ms(12),
    fontWeight: '500',
  },
  descriptionCard: {
    backgroundColor: '#202022',
    borderRadius: s(10),
    padding: s(12),
    marginTop: vs(14),
    marginBottom: vs(40),
  },
  descriptionHeader: {
    color: '#FFFFFF',
    fontSize: ms(13),
    fontWeight: '700',
    marginBottom: vs(4),
  },
  descriptionSnippet: {
    color: '#CCCCCC',
    fontSize: ms(12),
    lineHeight: vs(17),
  },
});
