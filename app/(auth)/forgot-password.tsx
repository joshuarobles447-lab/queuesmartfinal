import React, { useState } from 'react';
import {
  Alert,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useT } from '@/context/AppContext';
import Logo from '@/components/Logo';
import LanguagePicker from '@/components/LanguagePicker';
import { supabase } from '@/lib/supabase';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const t = useT();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail.endsWith('@hcdc.edu.ph')) {
      Alert.alert('Invalid email', 'Only @hcdc.edu.ph accounts can request a password reset.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail);
    setLoading(false);

    if (error) {
      Alert.alert('Reset failed', error.message);
      return;
    }

    Alert.alert('Reset link sent', t('resetSentMessage'));
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.8}>
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

          <Text style={styles.title}>{t('resetPassword')}</Text>
          <Text style={styles.subtitle}>{t('resetPasswordInstructions')}</Text>

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

            <TouchableOpacity
              style={styles.resetBtn}
              onPress={handleResetPassword}
              activeOpacity={0.85}
              disabled={loading}
            >
              <Text style={styles.resetBtnText}>{t('sendResetLink')}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/(auth)/login')} style={styles.backRow} activeOpacity={0.8}>
              <Text style={styles.backText}>{t('backToLogin')}</Text>
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
    marginBottom: 8,
  },
  subtitle: {
    color: Colors.grayLight,
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 12,
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
  resetBtn: {
    backgroundColor: Colors.teal,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  resetBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  backRow: {
    alignItems: 'center',
    marginTop: 16,
  },
  backText: {
    color: Colors.teal,
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
  },
});
