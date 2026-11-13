import { moderateScale, scale, verticalScale } from '@/Util/Scale';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OnboardingButtons } from './components/OnboardingButtons';
import { OnboardingHero } from './components/OnboardingHero';
import { ONBOARDING_COLORS, ONBOARDING_GRADIENTS } from './constants';

export const OnboardingScreen: React.FC = () => {
  const handleSignIn = () => {
    // Navigate to Sign In screen
  };

  const handleSignUp = () => {
    // Navigate to Sign Up screen
  };

  return (
    <LinearGradient
      colors={ONBOARDING_GRADIENTS.screenBackground}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.fullScreen}
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.contentContainer}>
          {/* Top Hero Section with Floating Visual Cards */}
          <OnboardingHero />

          {/* Bottom Section: Text Details & Buttons flowing over the gradient */}
          <View style={styles.bottomSection}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>
                Navigate Your Work Journey Efficient & Easy
              </Text>
              <Text style={styles.subtitle}>
                Increase your work management & career development radically
              </Text>
            </View>

            <View style={styles.actionContainer}>
              <OnboardingButtons
                onSignIn={handleSignIn}
                onSignUp={handleSignUp}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: verticalScale(16),
  },
  bottomSection: {
    width: '100%',

    backgroundColor: 'transparent',
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: scale(24),
  },
  title: {
    fontSize: moderateScale(26),
    fontWeight: '700',
    color: ONBOARDING_COLORS.textPrimary,
    textAlign: 'center',
    lineHeight: verticalScale(34),
    marginBottom: verticalScale(10),
  },
  subtitle: {
    fontSize: moderateScale(14),
    color: ONBOARDING_COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: verticalScale(21),
    paddingHorizontal: scale(10),
  },
  actionContainer: {
    width: '100%',
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(24),
  },
});

export default OnboardingScreen;
