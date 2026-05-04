import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, FlatList, Alert, Modal
} from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, Settings, Phone, SkipForward, RotateCcw, X, Pause } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useApp, useT } from '@/context/AppContext';
import { supabase } from '@/lib/supabase';
import QRCode from 'react-native-qrcode-svg';

interface Customer {
  id: string;
  name: string;
  ticketNumber: string;
  waitTime: number;
  status: 'waiting' | 'called' | 'no-show';
  created_at?: string;
}

export default function StaffPanelScreen() {
  const router = useRouter();
  const { appSettings } = useApp();
  const t = useT();

  const [acceptingCustomers, setAcceptingCustomers] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);

  const [queueList, setQueueList] = useState<Customer[]>([]);

  useEffect(() => {
    const fetchQueue = async () => {
      const { data, error } = await supabase
        .from('queue_entries')
        .select('*')
        .eq('status', 'waiting')
        .order('created_at', { ascending: true });

      if (data) {
        const mappedQueue = data.map((entry: any) => ({
          id: entry.id.toString(),
          name: entry.customer_name || 'Unknown User',
          ticketNumber: entry.ticket,
          waitTime: Math.floor((new Date().getTime() - new Date(entry.created_at).getTime()) / 60000),
          status: entry.status,
          created_at: entry.created_at,
        }));
        setQueueList(mappedQueue);
      }
    };

    fetchQueue();

    const channel = supabase
      .channel('public:queue_entries')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'queue_entries' },
        () => {
          fetchQueue();
        }
      )
      .subscribe();

    const interval = setInterval(() => {
      setQueueList(prev => prev.map(item => ({
        ...item,
        waitTime: item.created_at ? Math.floor((new Date().getTime() - new Date(item.created_at).getTime()) / 60000) : item.waitTime
      })));
    }, 60000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  const handleCallNext = () => {
    if (queueList.length > 0) {
      Alert.alert('Success', `Called customer: ${queueList[0].name}`, [{ text: 'OK' }]);
      const newQueue = queueList.slice(1);
      setQueueList(newQueue);
    } else {
      Alert.alert('Queue Empty', 'No customers waiting', [{ text: 'OK' }]);
    }
  };

  const handleSkip = () => {
    if (queueList.length > 0) {
      const skipped = queueList[0];
      Alert.alert('Skipped', `Skipped: ${skipped.name}`, [{ text: 'OK' }]);
      const newQueue = [...queueList.slice(1), skipped];
      setQueueList(newQueue);
    }
  };

  const handleReCall = () => {
    if (currentCustomer) {
      Alert.alert('Re-called', `Re-called: ${currentCustomer.name}`, [{ text: 'OK' }]);
    }
  };

  const handleRemove = (id: string) => {
    const customer = queueList.find(c => c.id === id);
    if (customer) {
      Alert.alert('Removed', `Removed: ${customer.name}`, [{ text: 'OK' }]);
      setQueueList(queueList.filter(c => c.id !== id));
    }
  };

  const handleTogglePause = () => {
    setIsPaused(!isPaused);
    Alert.alert(
      isPaused ? 'Queue Resumed' : 'Queue Paused',
      isPaused ? 'You are now accepting customers' : 'Queue is paused',
      [{ text: 'OK' }]
    );
  };

  const handleToggleAccepting = () => {
    setAcceptingCustomers(!acceptingCustomers);
  };

  const renderQueueItem = (item: Customer) => (
    <View style={styles.queueItem}>
      <View style={styles.queueLeft}>
        <View style={styles.ticketBadge}>
          <Text style={styles.ticketNumber}>{item.ticketNumber}</Text>
        </View>
        <View style={styles.customerInfo}>
          <Text style={styles.customerName}>{item.name}</Text>
          <Text style={styles.waitTime}>Waiting: {item.waitTime} min</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.removeBtn}
        onPress={() => handleRemove(item.id)}
      >
        <X color={Colors.danger} size={20} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Staff Panel</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity
              onPress={() => router.push('/(staff)/notifications')}
              style={styles.headerIconBtn}
            >
              <Bell color={Colors.textPrimary} size={24} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/(staff)/profile')}
              style={styles.headerIconBtn}
            >
              <Settings color={Colors.textPrimary} size={24} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Status Bar */}
        <View style={styles.statusBar}>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>In Queue</Text>
            <Text style={styles.statusValue}>{queueList.length}</Text>
          </View>
          <View style={[styles.statusItem, styles.statusDivider]}>
            <Text style={styles.statusLabel}>Accepting</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: acceptingCustomers ? Colors.success : Colors.danger },
              ]}
            >
              <Text style={styles.statusBadgeText}>
                {acceptingCustomers ? 'Yes' : 'No'}
              </Text>
            </View>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Status</Text>
            <Text style={[styles.statusValue, { color: isPaused ? Colors.danger : Colors.success }]}>
              {isPaused ? 'Paused' : 'Active'}
            </Text>
          </View>
        </View>

        {/* Now Serving Section */}
        {currentCustomer && (
          <View style={styles.nowServingSection}>
            <Text style={styles.sectionTitle}>Now Serving</Text>
            <View style={styles.nowServingCard}>
              <View style={styles.nowServingContent}>
                <Text style={styles.nowServingLabel}>Ticket</Text>
                <Text style={styles.nowServingTicket}>{currentCustomer.ticketNumber}</Text>
                <Text style={styles.nowServingName}>{currentCustomer.name}</Text>
                <View style={styles.waitingBadge}>
                  <Text style={styles.waitingText}>In Service</Text>
                </View>
              </View>
              <View style={styles.nowServingActions}>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.actionBtnPrimary]}
                  onPress={handleReCall}
                >
                  <RotateCcw color={Colors.white} size={20} />
                  <Text style={styles.actionBtnText}>Re-call</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtonsSection}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnLarge, styles.actionBtnPrimary]}
            onPress={handleCallNext}
          >
            <Phone color={Colors.white} size={20} />
            <Text style={styles.actionBtnText}>Call Next</Text>
          </TouchableOpacity>

          <View style={styles.actionButtonRow}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnSmall, styles.actionBtnSecondary]}
              onPress={handleSkip}
            >
              <SkipForward color={Colors.textPrimary} size={18} />
              <Text style={styles.actionBtnSmallText}>Skip</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnSmall, styles.actionBtnWarning]}
              onPress={handleTogglePause}
            >
              <Pause color={Colors.white} size={18} />
              <Text style={styles.actionBtnSmallText}>{isPaused ? 'Resume' : 'Pause'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionBtn,
                styles.actionBtnSmall,
                acceptingCustomers ? styles.actionBtnDanger : styles.actionBtnSuccess,
              ]}
              onPress={handleToggleAccepting}
            >
              <Text style={styles.actionBtnSmallText}>
                {acceptingCustomers ? 'Stop' : 'Accept'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnLarge, { backgroundColor: Colors.cardDark, marginTop: 12 }]}
            onPress={() => setShowQR(true)}
          >
            <Text style={[styles.actionBtnText, { color: Colors.teal }]}>Show Shop QR Code</Text>
          </TouchableOpacity>
        </View>

        {/* Queue List */}
        <View style={styles.queueSection}>
          <Text style={styles.sectionTitle}>Queue ({queueList.length})</Text>
          {queueList.length > 0 ? (
            <FlatList
              scrollEnabled={false}
              data={queueList}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => renderQueueItem(item)}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          ) : (
            <View style={styles.emptyQueue}>
              <Text style={styles.emptyQueueText}>No customers in queue</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <Modal visible={showQR} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Scan to Join Queue</Text>
            <View style={styles.qrContainer}>
              <QRCode value="SMARTQUEUE:JOIN" size={200} color={Colors.teal} backgroundColor={Colors.card} />
            </View>
            <Text style={styles.modalSubtitle}>Customers can scan this code to enter the queue</Text>
            <TouchableOpacity style={styles.closeModalBtn} onPress={() => setShowQR(false)}>
              <Text style={styles.closeModalBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    paddingVertical: 16,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    fontFamily: 'Poppins',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  headerIconBtn: {
    padding: 8,
  },
  statusBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statusItem: {
    flex: 1,
    alignItems: 'center',
  },
  statusDivider: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: Colors.border,
  },
  statusLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: 'Poppins',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  statusValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.teal,
    fontFamily: 'Poppins',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.white,
    fontFamily: 'Poppins',
  },
  nowServingSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    fontFamily: 'Poppins',
    marginBottom: 12,
  },
  nowServingCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.teal,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nowServingContent: {
    flex: 1,
  },
  nowServingLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: 'Poppins',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  nowServingTicket: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.teal,
    fontFamily: 'Poppins',
    marginBottom: 4,
  },
  nowServingName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    fontFamily: 'Poppins',
    marginBottom: 8,
  },
  waitingBadge: {
    backgroundColor: Colors.success,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  waitingText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.white,
    fontFamily: 'Poppins',
  },
  nowServingActions: {
    marginLeft: 16,
  },
  actionButtonsSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  actionBtn: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    flexDirection: 'row',
  },
  actionBtnLarge: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  actionBtnSmall: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  actionBtnPrimary: {
    backgroundColor: Colors.teal,
  },
  actionBtnSecondary: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionBtnWarning: {
    backgroundColor: Colors.warning,
  },
  actionBtnDanger: {
    backgroundColor: Colors.danger,
  },
  actionBtnSuccess: {
    backgroundColor: Colors.success,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
    fontFamily: 'Poppins',
  },
  actionBtnSmallText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.white,
    fontFamily: 'Poppins',
  },
  actionButtonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  queueSection: {
    paddingHorizontal: 16,
  },
  queueItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  queueLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  ticketBadge: {
    backgroundColor: Colors.teal,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 12,
    minWidth: 50,
    alignItems: 'center',
  },
  ticketNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
    fontFamily: 'Poppins',
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    fontFamily: 'Poppins',
    marginBottom: 4,
  },
  waitTime: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: 'Poppins',
  },
  removeBtn: {
    padding: 8,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border,
  },
  emptyQueue: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyQueueText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: 'Poppins',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.white,
    fontFamily: 'Poppins',
    marginBottom: 24,
  },
  qrContainer: {
    padding: 16,
    backgroundColor: Colors.card,
    borderRadius: 16,
    marginBottom: 24,
  },
  modalSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: 'Poppins',
    textAlign: 'center',
    marginBottom: 32,
  },
  closeModalBtn: {
    backgroundColor: Colors.teal,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  closeModalBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
    fontFamily: 'Poppins',
  },
});
