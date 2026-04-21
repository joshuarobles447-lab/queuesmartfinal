import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useApp, useT } from '@/context/AppContext';

const RESCHEDULE_REASONS = [
  'runningLate',
  'somethingCameUp',
  'waitTooLong',
  'wrongBranch',
  'otherReason',
];

export default function RescheduleScreen() {
  const router = useRouter();
  const t = useT();
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [note, setNote] = useState('');

  const handleContinue = () => {
    if (selectedReason) {
      router.push('/(customer)/pick-date');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.8}>
          <ArrowLeft color={Colors.white} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('rescheduleTitle')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.helperText}>{t('rescheduleHelp')}</Text>

        <View style={styles.reasonsList}>
          {RESCHEDULE_REASONS.map((reason) => (
            <TouchableOpacity
              key={reason}
              style={[
                styles.reasonItem,
                selectedReason === reason && styles.reasonItemSelected,
              ]}
              onPress={() => setSelectedReason(reason)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.radioButton,
                  selectedReason === reason && styles.radioButtonSelected,
                ]}
              >
                {selectedReason === reason && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
              <Text style={styles.reasonText}>{t(reason)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.noteSection}>
          <Text style={styles.noteLabel}>{t('addNote')}</Text>
          <TextInput
            style={styles.noteInput}
            placeholder={t('addNote')}
            placeholderTextColor={Colors.textSecondary}
            value={note}
            onChangeText={setNote}
            multiline
            maxLength={200}
          />
          <Text style={styles.charCount}>{note.length}/200</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              !selectedReason && styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!selectedReason}
            activeOpacity={0.85}
          >
            <Text style={styles.continueButtonText}>{t('continuePick')}</Text>
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
  helperText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: 'Poppins',
    marginBottom: 20,
    lineHeight: 20,
  },
  reasonsList: {
    marginBottom: 24,
    gap: 12,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  reasonItemSelected: {
    borderColor: Colors.teal,
    backgroundColor: Colors.cardDark,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.textSecondary,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: Colors.teal,
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.teal,
  },
  reasonText: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontFamily: 'Poppins',
    flex: 1,
  },
  noteSection: {
    marginBottom: 24,
  },
  noteLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    fontFamily: 'Poppins',
    marginBottom: 8,
  },
  noteInput: {
    backgroundColor: Colors.inputBg,
    borderRadius: 12,
    padding: 12,
    color: Colors.textPrimary,
    fontFamily: 'Poppins',
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  charCount: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: 'Poppins',
    marginTop: 6,
    textAlign: 'right',
  },
  buttonContainer: {
    gap: 12,
  },
  continueButton: {
    backgroundColor: Colors.teal,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: Colors.gray,
    opacity: 0.5,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
    fontFamily: 'Poppins',
  },
});
