import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bell } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useT } from '@/context/AppContext';

interface Notification {
  id: string;
  type: 'call' | 'position' | 'info' | 'completed';
  title: string;
  message: string;
  time: string;
}

export default function NotificationsScreen() {
  const router = useRouter();
  const t = useT();

  const notifications: Notification[] = [
    {
      id: '1',
      type: 'call',
      title: t('beingCalled'),
      message: t('calledToCounter'),
      time: t('rightNow'),
    },
    {
      id: '2',
      type: 'position',
      title: t('secondInLine'),
      message: `${t('ticket')} A-042`,
      time: '2 min ago',
    },
    {
      id: '3',
      type: 'info',
      title: t('queueJoined'),
      message: `${t('ticket')} A-041`,
      time: '1 hour ago',
    },
    {
      id: '4',
      type: 'completed',
      title: t('serviceCompleted'),
      message: `${t('ticket')} A-040`,
      time: t('earlierToday'),
    },
  ];

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'call':
        return Colors.red;
      case 'position':
        return Colors.orange;
      case 'info':
        return Colors.teal;
      case 'completed':
        return Colors.green;
      default:
        return Colors.gray;
    }
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <View style={styles.notifItem}>
      <View
        style={[
          styles.notifIcon,
          { backgroundColor: getNotificationColor(item.type) },
        ]}
      >
        <Bell color={Colors.white} size={18} />
      </View>
      <View style={styles.notifContent}>
        <Text style={styles.notifTitle}>{item.title}</Text>
        <Text style={styles.notifMessage}>{item.message}</Text>
      </View>
      <Text style={styles.notifTime}>{item.time}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.8}>
          <ArrowLeft color={Colors.white} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('notifications')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.sectionTitle}>{t('rightNow')}</Text>
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
        />

        <TouchableOpacity style={styles.settingsBtn}>
          <Text style={styles.settingsBtnText}>{t('notificationSettings')}</Text>
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
  sectionTitle: {
    color: Colors.grayLight,
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  notifItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  notifIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifContent: { flex: 1 },
  notifTitle: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 2,
  },
  notifMessage: {
    color: Colors.gray,
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  notifTime: {
    color: Colors.gray,
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 4,
  },
  settingsBtn: {
    backgroundColor: Colors.card,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  settingsBtnText: {
    color: Colors.teal,
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
});
