import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useApp, useT } from '@/context/AppContext';
import Logo from '@/components/Logo';
import LanguagePicker from '@/components/LanguagePicker';

export default function LoginScreen() {
  const router = useRouter();
  const { role: paramRole } = useLocalSearchParams<{ role: string }>();
  const { setIsLoggedIn, setRole } = useApp();
  const t = useT();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    const role = paramRole === 'staff' ? 'staff' : 'customer';
    setRole(role);
    if (role === 'staff') {
      router.replace('/(staff)');
    } else {
      router.replace('/(customer)/qr-scan');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.langRow}>
            <LanguagePicker />
          </View>

          <View style={styles.logoSection}>
            <Logo size="medium" />
          </View>

          <Text style={styles.title}>{t('welcomeBack')}</Text>

          <View style={styles.form}>
            <Text style={styles.label}>{t('emailOrPhone')}</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholderTextColor={Colors.gray}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={[styles.label, { marginTop: 16 }]}>{t('password')}</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={[styles.input, { flex: 1, marginBottom: 0 }]}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPass}
                placeholderTextColor={Colors.gray}
              />
              <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.showBtn}>
                <Text style={styles.showText}>{showPass ? t('hide') : t('show')}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} activeOpacity={0.85}>
              <Text style={styles.loginBtnText}>{t('logIn')}</Text>
            </TouchableOpacity>

            {paramRole !== 'staff' && (
              <>
                <View style={styles.dividerRow}>
                  <View style={styles.divider} />
                  <Text style={styles.dividerText}>{t('orContinueWith')}</Text>
                  <View style={styles.divider} />
                </View>

                <View style={styles.socialRow}>
                  <TouchableOpacity style={styles.socialBtn} activeOpacity={0.8}>
                    <Text style={styles.socialText}>G  {t('google')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.socialBtn, styles.fbBtn]} activeOpacity={0.8}>
                    <Text style={styles.socialText}>f  {t('facebook')}</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.signupRow}>
                  <Text style={styles.noAccount}>{t('noAccount')} </Text>
                  <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
                    <Text style={styles.signupLink}>{t('signUp')}</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            <TouchableOpacity style={styles.forgotRow}>
              <Text style={styles.forgotText}>{t('forgotPassword')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 },
  langRow: { alignItems: 'flex-end', marginTop: 16, marginBottom: 8 },
  logoSection: { alignItems: 'center', marginVertical: 28 },
  title: {
    color: Colors.white,
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  form: { gap: 4 },
  label: {
    color: Colors.grayLight,
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.inputBg,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: Colors.white,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 4,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  showBtn: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: Colors.inputBg,
    borderRadius: 8,
  },
  showText: { color: Colors.teal, fontSize: 13, fontFamily: 'Poppins-SemiBold' },
  loginBtn: {
    backgroundColor: Colors.teal,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  loginBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 20,
  },
  divider: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { color: Colors.gray, fontSize: 12, fontFamily: 'Poppins-Regular' },
  socialRow: { flexDirection: 'row', gap: 12 },
  socialBtn: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  fbBtn: { backgroundColor: '#1877F2' },
  socialText: { color: Colors.white, fontSize: 13, fontFamily: 'Poppins-SemiBold' },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  noAccount: { color: Colors.gray, fontSize: 13, fontFamily: 'Poppins-Regular' },
  signupLink: { color: Colors.teal, fontSize: 13, fontFamily: 'Poppins-SemiBold' },
  forgotRow: { alignItems: 'center', marginTop: 16 },
  forgotText: { color: Colors.teal, fontSize: 13, fontFamily: 'Poppins-Regular' },
});
