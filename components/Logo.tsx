import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import icon from '@/assets/images/icon.png';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

export default function Logo({ size = 'medium', showText = false }: LogoProps) {
  const logoSize = size === 'large' ? 80 : size === 'small' ? 40 : 60;
  const textSize = size === 'large' ? 28 : size === 'small' ? 14 : 20;

  return (
    <View style={styles.container}>
      <Image
        source={icon}
        style={[styles.logo, { width: logoSize, height: logoSize }]}
        resizeMode="contain"
      />
      {showText && <Text style={[styles.brandText, { fontSize: textSize }]}>SmartQueue</Text>}
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
 brandText: {
   color: '#FFFFFF',
   marginTop: 8,
   fontFamily: 'Poppins-SemiBold',
 },
});
