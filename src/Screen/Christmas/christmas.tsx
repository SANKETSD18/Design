import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Image, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale, verticalScale } from '../../Util/Scale';
import { ChristmasAssets } from '../../assets/christmas';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Lottie original aspect ratio is 720:405 (16:9)
const LOTTIE_HEIGHT = (SCREEN_WIDTH * 405) / 720;
// Trimmed Icicles aspect ratio is 1024:190
const ICICLE_HEIGHT = (SCREEN_WIDTH * 190) / 1024;

// 204 frames at 30 fps = 6800ms
const ANIMATION_DURATION = 6800;
const FADE_DURATION = 400; // 400ms fade in/out
const VISIBLE_DURATION = ANIMATION_DURATION - FADE_DURATION * 2; // 6000ms

export default function ChristmasScreen() {
    const insets = useSafeAreaInsets();
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const loopFade = Animated.loop(
            Animated.sequence([
                // Fade in at the start of loop
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: FADE_DURATION,
                    useNativeDriver: true,
                }),
                // Stay fully visible while Santa crosses the moon
                Animated.delay(VISIBLE_DURATION),
                // Fade out smoothly right before Santa resets to start
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: FADE_DURATION,
                    useNativeDriver: true,
                }),
            ])
        );

        loopFade.start();

        return () => {
            loopFade.stop();
        };
    }, [fadeAnim]);

    return (
        <LinearGradient
            colors={['#740707', '#4A0202', '#220000']}
            style={styles.container}
        >
            <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
                {/* Lottie Animation wrapped in animated fade container */}
                <Animated.View style={[styles.lottieWrapper, { opacity: fadeAnim, height: LOTTIE_HEIGHT }]}>
                    <LottieView
                        source={ChristmasAssets.lottie.santaFlyingAcrossMoon}
                        autoPlay
                        loop
                        style={styles.lottie}
                        resizeMode="cover"
                    />
                </Animated.View>

                {/* Ice / Icicles border placed right below the Lottie with slight overlap */}
                <Image
                    source={ChristmasAssets.images.icicles}
                    style={[
                        styles.icicles,
                        {
                            height: ICICLE_HEIGHT,
                            marginTop: -verticalScale(8),
                        },
                    ]}
                    resizeMode="stretch"
                />
            </View>

            {/* Bottom 2x2 Grid Section (1:1 boxes with border-radius 12) */}
            <View style={[styles.gridContainer, { paddingBottom: insets.bottom + verticalScale(20) }]}>
                {/* Row 1 */}
                <View style={styles.row}>
                    <View style={styles.box} />
                    <View style={styles.box} />
                </View>

                {/* Row 2 */}
                <View style={styles.row}>
                    <View style={styles.box} />
                    <View style={styles.box} />
                </View>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        width: '100%',
        alignItems: 'center',
        position: 'relative',
    },
    lottieWrapper: {
        width: '100%',
    },
    lottie: {
        width: '100%',
        height: '100%',
    },
    icicles: {
        width: '100%',
        zIndex: 10,
    },
    gridContainer: {
        flex: 1,
        paddingHorizontal: scale(16),
        paddingTop: verticalScale(24),
        justifyContent: 'center',
        gap: scale(16),
    },
    row: {
        flexDirection: 'row',
        gap: scale(16),
    },
    box: {
        flex: 1,
        aspectRatio: 1,
        borderRadius: scale(12),
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
});
