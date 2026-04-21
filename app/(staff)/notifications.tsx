import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, AlertTriangle, Info, CheckCircle } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useT } from '@/context/AppContext';

interface Notification {
  id: string;
  type: 'urgent' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: string;
}

export default function NotificationsScreen() {
  const router = useRouter();
  const t = useT();

  const [notifications] = React.useState<Notification[]>([
    {
      id: '1',
      type: 'urgent',
      title: 'No Show Alert',
      message: 'Customer A-001 (John Doe) did not arrive at scheduled time',
      timestamp: '10 min ago',
    },
    {
      id: '2',
      type: 'warning',
      title: 'Queue Full',
      message: 'Maximum queue capacity reached. Accepting new customers is disabled.',
      timestamp: '25 min ago',
    },
    {
      id: '3',
      type: 'info',
      title: 'New Customer',
      message: 'Customer A-006 (Emily Davis) has been added to the queue',
      timestamp: '1 hour ago',
    },
    {
      id: '4',
      type: 'success',
      title: 'Customer Served',
      message: 'Customer A-002 (Jane Smith) has completed their visit',
      timestamp: '1 hour ago',
    },
    {
      id: '5',
      type: 'info',
      title: 'Queue Paused',
      message: 'Queue operations have been paused by staff',
      timestamp: '2 hours ago',
    },
    {
      id: '6',
      type: 'warning',
      title: 'Long Wait Time',
      message: 'Customer A-003 has been waiting for 45 minutes',
      timestamp: '2 hours ago',
    },
    {
      id: '7',
      type: 'success',
      title: 'Queue Resumed',
      message: 'Queue operations have been resumed',
      timestamp: '3 hours ago',
    },
    {
      id: '8',
      type: 'info',
      title: 'Customer Rescheduled',
      message: 'Customer A-004 has rescheduled their appointment',
      timestamp: '4 hours ago',
    },
  ]);

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'urgent':
        return Colors.danger;
      case 'warning':
        return Colors.warning;
      case 'success':
        return Colors.success;
      case 'info':
      default:
        return Colors.teal;
    }
  };

  const getNotificationIcon = (type: string) => {
    const size = 24;
    const color = getNotificationColor(type);

    switch (type) {
      case 'urgent':
        return <AlertTriangle color={color} size={size} />;
      case 'warning':
        return <AlertTriangle color={color} size={size} />;
      case 'success':
        return <CheckCircle color={color} size={size} />;
      case 'info':
      default:
        return <Info color={color} size={size} />;
    }
  };

  const renderNotification = (item: Notification) => (
    <View style={styles.notificationCard}>
      <View
        style={[
          styles.notificationIcon,
          { backgroundColor: `${getNotificationColor(item.type)}20` },
        ]}
      >
        {getNotificationIcon(item.type)}
      </View>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <Text style={styles.notificationTime}>{item.timestamp}</Text>
      </View>
      <View
        style={[styles.notificationBadge, { backgroundColor: getNotificationColor(item.type) }]}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
        >
          <ArrowLeft color={Colors.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Notifications List */}
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.container}>
          {notifications.length > 0 ? (
            <FlatList
              scrollEnabled={false}
              data={notifications}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => renderNotification(item)}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No notifications</Text>
            </View>
          )}
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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    fontFamily: 'Poppins',
  },
  scroll: {
    paddingVertical: 16,
  },
  container: {
    paddingHorizontal: 16,
  },
  notificationCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    fontFamily: 'Poppins',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: 'Poppins',
    lineHeight: 18,
    marginBottom: 6,
  },
  notificationTime: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontFamily: 'Poppins',
  },
  notificationBadge: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginLeft: 12,
    marginTop: 8,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontFamily: 'Poppins',
  },
});
