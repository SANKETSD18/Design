import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, LayoutChangeEvent, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
    Easing,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SwiggyAssets from '../../assets/swiggy';
import { ms, s, vs } from '../../Util/Scale';

const TABS = [
    { id: '1', title: 'Food', icon: 'fast-food-outline' },
    { id: '2', title: 'Instamart', icon: 'basket-outline' },
    { id: '3', title: 'Dineout', icon: 'restaurant-outline' },
] as const;

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

export interface ShimmerBoxProps {
    width: number | `${number}%`;
    height: number;
    borderRadius?: number;
    isDark?: boolean;
    style?: any;
}

// Method 1: Feathered, native 45-degree soft gradient without rotate-cut artifacts
export const ShimmerBox = ({ width, height, borderRadius = s(8), isDark = false, style }: ShimmerBoxProps) => {
    const shimmerProgress = useSharedValue(0);
    const [boxWidth, setBoxWidth] = useState<number>(typeof width === 'number' ? width : 0);

    useEffect(() => {
        shimmerProgress.value = withRepeat(
            withTiming(1, { duration: 1600, easing: Easing.bezier(0.4, 0, 0.2, 1) }),
            -1,
            false
        );
    }, []);

    const onLayout = (e: LayoutChangeEvent) => {
        const measured = e.nativeEvent.layout.width;
        if (measured > 0) {
            setBoxWidth(measured);
        }
    };

    const baseColor = isDark ? '#1B3322' : '#E4E7EB';
    const highlightColor = isDark ? 'rgba(110, 154, 133, 0.4)' : 'rgba(255, 255, 255, 0.55)';

    const animatedStyle = useAnimatedStyle(() => {
        const w = boxWidth || 150;
        // Travel fully from outside left to outside right
        const translateX = interpolate(
            shimmerProgress.value,
            [0, 1],
            [-w * 1.5, w * 1.5]
        );

        return {
            transform: [{ translateX }],
        };
    });

    return (
        <View
            onLayout={onLayout}
            style={[
                {
                    width,
                    height,
                    borderRadius,
                    backgroundColor: baseColor,
                    overflow: 'hidden',
                },
                style,
            ]}
        >
            <AnimatedGradient
                colors={[
                    'transparent',
                    highlightColor,
                    'transparent',
                ]}
                locations={[0.2, 0.5, 0.8]} // Smooth feathering, no sharp edges
                start={{ x: 0, y: 0 }}      // Top-Left (Exact 45-degree angle natively)
                end={{ x: 1, y: 1 }}        // Bottom-Right
                style={[
                    StyleSheet.absoluteFill,
                    animatedStyle,
                    {
                        width: '180%',
                        left: '-40%',
                    },
                ]}
            />
        </View>
    );
};

