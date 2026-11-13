import { verticalScale } from '@/Util/Scale';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import onboardingAssets from '../../../assets/onboarding';

export const OnboardingHero: React.FC = () => {
  const floatAnim1 = useSharedValue(0);
  const floatAnim2 = useSharedValue(0);

  React.useEffect(() => {
    floatAnim1.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    floatAnim2.value = withRepeat(
      withSequence(
        withTiming(6, { duration: 2900, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2900, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [floatAnim1, floatAnim2]);

  const card1AnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatAnim1.value }],
  }));

  const card2AnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatAnim2.value }],
  }));

  return (
    <View style={styles.container}>
      {/* Floating Card 1: Today Task */}
      <Animated.Image
        source={onboardingAssets.todayTask}
        style={[styles.todayTaskCard]}
        resizeMode="contain"
      />

      {/* Floating Card 2: Working Period */}
      <Animated.Image
        source={onboardingAssets.workingPeriod}
        style={[styles.workingPeriodCard]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: verticalScale(60),
    height: verticalScale(440),
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: 'transparent',
  },
  todayTaskCard: {
    position: 'absolute',
    top: '10%',
    width: '80%',
    height: '60%',
    left: "4%",
    zIndex: 1,
    shadowColor: '#2D1A62',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
  },
  workingPeriodCard: {
    position: 'absolute',
    top: '35%',
    width: '80%',
    left: "15%",
    height: '70%',
    zIndex: 2,
    shadowColor: '#2D1A62',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
  },
}); 90