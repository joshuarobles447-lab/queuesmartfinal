import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import icon from '@/assets/images/icon.png';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
}

export default function Logo({ size = 'medium' }: LogoProps) {
  const logoSize = size === 'large' ? 80 : size === 'small' ? 40 : 60;

  return (
    <View style={styles.container}>
      <Image
        source={icon}
        style={[styles.logo, { width: logoSize, height: logoSize }]}
        resizeMode="contain"
      />
    </View>
 );
}

const styles = StyleSheet.create({
 container: {
 justifyContent: 'center',
 alignItems: 'center',
 },
 logo: {
 resizeMode: 'contain',
 },
});