export const SwiggySkeleton = () => {
    const insets = useSafeAreaInsets();

    return (
        <View style={skeletonStyles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* 1. Header Skeleton (Dark Gradient matching Swiggy) */}
            <LinearGradient
                colors={['#021204', '#0A3214']}
                style={{ paddingTop: insets.top + vs(10), paddingBottom: vs(16) }}
            >
                {/* 1. Tabs with SwiggyAssets.activeTab and Shimmer Overlay */}
                <View style={skeletonStyles.tabContainer}>
                    {TABS.map((tab, index) => {
                        const isActive = index === 0; // First tab active by default
                        return (
                            <View key={tab.id} style={skeletonStyles.tabItem}>
                                {/* Shimmer placeholder for Tab Icon */}
                                <ShimmerBox width={s(20)} height={s(20)} borderRadius={s(10)} isDark />

                                {/* Shimmer placeholder for Tab Title */}
                                <ShimmerBox width={s(48)} height={vs(12)} borderRadius={s(4)} isDark style={{ marginTop: vs(8) }} />

                                {/* SwiggyAssets.activeTab Image remains intact */}
                                <Image
                                    source={SwiggyAssets.activeTab}
                                    style={[
                                        skeletonStyles.activeOverlay,
                                        {
                                            opacity: isActive ? 1 : 0.5,
                                            borderBottomWidth: 1,
                                            width: isActive ? s(135) : s(120),
                                        },
                                    ]}
                                    pointerEvents="none"
                                    resizeMode="contain"
                                />
                            </View>
                        );
                    })}
                </View>
                <View style={skeletonStyles.separator} />

                {/* Address Bar shimmer */}
                <View style={skeletonStyles.addressRow}>
                    <View>
                        <ShimmerBox width={s(140)} height={vs(16)} borderRadius={s(6)} isDark />
                        <ShimmerBox width={s(210)} height={vs(11)} borderRadius={s(4)} isDark style={{ marginTop: vs(6) }} />
                    </View>
                    <ShimmerBox width={s(36)} height={s(36)} borderRadius={s(18)} isDark />
                </View>

                {/* Search Bar shimmer */}
                <View style={skeletonStyles.searchBoxWrapper}>
                    <ShimmerBox width={'100%'} height={vs(46)} borderRadius={s(12)} isDark />
                </View>
            </LinearGradient>

            {/* 2. Content Area Skeleton */}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: vs(30) }}>
                {/* Categories Skeleton */}
                <View style={skeletonStyles.section}>
                    <ShimmerBox width={s(150)} height={vs(18)} borderRadius={s(6)} />
                    <View style={skeletonStyles.categoriesRow}>
                        {[1, 2, 3, 4].map((i) => (
                            <View key={i} style={skeletonStyles.categoryItem}>
                                <ShimmerBox width={s(66)} height={s(66)} borderRadius={s(33)} />
                                <ShimmerBox width={s(48)} height={vs(10)} borderRadius={s(4)} style={{ marginTop: vs(8) }} />
                            </View>
                        ))}
                    </View>
                </View>

                {/* Restaurants Section Skeleton */}
                <View style={skeletonStyles.section}>
                    <ShimmerBox width={s(200)} height={vs(20)} borderRadius={s(6)} style={{ marginBottom: vs(16) }} />

                    {/* Card 1 */}
                    <View style={skeletonStyles.restaurantCard}>
                        <ShimmerBox width={'100%'} height={vs(175)} borderRadius={s(14)} />
                        <View style={skeletonStyles.cardTitleRow}>
                            <ShimmerBox width={s(160)} height={vs(18)} borderRadius={s(6)} />
                            <ShimmerBox width={s(50)} height={vs(18)} borderRadius={s(6)} />
                        </View>
                        <ShimmerBox width={s(220)} height={vs(12)} borderRadius={s(4)} style={{ marginTop: vs(8) }} />
                        <ShimmerBox width={s(140)} height={vs(12)} borderRadius={s(4)} style={{ marginTop: vs(6) }} />
                    </View>

                    {/* Card 2 */}
                    <View style={skeletonStyles.restaurantCard}>
                        <ShimmerBox width={'100%'} height={vs(175)} borderRadius={s(14)} />
                        <View style={skeletonStyles.cardTitleRow}>
                            <ShimmerBox width={s(140)} height={vs(18)} borderRadius={s(6)} />
                            <ShimmerBox width={s(50)} height={vs(18)} borderRadius={s(6)} />
                        </View>
                        <ShimmerBox width={s(200)} height={vs(12)} borderRadius={s(4)} style={{ marginTop: vs(8) }} />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default SwiggySkeleton;

const skeletonStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
    },
    tabItem: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingTop: vs(15),
        minWidth: s(90),
        borderRadius: s(10),
        position: 'relative',
    },
    tabText: {
        fontSize: ms(16),
        fontWeight: 'bold',
        marginTop: vs(8),
    },
    activeOverlay: {
        position: 'absolute',
        width: s(120),
        height: s(65),
        top: vs(1),
        zIndex: 10,
    },
    separator: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginHorizontal: s(16),
        marginTop: vs(8),
    },
    addressRow: {
        paddingHorizontal: s(16),
        marginTop: vs(16),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    searchBoxWrapper: {
        paddingHorizontal: s(16),
        marginTop: vs(14),
    },
    section: {
        paddingHorizontal: s(16),
        marginTop: vs(24),
    },
    categoriesRow: {
        flexDirection: 'row',
        marginTop: vs(14),
        gap: s(14),
    },
    categoryItem: {
        alignItems: 'center',
    },
    restaurantCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: s(18),
        padding: s(12),
        marginBottom: vs(16),
    },
    cardTitleRow: {
        marginTop: vs(12),
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});
