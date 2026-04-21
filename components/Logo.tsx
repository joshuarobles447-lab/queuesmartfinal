import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
}

export default function Logo({ size = 'medium' }: LogoProps) {
  const iconSize = size === 'large' ? 56 : size === 'small' ? 32 : 44;
  const fontSize = size === 'large' ? 30 : size === 'small' ? 18 : 24;
  const subSize = size === 'large' ? 30 : size === 'small' ? 18 : 24;

  return (
    <View style={styles.container}>
      <View style={[styles.iconBox, { width: iconSize, height: iconSize, borderRadius: iconSize * 0.25 }]}>
        <Text style={[styles.iconText, { fontSize: iconSize * 0.45 }]}>Q</Text>
      </View>
      <Text style={[styles.logoText, { fontSize: fontSize }]}>
        <Text style={styles.smart}>Smart</Text>
        <Text style={styles.queue}>Queue</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBox: {
    backgroundColor: Colors.teal,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    color: Colors.white,
    fontWeight: '800',
  },
  logoText: {
    fontWeight: '700',
  },
  smart: {
    color: Colors.white,
  },
  queue: {
    color: Colors.teal,
  },
});
