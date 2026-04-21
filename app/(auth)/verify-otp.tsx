import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useApp, useT } from '@/context/AppContext';
import Logo from '@/components/Logo';
import LanguagePicker from '@/components/LanguagePicker';

export default function VerifyOTPScreen() {
  const router = useRouter();
  const { setIsLoggedIn, setRole } = useApp();
  const t = useT();
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const inputs = useRef<(TextInput | null)[]>([]);

  const handleDigit = (val: string, idx: number) => {
    const d = [...digits];
    d[idx] = val.replace(/[^0-9]/g, '').slice(-1);
    setDigits(d);
    if (val && idx < 5) inputs.current[idx + 1]?.focus();
  };

  const handleKeyPress = (e: any, idx: number) => {
    if (e.nativeEvent.key === 'Backspace' && !digits[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  };

  const handleCreate = () => {
    setIsLoggedIn(true);
    setRole('customer');
    router.replace('/(customer)/qr-scan');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.langRow}>
          <LanguagePicker />
        </View>

        <View style={styles.logoSection}>
          <Logo size="medium" />
        </View>

        <Text style={styles.title}>{t('verifyNumber')}</Text>
        <Text style={styles.sentTo}>{t('sentTo')} +63 912 345 6789</Text>

        <View style={styles.otpRow}>
          {digits.map((d, i) => (
            <TextInput
              key={i}
              ref={(r) => { inputs.current[i] = r; }}
              style={[styles.otpInput, d ? styles.otpFilled : null]}
              value={d}
              onChangeText={(v) => handleDigit(v, i)}
              onKeyPress={(e) => handleKeyPress(e, i)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
              selectionColor={Colors.teal}
            />
          ))}
        </View>

        <Text style={styles.enterCode}>{t('enterCode')}</Text>

        <TouchableOpacity style={styles.createBtn} onPress={handleCreate} activeOpacity={0.85}>
          <Text style={styles.createBtnText}>{t('createAccountBtn')}</Text>
        </TouchableOpacity>

        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerText}>{t('phoneDisclaimer')}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 },
  langRow: { alignItems: 'flex-end', marginTop: 16, marginBottom: 8 },
  logoSection: { alignItems: 'center', marginVertical: 20 },
  title: {
    color: Colors.white,
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  sentTo: {
    color: Colors.grayLight,
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginBottom: 28,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 16,
  },
  otpInput: {
    width: 44,
    height: 52,
    backgroundColor: Colors.inputBg,
    borderRadius: 8,
    color: Colors.white,
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  otpFilled: {
    borderColor: Colors.teal,
  },
  enterCode: {
    color: Colors.gray,
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginBottom: 28,
  },
  createBtn: {
    backgroundColor: Colors.teal,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  createBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  disclaimerBox: {
    backgroundColor: Colors.card,
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  disclaimerText: {
    color: Colors.gray,
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    lineHeight: 18,
    textAlign: 'center',
  },
});
