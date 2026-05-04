import React, { useState } from 'react';
import {
  Alert,
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useT, useApp } from '@/context/AppContext';
import Logo from '@/components/Logo';
import LanguagePicker from '@/components/LanguagePicker';
import { supabase } from '@/lib/supabase';

export default function SignupScreen() {
  const router = useRouter();
  const t = useT();
  const { setIsLoggedIn, setRole } = useApp();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [isPriority, setIsPriority] = useState(false);

  const handleContinue = async () => {
    if (!fullName || !email || !password) {
      Alert.alert('Error', 'Please enter your name, email, and password.');
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail.endsWith('@hcdc.edu.ph')) {
      Alert.alert('Invalid email', 'Only @hcdc.edu.ph accounts can register.');
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      Alert.alert('Signup failed', error.message);
      return;
    }

    const userId = data.user?.id;
    if (!userId) {
      Alert.alert('Signup pending', 'Please check your email to confirm registration.');
      return;
    }

    if (!data.session) {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (signInError) {
        Alert.alert('Signup pending', 'Please check your email to confirm registration.');
        return;
      }
    }

    const { error: profileError } = await supabase.from('profiles').insert({
      id: userId,
      full_name: fullName,
      email: normalizedEmail,
      phone,
      role: 'customer',
    });

    if (profileError) {
      Alert.alert('Profile save failed', profileError.message);
      return;
    }

    const { error: eventError } = await supabase.from('signup_events').insert({
      user_id: userId,
      full_name: fullName,
      email: normalizedEmail,
      phone,
      role: 'customer',
    });

    if (eventError) {
      console.log('Signup event save failed:', eventError.message);
    }

    setIsLoggedIn(true);
    setRole('customer');
    router.replace('/(customer)/qr-scan');
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

          <Text style={styles.title}>{t('createAccount')}</Text>

          <View style={styles.form}>
            <Text style={styles.label}>{t('fullName')}</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholderTextColor={Colors.gray}
            />

            <Text style={[styles.label, { marginTop: 12 }]}>{t('emailOrPhone')}</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholderTextColor={Colors.gray}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={[styles.label, { marginTop: 12 }]}>{t('phoneNumber')}</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="+63 912 345 6789"
              placeholderTextColor={Colors.gray}
              keyboardType="phone-pad"
            />
            <Text style={styles.hint}>{t('phoneHint')}</Text>

            <Text style={[styles.label, { marginTop: 12 }]}>{t('password')}</Text>
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

            <TouchableOpacity
              style={styles.checkRow}
              onPress={() => setAgreedTerms(!agreedTerms)}
              activeOpacity={0.8}
            >
              <View style={[styles.checkbox, agreedTerms && styles.checkboxChecked]}>
                {agreedTerms && <Text style={styles.checkMark}>✓</Text>}
              </View>
              <Text style={styles.checkText}>{t('agreeTerms')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.checkRow}
              onPress={() => setIsPriority(!isPriority)}
              activeOpacity={0.8}
            >
              <View style={[styles.checkbox, isPriority && styles.checkboxChecked]}>
                {isPriority && <Text style={styles.checkMark}>✓</Text>}
              </View>
              <Text style={styles.checkText}>{t('registerPriority')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.continueBtn} onPress={handleContinue} activeOpacity={0.85}>
              <Text style={styles.continueBtnText}>{t('continue')}</Text>
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
  logoSection: { alignItems: 'center', marginVertical: 20 },
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
  hint: {
    color: Colors.gray,
    fontSize: 11,
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
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 14,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    flexShrink: 0,
  },
  checkboxChecked: {
    backgroundColor: Colors.teal,
  },
  checkMark: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  checkText: {
    color: Colors.grayLight,
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    flex: 1,
    lineHeight: 18,
  },
  continueBtn: {
    backgroundColor: Colors.teal,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  continueBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
});
