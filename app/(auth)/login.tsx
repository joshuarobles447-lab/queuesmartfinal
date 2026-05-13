import React, { useState } from 'react';
import {
  Alert,
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useApp, useT } from '@/context/AppContext';
import Logo from '@/components/Logo';
import LanguagePicker from '@/components/LanguagePicker';
import { supabase } from '@/lib/supabase';

export default function LoginScreen() {
  const router = useRouter();
  const { role: paramRole } = useLocalSearchParams<{ role: string }>();
  const { setIsLoggedIn, setRole } = useApp();
  const t = useT();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter your email and password.');
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail.endsWith('@hcdc.edu.ph')) {
      Alert.alert('Invalid email', 'Only @hcdc.edu.ph accounts can log in.');
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (error) {
      Alert.alert('Login failed', error.message);
      return;
    }

    const authUser = data.user ?? data.session?.user;
    const userId = authUser?.id;
    const userEmail = authUser?.email ?? normalizedEmail;
    if (!userId) {
      Alert.alert('Login failed', 'Unable to get user session.');
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    let role = profile?.role?.toString().trim().toLowerCase();
    if (!role && userEmail) {
      const { data: profileByEmail, error: profileEmailError } = await supabase
        .from('profiles')
        .select('role')
        .eq('email', userEmail)
        .single();

      if (profileEmailError) {
        console.log('Profile fetch by email error', profileEmailError);
      }

      role = profileByEmail?.role?.toString().trim().toLowerCase() || role;
    }

    if (profileError && !role) {
      console.log('Profile fetch error', profileError);
    }

    if (!role) {
      console.log('Profile lookup failed', { userId, userEmail, profile, profileError });
      Alert.alert(
        'Login failed',
        `Account not recognized or not authorized. Please contact support if this is an existing account.\nuserId=${userId}\nemail=${userEmail}`,
      );
      return;
    }

    if (role !== 'staff' && role !== 'customer') {
      Alert.alert('Login failed', 'Your account role is not supported.');
      return;
    }

    setIsLoggedIn(true);
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
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.replace('/')} activeOpacity={0.8}>
              <ArrowLeft color={Colors.white} size={24} />
            </TouchableOpacity>
            <View />
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.langRow}>
            <LanguagePicker />
          </View>

          <View style={styles.logoSection}>
            <Logo size="medium" showText />
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
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
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

            <View style={styles.signupRow}>
              <Text style={styles.noAccount}>{t('noAccount')} </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
                <Text style={styles.signupLink}>{t('signUp')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    marginBottom: 8,
  },
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBg,
    borderRadius: 8,
    marginBottom: 4,
  },
  passwordInput: {
    flex: 1,
    color: Colors.white,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  showBtn: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    justifyContent: 'center',
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
});
