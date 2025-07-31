import { Text, View, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { colors } from '../styles';

export default function Index() {
  return (
    <View style={styles.container} >
      <Text style={styles.text}>Home screen </Text>
      {/* <Link href="/map" style={styles.button}>
        Go to Map screen
      </Link> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: colors.textColor,
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
});
