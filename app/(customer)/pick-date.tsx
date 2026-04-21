import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Calendar } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useT } from '@/context/AppContext';

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

interface DateSlot {
  id: string;
  date: string;
  day: string;
  slots: TimeSlot[];
}

const DATE_SLOTS: DateSlot[] = [
  {
    id: '1',
    date: 'Mar 15',
    day: 'Tomorrow',
    slots: [
      { id: '1-1', time: '09:00 AM', available: true },
      { id: '1-2', time: '10:00 AM', available: true },
      { id: '1-3', time: '11:00 AM', available: false },
      { id: '1-4', time: '02:00 PM', available: true },
      { id: '1-5', time: '03:00 PM', available: true },
    ],
  },
  {
    id: '2',
    date: 'Mar 16',
    day: 'Friday',
    slots: [
      { id: '2-1', time: '09:00 AM', available: true },
      { id: '2-2', time: '10:00 AM', available: true },
      { id: '2-3', time: '11:00 AM', available: true },
      { id: '2-4', time: '02:00 PM', available: false },
      { id: '2-5', time: '03:00 PM', available: true },
    ],
  },
  {
    id: '3',
    date: 'Mar 17',
    day: 'Saturday',
    slots: [
      { id: '3-1', time: '09:00 AM', available: true },
      { id: '3-2', time: '10:00 AM', available: false },
      { id: '3-3', time: '11:00 AM', available: true },
      { id: '3-4', time: '02:00 PM', available: true },
      { id: '3-5', time: '03:00 PM', available: true },
    ],
  },
];

export default function PickDateScreen() {
  const router = useRouter();
  const t = useT();
  const [selectedDate, setSelectedDate] = useState<string>('1');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const currentDateSlots = DATE_SLOTS.find((d) => d.id === selectedDate);

  const handleConfirm = () => {
    if (selectedSlot) {
      router.push('/(customer)/rescheduled');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.8}>
          <ArrowLeft color={Colors.white} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('pickDate')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.helperText}>{t('chooseSlot')}</Text>

        <View style={styles.dateSelector}>
          {DATE_SLOTS.map((dateSlot) => (
            <TouchableOpacity
              key={dateSlot.id}
              style={[
                styles.dateItem,
                selectedDate === dateSlot.id && styles.dateItemSelected,
              ]}
              onPress={() => setSelectedDate(dateSlot.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.dateText}>{dateSlot.date}</Text>
              <Text style={styles.dayText}>{dateSlot.day}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Available Times</Text>

        <View style={styles.timeSlots}>
          {currentDateSlots?.slots.map((slot) => (
            <TouchableOpacity
              key={slot.id}
              style={[
                styles.timeSlot,
                selectedSlot === slot.id && styles.timeSlotSelected,
                !slot.available && styles.timeSlotDisabled,
              ]}
              onPress={() => slot.available && setSelectedSlot(slot.id)}
              disabled={!slot.available}
              activeOpacity={0.8}
            >
              <Calendar
                color={
                  selectedSlot === slot.id
                    ? Colors.white
                    : slot.available
                    ? Colors.teal
                    : Colors.gray
                }
                size={16}
              />
              <Text
                style={[
                  styles.timeSlotText,
                  selectedSlot === slot.id && styles.timeSlotTextSelected,
                  !slot.available && styles.timeSlotTextDisabled,
                ]}
              >
                {slot.time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>{t('headsUp')}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.confirmButton,
              !selectedSlot && styles.confirmButtonDisabled,
            ]}
            onPress={handleConfirm}
            disabled={!selectedSlot}
            activeOpacity={0.85}
          >
            <Text style={styles.confirmButtonText}>{t('confirmReschedule')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.leaveButton}
            onPress={() => router.push('/(customer)/leave-confirm')}
            activeOpacity={0.85}
          >
            <Text style={styles.leaveButtonText}>{t('leaveQueueInstead')}</Text>
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
  dateSelector: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 10,
  },
  dateItem: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  dateItemSelected: {
    borderColor: Colors.teal,
    backgroundColor: Colors.cardDark,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    fontFamily: 'Poppins',
  },
  dayText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: 'Poppins',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    fontFamily: 'Poppins',
    marginBottom: 12,
  },
  timeSlots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  timeSlot: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeSlotSelected: {
    backgroundColor: Colors.teal,
    borderColor: Colors.teal,
  },
  timeSlotDisabled: {
    opacity: 0.5,
  },
  timeSlotText: {
    fontSize: 12,
    color: Colors.textPrimary,
    fontFamily: 'Poppins',
    marginTop: 6,
  },
  timeSlotTextSelected: {
    color: Colors.white,
    fontWeight: '600',
  },
  timeSlotTextDisabled: {
    color: Colors.gray,
  },
  infoBox: {
    backgroundColor: Colors.cardDark,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: Colors.teal,
  },
  infoText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: 'Poppins',
    lineHeight: 18,
  },
  buttonContainer: {
    gap: 12,
  },
  confirmButton: {
    backgroundColor: Colors.teal,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: Colors.gray,
    opacity: 0.5,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
    fontFamily: 'Poppins',
  },
  leaveButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.red,
  },
  leaveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.red,
    fontFamily: 'Poppins',
  },
});
