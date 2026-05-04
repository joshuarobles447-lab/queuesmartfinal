import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Hop as Home, Bell, User } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useApp, useT } from '@/context/AppContext';
import Logo from '@/components/Logo';
import { supabase } from '@/lib/supabase';

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

const getOrdinalSuffix = (value: number) => {
  if (value === 0) return '';
  const remainder10 = value % 10;
  const remainder100 = value % 100;
  if (remainder100 >= 11 && remainder100 <= 13) return 'th';
  if (remainder10 === 1) return 'st';
  if (remainder10 === 2) return 'nd';
  if (remainder10 === 3) return 'rd';
  return 'th';
};

export default function CustomerHomeScreen() {
  const router = useRouter();
  const t = useT();
  const { queueList: defaultQueueList } = useApp();
  
  const [ticketNumber, setTicketNumber] = useState<string>('None');
  const [queuePosition, setQueuePosition] = useState<number>(0);
  const [queueList, setQueueList] = useState(defaultQueueList);

  useEffect(() => {
    const fetchMyQueue = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id;
      if (!userId) return;

      const { data: myEntries } = await supabase
        .from('queue_entries')
        .select('*')
        .eq('user_id', userId)
        .in('status', ['waiting', 'called'])
        .order('created_at', { ascending: false })
        .limit(1);

      if (myEntries && myEntries.length > 0) {
        const myEntry = myEntries[0];
        setTicketNumber(myEntry.ticket);

        // Fetch everyone in the same queue
        if (myEntry.queue_code) {
          const { data: allEntries } = await supabase
            .from('queue_entries')
            .select('*')
            .eq('queue_code', myEntry.queue_code)
            .eq('status', 'waiting')
            .order('created_at', { ascending: true });

          if (allEntries) {
            const pos = allEntries.findIndex((e: any) => e.id === myEntry.id) + 1;
            setQueuePosition(pos > 0 ? pos : 0);
            
            // Map queueList for display
            const mappedList = allEntries.slice(0, 5).map((e: any, index: number) => ({
              ticket: e.ticket,
              status: index === 0 ? 'serving' : index === 1 ? 'next' : 'standby'
            }));
            setQueueList(mappedList);
          }
        }
      } else {
        setTicketNumber('None');
        setQueuePosition(0);
      }
    };

    fetchMyQueue();

    const channel = supabase
      .channel('public:queue_entries')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'queue_entries' },
        () => {
          fetchMyQueue();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
              <Text style={styles.statValue}>{queuePosition}{getOrdinalSuffix(queuePosition)}</Text>
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
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push('/(customer)/profile')}
          activeOpacity={0.8}
        >
          <User color={Colors.gray} size={24} />
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
    alignItems: 'flex-start',
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
