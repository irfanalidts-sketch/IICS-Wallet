import React from 'react';
import { Image, View, StyleSheet } from 'react-native';

const AnimatedFox = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../../images/branding/fox.png')}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  image: {
    width: 200,
    height: 200,
  },
});

export default AnimatedFox;
