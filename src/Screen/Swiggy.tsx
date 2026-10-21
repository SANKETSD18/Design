import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ms, s, vs } from '../Util/Scale';
import SwiggyAssets from '../assets/swiggy';
import SwiggySkeleton from './Loding/SwiggySkeleton';



const TABS = [
    { id: '1', title: 'Food', icon: 'fast-food-outline' },
    { id: '2', title: 'Instamart', icon: 'basket-outline' },
    { id: '3', title: 'Dineout', icon: 'restaurant-outline' },
] as const;

const CATEGORIES = [
    { id: '1', name: 'Biryani', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200' },
    { id: '2', name: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200', selected: true },
    { id: '3', name: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200' },
    { id: '4', name: 'Rolls', image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=200' },
    { id: '5', name: 'North Indian', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200' },
];

const FILTERS = [
    { id: '1', label: 'Sort & Filter', icon: 'options-outline' },
    { id: '2', label: 'Fast Delivery' },
    { id: '3', label: 'Pure Veg', isVeg: true },
    { id: '4', label: 'Rating 4.0+' },
];

const RESTAURANTS = [
    {
        id: '1',
        name: 'Meghana Foods',
        rating: '4.4',
        cuisines: 'Biryani, Andhra, Chinese',
        priceForTwo: '₹350 for two',
        time: '25-30 mins',
        distance: '2.5 km',
        ratingsCount: '5K+ ratings',
        offer: 'Flat 20% OFF',
        offerColor: '#304FFE',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600',
    },
    {
        id: '2',
        name: 'Truffles',
        rating: '4.6',
        cuisines: 'American, Burgers, Cafe, Desserts',
        priceForTwo: '₹400 for two',
        time: '20-25 mins',
        distance: '1.8 km',
        ratingsCount: '10K+ ratings',
        offer: 'Free Delivery',
        offerColor: '#00897B',
        image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600',
    },
];

const TAB_BAR_HEIGHT = vs(65);
const SEPARATOR_HEIGHT = vs(9);
const COLLAPSE_DISTANCE = TAB_BAR_HEIGHT + SEPARATOR_HEIGHT;

export default function Swiggy() {
    const insets = useSafeAreaInsets();
    const [isLoading, setIsLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollY = useSharedValue(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            // setIsLoading(false);
        },);
        // return () => clearTimeout(timer);
    }, []);

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
        },
    });

    // 1. Whole Header Slides up by COLLAPSE_DISTANCE (LinearGradient moves with it, zero jitter!)
    const animatedHeaderContainerStyle = useAnimatedStyle(() => {
        const translateY = interpolate(
            scrollY.value,
            [0, COLLAPSE_DISTANCE],
            [0, -COLLAPSE_DISTANCE],
            Extrapolation.CLAMP
        );

        return {
            transform: [{ translateY }],
        };
    });

    // 2. Tabs + Separator fade out as they reach the top notch
    const animatedTabStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            scrollY.value,
            [0, COLLAPSE_DISTANCE * 0.7],
            [1, 0],
            Extrapolation.CLAMP
        );

        return {
            opacity,
        };
    });

    const renderItem = ({ item, index }: { item: typeof TABS[number], index: number }) => {
        const isActive = index === activeIndex;

        return (
            <TouchableOpacity
                style={styles.tabItem}
                onPress={() => setActiveIndex(index)}
            >
                <Ionicons name={item.icon as any} size={s(20)} color="white" />
                <Text style={[styles.tabText, { color: isActive ? 'white' : 'lightgray' }]}>
                    {item.title}
                </Text>
                <Image
                    source={SwiggyAssets.activeTab}
                    style={[
                        styles.activeOverlay,
                        {
                            opacity: isActive ? 1 : 0.5,
                            borderBottomWidth: 1,
                            width: isActive ? s(135) : s(120),
                        }
                    ]}
                    pointerEvents="none"
                    resizeMode="contain"
                />
            </TouchableOpacity>
        );
    };

    if (isLoading) {
        return <SwiggySkeleton />;
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Direct Animated.View wrapping normal LinearGradient */}
            <Animated.View style={[styles.headerContainer, animatedHeaderContainerStyle]}>
                <LinearGradient
                    colors={['#021204', '#0A3214']}
                    style={{ paddingTop: insets.top }}
                >
                    {/* 1. Tabs + Separator (Grouped together so separator also animates out) */}
                    <Animated.View style={animatedTabStyle}>
                        <FlatList
                            data={TABS}
                            keyExtractor={(item) => item.id}
                            horizontal
                            scrollEnabled={false}
                            contentContainerStyle={[styles.tabContainer, { flex: 1 }]}
                            renderItem={renderItem}
                        />
                        <View style={styles.separator} />
                    </Animated.View>

                    {/* 2. Location and Search Bar */}
                    <View style={styles.locationRow}>
                        <View style={styles.locationLeft}>
                            <View style={styles.locationIconWrapper}>
                                <Ionicons name="location-outline" size={s(18)} color="#F15B24" />
                            </View>

                            <View style={styles.addressContainer}>
                                <View style={styles.locationTitleRow}>
                                    <Text style={styles.locationTitle}>Indiranagar</Text>
                                    <Ionicons name="chevron-down" size={s(16)} color="white" style={styles.chevron} />

                                    <View style={styles.deliveryBadge}>
                                        <Ionicons name="flash" size={s(11)} color="#FFC72C" />
                                        <Text style={styles.deliveryBadgeText}>24m</Text>
                                    </View>
                                </View>

                                <Text style={styles.addressSubtitle} numberOfLines={1}>
                                    12th Cross Rd, HAL 2nd Stage, Bengaluru
                                </Text>
                            </View>
                        </View>

                        <View style={styles.actionsRight}>
                            <TouchableOpacity style={styles.iconCircleButton}>
                                <Ionicons name="notifications-outline" size={s(18)} color="white" />
                                <View style={styles.notificationDot} />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.profileWrapper}>
                                <Image
                                    source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' }}
                                    style={styles.profileImage}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Search Bar */}
                    <TouchableOpacity activeOpacity={0.8} style={styles.searchBar}>
                        <Ionicons name="search-outline" size={s(18)} color="#6E9A85" />
                        <Text style={styles.searchPlaceholder}>
                            Search 'Biryani', 'Pizza' or restaurants...
                        </Text>
                        <Ionicons name="mic-outline" size={s(18)} color="#6E9A85" />
                    </TouchableOpacity>
                </LinearGradient>
            </Animated.View>

            {/* Scrollable Body Content */}
            <Animated.ScrollView
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingTop: insets.top + vs(10) + COLLAPSE_DISTANCE + vs(120) }
                ]}
                style={styles.bodyScrollView}
            >
                {/* 1. What's On Your Mind Section */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>WHAT'S ON YOUR MIND?</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAllText}>See all</Text>
                    </TouchableOpacity>
                </View>

                <Animated.ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoriesScroll}
                >
                    {CATEGORIES.map((cat) => (
                        <TouchableOpacity key={cat.id} style={styles.categoryItem} activeOpacity={0.8}>
                            <View style={[styles.categoryImageWrapper, cat.selected && styles.categorySelected]}>
                                <Image source={{ uri: cat.image }} style={styles.categoryImage} />
                            </View>
                            <Text style={styles.categoryName}>{cat.name}</Text>
                        </TouchableOpacity>
                    ))}
                </Animated.ScrollView>

                {/* 2. Quick Filters */}
                <Animated.ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filtersScroll}
                >
                    {FILTERS.map((filter) => (
                        <TouchableOpacity key={filter.id} style={styles.filterChip} activeOpacity={0.7}>
                            {filter.icon && (
                                <Ionicons name={filter.icon as any} size={s(14)} color="#3D4152" style={{ marginRight: s(4) }} />
                            )}
                            {filter.isVeg && <View style={styles.vegDot} />}
                            <Text style={styles.filterChipText}>{filter.label}</Text>
                        </TouchableOpacity>
                    ))}
                </Animated.ScrollView>

                {/* 3. Top Rated Restaurants Section */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.restaurantSectionTitle}>Top Rated Restaurants Near You</Text>
                </View>

                {RESTAURANTS.map((rest) => (
                    <TouchableOpacity key={rest.id} activeOpacity={0.9} style={styles.restaurantCard}>
                        {/* Image Banner */}
                        <View style={styles.cardImageContainer}>
                            <Image source={{ uri: rest.image }} style={styles.restaurantImage} />
                            <LinearGradient
                                colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.65)']}
                                style={StyleSheet.absoluteFill}
                            />

                            {/* Favorite Heart Button */}
                            <TouchableOpacity style={styles.favoriteButton}>
                                <Ionicons name="heart-outline" size={s(18)} color="white" />
                            </TouchableOpacity>

                            {/* Offer Badge */}
                            {rest.offer && (
                                <View style={[styles.offerBadge, { backgroundColor: rest.offerColor }]}>
                                    <Ionicons name="pricetag" size={s(11)} color="white" />
                                    <Text style={styles.offerText}>{rest.offer}</Text>
                                </View>
                            )}
                        </View>

                        {/* Details */}
                        <View style={styles.restaurantDetails}>
                            <View style={styles.nameRow}>
                                <Text style={styles.restaurantName}>{rest.name}</Text>
                                <View style={styles.ratingBadge}>
                                    <Text style={styles.ratingText}>{rest.rating}</Text>
                                    <Ionicons name="star" size={s(10)} color="white" style={{ marginLeft: s(2) }} />
                                </View>
                            </View>

                            <View style={styles.cuisineRow}>
                                <Text style={styles.cuisineText} numberOfLines={1}>{rest.cuisines}</Text>
                                <Text style={styles.priceText}>{rest.priceForTwo}</Text>
                            </View>

                            {/* Footer stats */}
                            <View style={styles.infoFooterRow}>
                                <Ionicons name="time-outline" size={s(13)} color="#686B78" />
                                <Text style={styles.footerInfoText}>{rest.time}</Text>
                                <Text style={styles.bulletDot}>•</Text>
                                <Text style={styles.footerInfoText}>{rest.distance}</Text>
                                <Text style={styles.bulletDot}>•</Text>
                                <Text style={styles.ratingsCountText}>{rest.ratingsCount}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </Animated.ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    headerContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        overflow: 'hidden',
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
        borderRadius: 10,
    },
    tabText: {
        fontSize: ms(16),
        fontWeight: 'bold',
        marginTop: vs(8),
    },
    badgeContainer: {
        backgroundColor: '#1C5BFF', // Blue badge color
        paddingHorizontal: s(8),
        paddingVertical: vs(3),
        borderRadius: s(6),
        position: 'absolute',
        bottom: vs(22),
        zIndex: 1,
    },
    badgeText: {
        color: 'white',
        fontSize: ms(11),
        fontWeight: 'bold',
    },
    activeOverlay: {
        position: 'absolute',
        width: s(120),
        height: s(65),
        top: vs(1),
        zIndex: 10, // shows above
    },
    centerWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    polygonContainer: {
        backgroundColor: '#F05A26', // Swiggy Orange example
        transform: [{ skewX: '-15deg' }], // This creates the slanted polygon effect
        paddingHorizontal: s(30),
        paddingVertical: vs(15),
        borderRadius: s(5),
    },
    polygonInner: {
        transform: [{ skewX: '15deg' }], // Un-skew the inner content so text stays straight
        alignItems: 'center',
        justifyContent: 'center',
    },
    polygonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: ms(16),
    },
    separator: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginHorizontal: s(16),
        marginTop: vs(8),
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: s(16),
        marginTop: vs(14),
    },
    locationLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: s(10),
    },
    locationIconWrapper: {
        width: s(36),
        height: s(36),
        borderRadius: s(18),
        backgroundColor: '#0D3B1C',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: s(10),
    },
    addressContainer: {
        flex: 1,
    },
    locationTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationTitle: {
        color: '#FFFFFF',
        fontSize: ms(16),
        fontWeight: '800',
    },
    chevron: {
        marginLeft: s(4),
    },
    deliveryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 199, 44, 0.18)',
        borderColor: 'rgba(255, 199, 44, 0.35)',
        borderWidth: 1,
        paddingHorizontal: s(6),
        paddingVertical: vs(2),
        borderRadius: s(6),
        marginLeft: s(8),
    },
    deliveryBadgeText: {
        color: '#FFC72C',
        fontSize: ms(11),
        fontWeight: '700',
        marginLeft: s(2),
    },
    addressSubtitle: {
        color: '#8BA695',
        fontSize: ms(12),
        marginTop: vs(2),
    },
    actionsRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: s(10),
    },
    iconCircleButton: {
        width: s(36),
        height: s(36),
        borderRadius: s(18),
        backgroundColor: '#0D3B1C',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    notificationDot: {
        position: 'absolute',
        top: vs(6),
        right: s(7),
        width: s(8),
        height: s(8),
        borderRadius: s(4),
        backgroundColor: '#FF6D00',
        borderWidth: 1.5,
        borderColor: '#0A3214',
    },
    profileWrapper: {
        borderWidth: 1.5,
        borderColor: '#26A69A',
        borderRadius: s(19),
        padding: s(1),
    },
    profileImage: {
        width: s(34),
        height: s(34),
        borderRadius: s(17),
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0E3824',
        marginHorizontal: s(16),
        marginTop: vs(14),
        marginBottom: vs(12),
        paddingHorizontal: s(14),
        height: vs(44),
        borderRadius: s(22),
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    searchPlaceholder: {
        flex: 1,
        color: '#6E9A85',
        fontSize: ms(13),
        marginLeft: s(8),
    },
    bodyScrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: vs(50),
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: s(16),
        marginTop: vs(16),
        marginBottom: vs(12),
    },
    sectionTitle: {
        fontSize: ms(13),
        fontWeight: '800',
        color: '#02060C',
        letterSpacing: 0.5,
    },
    seeAllText: {
        fontSize: ms(12),
        fontWeight: '600',
        color: '#008080',
    },
    categoriesScroll: {
        paddingHorizontal: s(12),
        gap: s(14),
    },
    categoryItem: {
        alignItems: 'center',
    },
    categoryImageWrapper: {
        width: s(64),
        height: s(64),
        borderRadius: s(32),
        overflow: 'hidden',
        backgroundColor: '#F0F0F0',
        padding: s(2),
    },
    categorySelected: {
        borderWidth: 2,
        borderColor: '#6366F1',
        borderRadius: s(8),
    },
    categoryImage: {
        width: '100%',
        height: '100%',
        borderRadius: s(30),
    },
    categoryName: {
        fontSize: ms(11),
        fontWeight: '600',
        color: '#3E4152',
        marginTop: vs(6),
    },
    filtersScroll: {
        paddingHorizontal: s(16),
        paddingVertical: vs(14),
        gap: s(8),
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: s(12),
        paddingVertical: vs(6),
        borderRadius: s(18),
        borderWidth: 1,
        borderColor: '#E2E8F0',
        backgroundColor: '#FFFFFF',
    },
    filterChipText: {
        fontSize: ms(12),
        fontWeight: '600',
        color: '#3E4152',
    },
    vegDot: {
        width: s(8),
        height: s(8),
        borderRadius: s(4),
        backgroundColor: '#0F8A65',
        marginRight: s(6),
    },
    restaurantSectionTitle: {
        fontSize: ms(16),
        fontWeight: '800',
        color: '#02060C',
    },
    restaurantCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: s(16),
        marginHorizontal: s(16),
        marginBottom: vs(18),
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
    },
    cardImageContainer: {
        height: vs(180),
        position: 'relative',
    },
    restaurantImage: {
        width: '100%',
        height: '100%',
    },
    favoriteButton: {
        position: 'absolute',
        top: vs(12),
        right: s(12),
        backgroundColor: 'rgba(0,0,0,0.35)',
        width: s(32),
        height: s(32),
        borderRadius: s(16),
        alignItems: 'center',
        justifyContent: 'center',
    },
    offerBadge: {
        position: 'absolute',
        bottom: vs(10),
        left: s(12),
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: s(8),
        paddingVertical: vs(4),
        borderRadius: s(6),
        gap: s(4),
    },
    offerText: {
        color: 'white',
        fontWeight: '800',
        fontSize: ms(11),
    },
    restaurantDetails: {
        padding: s(14),
    },
    nameRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    restaurantName: {
        fontSize: ms(16),
        fontWeight: '800',
        color: '#02060C',
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0F8A65',
        paddingHorizontal: s(6),
        paddingVertical: vs(2),
        borderRadius: s(6),
    },
    ratingText: {
        color: 'white',
        fontWeight: '700',
        fontSize: ms(12),
    },
    cuisineRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: vs(4),
    },
    cuisineText: {
        fontSize: ms(12),
        color: '#686B78',
        flex: 1,
        marginRight: s(8),
    },
    priceText: {
        fontSize: ms(12),
        color: '#686B78',
        fontWeight: '500',
    },
    infoFooterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: vs(8),
        paddingTop: vs(8),
        borderTopWidth: 0.5,
        borderTopColor: '#F0F0F0',
    },
    footerInfoText: {
        fontSize: ms(12),
        color: '#686B78',
        marginLeft: s(4),
    },
    bulletDot: {
        marginHorizontal: s(6),
        color: '#9CA3AF',
    },
    ratingsCountText: {
        fontSize: ms(12),
        color: '#00897B',
        fontWeight: '600',
    },
});
