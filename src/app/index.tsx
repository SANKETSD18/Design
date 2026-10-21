import { Stack, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ms, s, vs } from "../Util/Scale";

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/swiggy')}
      >
        <Text style={styles.buttonText}>Swiggy</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/pip')}
      >
        <Text style={styles.buttonText}>PIP</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    gap: s(20),
    justifyContent: "center",
  },
  button: {
    backgroundColor: "orange",
    paddingVertical: vs(15),
    paddingHorizontal: s(40),
    borderRadius: s(8),
  },
  buttonText: {
    color: "white",
    fontSize: ms(18),
    fontWeight: "bold",
  },
});
