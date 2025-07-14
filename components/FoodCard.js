// components/FoodCard.js
import { View, Text, ImageBackground, StyleSheet } from 'react-native';

export default function FoodCard({ image, name, price }) {
  return (
    <View style={styles.card}>
      <ImageBackground source={image} style={styles.image} imageStyle={{ borderRadius: 15 }}>
        {/* Optional overlay content */}
      </ImageBackground>
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.price}>{price}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 10,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    elevation: 3,
  },
  image: {
    height: 120,
    width: '100%',
  },
  info: {
    padding: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 14,
    color: '#888',
  },
});
