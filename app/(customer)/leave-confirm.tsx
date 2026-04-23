import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, AlertCircle } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useApp, useT } from '@/context/AppContext';
import Logo from '@/components/Logo';

export default function LeaveConfirmScreen() {
  const router = useRouter();
  const t = useT();
  const { ticketNumber } = useApp();

  const handleLeave = () => {
    // Handle leave queue action and go back to start
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.8}>
          <ArrowLeft color={Colors.white} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('leaveQueueTitle')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.warningCard}>
          <AlertCircle color={Colors.red} size={48} />
          <Text style={styles.warningTitle}>{t('leaveQueueTitle')}</Text>
          <Text style={styles.warningSubtitle}>{t('leaveQueueSubtitle')}</Text>
        </View>

        <View style={styles.ticketCard}>
          <Text style={styles.ticketLabel}>{t('yourCurrentTicket')}</Text>
          <Text style={styles.ticketNumber}>{ticketNumber}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>{t('leavingRemove')}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.leaveButton}
            onPress={handleLeave}
            activeOpacity={0.85}
          >
            <Text style={styles.leaveButtonText}>{t('yesLeave')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
            activeOpacity={0.85}
          >
            <Text style={styles.cancelButtonText}>{t('cancel')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    fontFamily: 'Poppins',
  },
  scroll: {
    padding: 16,
    paddingBottom: 32,
  },
  warningCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 24,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: Colors.red,
    alignItems: 'center',
  },
  warningTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
    fontFamily: 'Poppins',
    textAlign: 'center',
  },
  warningSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: 'Poppins',
    textAlign: 'center',
    lineHeight: 20,
  },
  ticketCard: {
    backgroundColor: Colors.cardDark,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  ticketLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: 'Poppins',
    marginBottom: 4,
  },
  ticketNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.teal,
    fontFamily: 'Poppins',
  },
  infoBox: {
    backgroundColor: Colors.cardDark,
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    borderLeftWidth: 4,
    borderLeftColor: Colors.orange,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: 'Poppins',
    lineHeight: 20,
  },
  buttonContainer: {
    gap: 12,
  },
  leaveButton: {
    backgroundColor: Colors.red,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.red,
  },
  leaveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
    fontFamily: 'Poppins',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.teal,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.teal,
    fontFamily: 'Poppins',
  },
});
