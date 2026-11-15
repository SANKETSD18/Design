import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "../Util/Scale";

interface MenuItem {
  title: string;
  subtitle: string;
  route: '/swiggy' | '/pip' | '/onboarding' | '/christmas';
  gradient: [string, string];
  iconText: string;
}

const MENU_ITEMS: MenuItem[] = [
  {
    title: "Swiggy",
    subtitle: "Delivery & Order UI animation",
    route: "/swiggy",
    gradient: ["#FC8019", "#E25A03"],
    iconText: "🍔",
  },
  {
    title: "Picture in Picture",
    subtitle: "Smooth video player overlay",
    route: "/pip",
    gradient: ["#2563EB", "#1D4ED8"],
    iconText: "🎬",
  },
  {
    title: "Onboarding",
    subtitle: "Interactive welcome screens",
    route: "/onboarding",
    gradient: ["#7C3AED", "#6366F1"],
    iconText: "✨",
  },
  {
    title: "Christmas",
    subtitle: "Holiday animation & festive boxes",
    route: "/christmas",
    gradient: ["#C5221F", "#740707"],
    iconText: "🎄",
  },
];

export default function Index() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + verticalScale(20), paddingBottom: insets.bottom + verticalScale(20) }]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header Title */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Design Showcase</Text>
        <Text style={styles.headerSubtitle}>Select a module to explore animations</Text>
      </View>

      {/* Uniform Buttons List */}
      <View style={styles.buttonList}>
        {MENU_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.route}
            activeOpacity={0.85}
            style={styles.cardWrapper}
            onPress={() => router.push(item.route)}
          >
            <LinearGradient
              colors={item.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardGradient}
            >
              <View style={styles.iconCircle}>
                <Text style={styles.iconText}>{item.iconText}</Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    paddingHorizontal: scale(20),
    justifyContent: "center",
  },
  header: {
    marginBottom: verticalScale(32),
  },
  headerTitle: {
    color: "#F8FAFC",
    fontSize: moderateScale(28),
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    color: "#94A3B8",
    fontSize: moderateScale(14),
    marginTop: verticalScale(6),
  },
  buttonList: {
    width: "100%",
    gap: verticalScale(14),
  },
  cardWrapper: {
    width: "100%",
    borderRadius: scale(16),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: verticalScale(4) },
    shadowOpacity: 0.25,
    shadowRadius: scale(8),
    elevation: 5,
  },
  cardGradient: {
    width: "100%",
    borderRadius: scale(16),
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(16),
    flexDirection: "row",
    alignItems: "center",
  },
  iconCircle: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(22),
    backgroundColor: "rgba(255, 255, 255, 0.18)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(14),
  },
  iconText: {
    fontSize: moderateScale(20),
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  itemTitle: {
    color: "#FFFFFF",
    fontSize: moderateScale(16),
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  itemSubtitle: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: moderateScale(12),
    marginTop: verticalScale(2),
  },
  chevron: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: moderateScale(24),
    fontWeight: "400",
    marginLeft: scale(8),
  },
});
