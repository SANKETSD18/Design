import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import { useEffect, useRef } from 'react';
import { Animated, Dimensions, Image, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale, verticalScale } from '../../Util/Scale';
import { ChristmasAssets } from '../../assets/christmas';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Lottie native resolution is 720:405 (aspect ratio 16:9)
// SCREEN_WIDTH width lene par iski natural rendered height exactly ye banti hai:
const LOTTIE_HEIGHT = (SCREEN_WIDTH * 405) / 720;

// Trimmed Icicles aspect ratio 1024:190
const ICICLE_HEIGHT = (SCREEN_WIDTH * 190) / 1024;
// Merry Christmas text Lottie aspect ratio 970:260
const MERRY_TEXT_HEIGHT = (SCREEN_WIDTH * 260) / 970;

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

                {/* Ice / Icicles border placed exactly at the bottom of the Lottie */}
                <Image
                    source={ChristmasAssets.images.icicles}
                    style={[
                        styles.icicles,
                        {
                            top: insets.top + LOTTIE_HEIGHT - verticalScale(6),
                            height: ICICLE_HEIGHT,
                        },
                    ]}
                    resizeMode="stretch"
                />
            </View>

            {/* Merry Christmas Animated Write-On Lottie */}
            <View style={[styles.textLottieContainer, { marginTop: ICICLE_HEIGHT - verticalScale(14) }]}>
                <LottieView
                    source={ChristmasAssets.lottie.merryChristmasDraw}
                    autoPlay
                    loop
                    style={styles.merryTextLottie}
                    resizeMode="contain"
                />
            </View>

            {/* Bottom 2x2 Grid Section (1:1 boxes with border-radius 12) */}
            <View style={[styles.gridContainer, { paddingBottom: insets.bottom + verticalScale(20) }]}>
                {/* Row 1 */}
                <View style={styles.row}>
                    <View style={styles.box}>
                        {/* Top-Left Snow Cap */}
                        <Image
                            source={ChristmasAssets.images.snowTop}
                            style={styles.snowTopLeft}
                            resizeMode="contain"
                        />
                    </View>
                    <View style={styles.box}>
                        {/* Top-Right Dripping Snow Cap */}
                        <Image
                            source={ChristmasAssets.images.snowCorner}
                            style={styles.snowCorner}
                            resizeMode="contain"
                        />
                    </View>
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
        zIndex: 100,
        elevation: 10,
    },
    lottieWrapper: {
        width: '100%',
    },
    lottie: {
        width: '100%',
        height: '100%',
    },
    icicles: {
        position: 'absolute',
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 100,
        elevation: 10,
    },
    textLottieContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: scale(16),
        height: verticalScale(MERRY_TEXT_HEIGHT * 0.75),
    },
    merryTextLottie: {
        width: '100%',
        height: '100%',
    },
    gridContainer: {
        flex: 1,
        paddingHorizontal: scale(36), // Compact centered boxes
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
        position: 'relative',
        overflow: 'visible',
    },
    snowCorner: {
        position: 'absolute',
        top: -verticalScale(18),
        right: -scale(6),
        width: scale(56),
        height: scale(56),
        zIndex: 5,
    },
    snowTopLeft: {
        position: 'absolute',
        top: -verticalScale(55),
        left: scale(2),
        width: scale(100),
        height: verticalScale(120),
        zIndex: 5,
    },
});
