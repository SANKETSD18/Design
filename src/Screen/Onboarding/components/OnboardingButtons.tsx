import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { scale, verticalScale, moderateScale } from '@/Util/Scale';
import { ONBOARDING_COLORS, ONBOARDING_GRADIENTS } from '../constants';

interface OnboardingButtonsProps {
  onSignIn?: () => void;
  onSignUp?: () => void;
  containerStyle?: ViewStyle;
}

export const OnboardingButtons: React.FC<OnboardingButtonsProps> = ({
  onSignIn,
  onSignUp,
  containerStyle,
}) => {
  return (
    <React.Fragment>
      {/* Primary Gradient Button: Sign In */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onSignIn}
        style={[styles.buttonWrapper, containerStyle]}
      >
        <LinearGradient
          colors={ONBOARDING_GRADIENTS.primaryButton}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>Sign In</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Secondary Outlined Button: Sign Up */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onSignUp}
        style={styles.secondaryButton}
      >
        <Text style={styles.secondaryButtonText}>Sign Up</Text>
      </TouchableOpacity>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    width: '100%',
    shadowColor: '#2D1A62',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: verticalScale(14),
  },
  primaryButton: {
    width: '100%',
    height: verticalScale(50),
    borderRadius: scale(100),
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: ONBOARDING_COLORS.white,
    fontSize: moderateScale(15),
    fontWeight: '600',
    letterSpacing: scale(0.2),
  },
  secondaryButton: {
    width: '100%',
    height: verticalScale(50),
    borderRadius: scale(100),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: scale(1.5),
    borderColor: ONBOARDING_COLORS.primary,
    backgroundColor: 'transparent',
  },
  secondaryButtonText: {
    color: ONBOARDING_COLORS.primary,
    fontSize: moderateScale(15),
    fontWeight: '600',
    letterSpacing: scale(0.2),
  },
});

