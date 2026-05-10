import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { User, UserCog } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useApp, useT } from '@/context/AppContext';
import Logo from '@/components/Logo';
import LanguagePicker from '@/components/LanguagePicker';
import { supabase } from '@/lib/supabase';

export default function ChooseScreen() {
  const router = useRouter();
  const { setRole } = useApp();
  const t = useT();

  const handleChoose = (role: 'staff' | 'customer') => {
    setRole(role);
    router.push(`/(auth)/login?role=${role}`);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.langRow}>
          <LanguagePicker />
        </View>

        <View style={styles.logoSection}>
          <Logo size="large" />
        </View>

        <Text style={styles.chooseText}>{t('chooseRole')}</Text>

        <View style={styles.rolesRow}>
          <TouchableOpacity
            style={styles.roleCard}
            onPress={() => handleChoose('staff')}
            activeOpacity={0.8}
          >
            <View style={styles.avatarBox}>
              <UserCog color={Colors.teal} size={40} />
            </View>
            <Text style={styles.roleLabel}>{t('staff')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.roleCard}
            onPress={() => handleChoose('customer')}
            activeOpacity={0.8}
          >
            <View style={styles.avatarBox}>
              <User color={Colors.teal} size={40} />
            </View>
            <Text style={styles.roleLabel}>{t('users')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  langRow: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  logoSection: {
    marginBottom: 48,
  },
  chooseText: {
    color: Colors.grayLight,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    marginBottom: 32,
    letterSpacing: 0.5,
  },
  rolesRow: {
    flexDirection: 'row',
    gap: 24,
  },
  roleCard: {
    width: 120,
    height: 130,
    backgroundColor: Colors.card,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avatarBox: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Colors.cardDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleLabel: {
    color: Colors.white,
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
  },
});
