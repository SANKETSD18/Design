import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ms, s, vs } from '../Util/Scale';
import SwiggyAssets from '../assets/swiggy';

const TABS = [
    { id: '1', title: 'Food', icon: 'fast-food-outline' },
    { id: '2', title: 'Instamart', icon: 'basket-outline' },
    { id: '3', title: 'Dineout', icon: 'restaurant-outline' },
] as const;

export default function Swiggy() {
    const insets = useSafeAreaInsets();
    const [activeIndex, setActiveIndex] = useState(0);

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
                            width: isActive ? s(140) : s(120),

                        }
                    ]}
                    pointerEvents="none"
                    resizeMode="contain"
                />
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <LinearGradient
                colors={['#021204', '#0A3214']}
                style={[styles.headerContainer, { paddingTop: insets.top + vs(10) }]}
            >
                <FlatList
                    data={TABS}
                    keyExtractor={(item) => item.id}
                    horizontal
                    scrollEnabled={false}
                    contentContainerStyle={[styles.tabContainer, { flex: 1 }]}
                    renderItem={renderItem}
                />
            </LinearGradient>



            {/* jo yaha shwo hot central me  */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    headerContainer: {
        // paddingBottom: vs(15),
        borderWidth: 1,
        borderColor: '#fff'
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
        // borderWidth: 2,
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
        // bottom: vs(6),
        // borderWidth: 1,
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
    }
});
