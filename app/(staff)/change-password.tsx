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
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useT } from '@/context/AppContext';
import { supabase } from '@/lib/supabase';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const t = useT();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const userEmail = sessionData?.session?.user?.email;

      if (!userEmail) {
        Alert.alert('Error', 'Unable to get user session.');
        setLoading(false);
        return;
      }

      // Verify current password by attempting to sign in
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: currentPassword,
      });

      if (verifyError) {
        Alert.alert('Error', 'Current password is incorrect.');
        setLoading(false);
        return;
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        Alert.alert('Error', updateError.message);
        setLoading(false);
        return;
      }

      Alert.alert('Success', 'Password changed successfully.', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.8}>
              <ArrowLeft color={Colors.white} size={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Change Password</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.container}>
            <Text style={styles.title}>Update your password</Text>
            <Text style={styles.subtitle}>
              Enter your current password and choose a new one to keep your account secure.
            </Text>

            <View style={styles.form}>
              {/* Current Password */}
              <Text style={styles.label}>Current Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  secureTextEntry={!showCurrent}
                  placeholderTextColor={Colors.gray}
                  placeholder="Enter current password"
                />
                <TouchableOpacity
                  onPress={() => setShowCurrent(!showCurrent)}
                  style={styles.showBtn}
                >
                  <Text style={styles.showText}>{showCurrent ? t('hide') : t('show')}</Text>
                </TouchableOpacity>
              </View>

              {/* New Password */}
              <Text style={[styles.label, { marginTop: 16 }]}>New Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showNew}
                  placeholderTextColor={Colors.gray}
                  placeholder="Enter new password"
                />
                <TouchableOpacity
                  onPress={() => setShowNew(!showNew)}
                  style={styles.showBtn}
                >
                  <Text style={styles.showText}>{showNew ? t('hide') : t('show')}</Text>
                </TouchableOpacity>
              </View>

              {/* Confirm Password */}
              <Text style={[styles.label, { marginTop: 16 }]}>Confirm New Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirm}
                  placeholderTextColor={Colors.gray}
                  placeholder="Confirm new password"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirm(!showConfirm)}
                  style={styles.showBtn}
                >
                  <Text style={styles.showText}>{showConfirm ? t('hide') : t('show')}</Text>
                </TouchableOpacity>
              </View>

              {/* Change Button */}
              <TouchableOpacity
                style={[styles.changeBtn, loading && styles.changeBtnDisabled]}
                onPress={handleChangePassword}
                activeOpacity={0.85}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={Colors.white} />
                ) : (
                  <Text style={styles.changeBtnText}>Change Password</Text>
                )}
              </TouchableOpacity>

              {/* Cancel Button */}
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => router.back()}
                activeOpacity={0.85}
                disabled={loading}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
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
  scroll: { flexGrow: 1, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
  },
  container: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  title: {
    color: Colors.white,
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    marginBottom: 8,
  },
  subtitle: {
    color: Colors.grayLight,
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    marginBottom: 24,
    lineHeight: 20,
  },
  form: { gap: 4 },
  label: {
    color: Colors.grayLight,
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    marginBottom: 6,
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
  changeBtn: {
    backgroundColor: Colors.teal,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 28,
  },
  changeBtnDisabled: {
    opacity: 0.6,
  },
  changeBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  cancelBtn: {
    backgroundColor: Colors.card,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelBtnText: {
    color: Colors.teal,
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
});
