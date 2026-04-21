import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useApp, useT } from '@/context/AppContext';
import Logo from '@/components/Logo';

export default function LeaveOptionsScreen() {
  const router = useRouter();
  const { ticketNumber } = useApp();
  const t = useT();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.8}>
          <ArrowLeft color={Colors.white} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('leaveQueue')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('yourCurrentTicket')}</Text>
          <Text style={styles.ticketNum}>{ticketNumber}</Text>
        </View>

        <Text style={styles.helperText}>{t('leavingRemove')}</Text>

        <Text style={styles.sectionTitle}>{t('whatWouldYouLike')}</Text>

        <TouchableOpacity
          style={styles.option}
          onPress={() => router.push('/(customer)/reschedule')}
          activeOpacity={0.8}
        >
          <Text style={styles.optionTitle}>{t('rescheduleForLater')}</Text>
          <Text style={styles.optionSubtitle}>Choose a new date and time</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() => router.push('/(customer)/leave-confirm')}
          activeOpacity={0.8}
        >
          <Text style={styles.optionTitle}>{t('leaveQueuePermanently')}</Text>
          <Text style={styles.optionSubtitle}>Your ticket will be cancelled</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, styles.cancelOption]}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Text style={styles.cancelText}>{t('cancel')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
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
    color: Colors.white,
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
  },
  scroll: { padding: 16, paddingBottom: 40 },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  cardTitle: {
    color: Colors.gray,
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    marginBottom: 8,
  },
  ticketNum: {
    color: Colors.teal,
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
  },
  helperText: {
    color: Colors.grayLight,
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    marginBottom: 24,
    textAlign: 'center',
  },
  sectionTitle: {
    color: Colors.grayLight,
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  option: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.teal,
  },
  optionTitle: {
    color: Colors.white,
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 4,
  },
  optionSubtitle: {
    color: Colors.gray,
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  cancelOption: {
    borderColor: Colors.gray,
    marginTop: 20,
  },
  cancelText: {
    color: Colors.gray,
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
  },
});
