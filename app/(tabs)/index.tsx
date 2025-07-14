import { View, Text, StyleSheet } from 'react-native';


export default function HomeScreen() {
  return (
      <View style={styles.container}>
        <Text style={styles.bankrollTitle}>Bankroll:</Text>
        <Text style={styles.hourlyTitle}>Current Hourly:</Text>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: "white",
  },
  bankrollTitle: {
    fontSize: 40,
    position: "absolute",
    top: 90,
    left: 35,
  },
  hourlyTitle: {
    fontSize: 40,
    position: "absolute",
    top: 140,
    left: 35,
  },
});
