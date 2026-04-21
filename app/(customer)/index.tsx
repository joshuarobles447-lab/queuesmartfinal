import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Hop as Home, Bell } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useApp, useT } from '@/context/AppContext';
import Logo from '@/components/Logo';

const statusColors: Record<string, string> = {
  serving: Colors.serving,
  next: Colors.nextUp,
  standby: Colors.standby,
};

const statusLabels: Record<string, string> = {
  serving: 'servingNow',
  next: 'nextUp',
  standby: 'standBy',
  call: 'call',
};

export default function CustomerHomeScreen() {
  const router = useRouter();
  const t = useT();
  const { ticketNumber, queuePosition, queueList } = useApp();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Logo size="small" />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.ticketCard}>
          <Text style={styles.ticketLabel}>{t('yourControlNumber')}</Text>
          <Text style={styles.ticketNumber}>{ticketNumber}</Text>
          <View style={styles.ticketRow}>
            <View style={styles.ticketStat}>
              <Text style={styles.statValue}>{queuePosition}{t('inLine') ? 'st' : ''}</Text>
              <Text style={styles.statLabel}>{t('inLine')}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.ticketStat}>
              <Text style={styles.statValue}>{ticketNumber}</Text>
              <Text style={styles.statLabel}>{t('called')}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>{t('queueAheadOf')}</Text>

        <View style={styles.queueList}>
          {queueList.map((item, index) => (
            <View key={index} style={styles.queueItem}>
              <Text style={styles.queueTicket}>{item.ticket}</Text>
              <Text style={[styles.queueStatus, { color: statusColors[item.status] || Colors.gray }]}>
                {t(statusLabels[item.status] || 'standBy')}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.leaveBtn}
            onPress={() => router.push('/(customer)/leave-options')}
            activeOpacity={0.85}
          >
            <Text style={styles.leaveBtnText}>{t('leaveQueue')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.rescheduleBtn}
            onPress={() => router.push('/(customer)/reschedule')}
            activeOpacity={0.85}
          >
            <Text style={styles.rescheduleBtnText}>{t('reschedule')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} activeOpacity={0.8}>
          <Home color={Colors.teal} size={24} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push('/(customer)/notifications')}
          activeOpacity={0.8}
        >
          <Bell color={Colors.gray} size={24} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    alignItems: 'center',
  },
  scroll: { paddingHorizontal: 20, paddingBottom: 20 },
  ticketCard: {
    backgroundColor: Colors.teal,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginVertical: 16,
  },
  ticketLabel: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    marginBottom: 6,
  },
  ticketNumber: {
    color: Colors.white,
    fontSize: 52,
    fontFamily: 'Poppins-Bold',
    letterSpacing: 2,
    lineHeight: 60,
  },
  ticketRow: {
    flexDirection: 'row',
    gap: 24,
    marginTop: 12,
    alignItems: 'center',
  },
  ticketStat: { alignItems: 'center' },
  statValue: {
    color: Colors.white,
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  divider: { width: 1, height: 36, backgroundColor: 'rgba(255,255,255,0.3)' },
  sectionTitle: {
    color: Colors.grayLight,
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 10,
  },
  queueList: { gap: 8, marginBottom: 24 },
  queueItem: {
    backgroundColor: Colors.card,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  queueTicket: {
    color: Colors.white,
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
  },
  queueStatus: {
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
  },
  actionButtons: { gap: 12 },
  leaveBtn: {
    backgroundColor: Colors.red,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  leaveBtnText: {
    color: Colors.white,
    fontSize: 15,
    fontFamily: 'Poppins-Bold',
  },
  rescheduleBtn: {
    backgroundColor: Colors.orange,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  rescheduleBtnText: {
    color: Colors.white,
    fontSize: 15,
    fontFamily: 'Poppins-Bold',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.tabBar,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingVertical: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
});
