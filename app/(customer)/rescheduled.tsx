import React, { useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { CheckCircle, ArrowRight } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useT } from '@/context/AppContext';

export default function RescheduledScreen() {
  const router = useRouter();
  const t = useT();

  const handleGoHome = () => {
    router.push('/(customer)');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.container}>
          <View style={styles.celebrationBox}>
            <CheckCircle color={Colors.success} size={64} />
            <Text style={styles.celebrationText}>{t('youveRescheduled')}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Rescheduled Details</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>New Date & Time:</Text>
              <Text style={styles.infoValue}>Mar 16, 10:00 AM</Text>
            </View>
            <View style={[styles.infoRow, styles.infoRowLast]}>
              <Text style={styles.infoLabel}>Confirmation:</Text>
              <Text style={styles.infoValue}>Email & SMS</Text>
            </View>
          </View>

          <View style={styles.messageBox}>
            <Text style={styles.messageText}>{t('visitBuilding')}</Text>
          </View>

          <View style={styles.nextStepsBox}>
            <Text style={styles.nextStepsTitle}>What happens next?</Text>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepText}>We will send you a reminder via email and SMS</Text>
            </View>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepText}>Visit us only during office hours on your scheduled date</Text>
            </View>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepText}>Show your confirmation code at entry</Text>
            </View>
          </View>

          <View style={styles.confirmationCode}>
            <Text style={styles.confirmationLabel}>Confirmation Code</Text>
            <Text style={styles.confirmationNumber}>RES-20260321-12345</Text>
            <Text style={styles.confirmationHint}>Save this for reference</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={handleGoHome}
          activeOpacity={0.85}
        >
          <Text style={styles.homeButtonText}>Back to Home</Text>
          <ArrowRight color={Colors.white} size={20} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    paddingVertical: 24,
    paddingBottom: 100,
  },
  container: {
    paddingHorizontal: 16,
  },
  celebrationBox: {
    alignItems: 'center',
    marginBottom: 32,
  },
  celebrationText: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    fontFamily: 'Poppins',
    marginTop: 16,
    textAlign: 'center',
    lineHeight: 36,
  },
  infoCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.teal,
    fontFamily: 'Poppins',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  infoRowLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  infoLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: 'Poppins',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    fontFamily: 'Poppins',
  },
  messageBox: {
    backgroundColor: Colors.cardDark,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: Colors.green,
  },
  messageText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: 'Poppins',
    lineHeight: 20,
  },
  nextStepsBox: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  nextStepsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    fontFamily: 'Poppins',
    marginBottom: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.teal,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.white,
    fontFamily: 'Poppins',
  },
  stepText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: 'Poppins',
    lineHeight: 18,
  },
  confirmationCode: {
    backgroundColor: Colors.cardDark,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.teal,
  },
  confirmationLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: 'Poppins',
    marginBottom: 8,
  },
  confirmationNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.teal,
    fontFamily: 'Poppins',
    marginBottom: 6,
    letterSpacing: 1,
  },
  confirmationHint: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontFamily: 'Poppins',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    padding: 16,
  },
  homeButton: {
    backgroundColor: Colors.teal,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
    fontFamily: 'Poppins',
  },
});
