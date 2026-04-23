import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, Switch, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Clock, Edit2, Save } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useApp, useT } from '@/context/AppContext';

interface BusinessHours {
  day: string;
  open: string;
  close: string;
  closed: boolean;
}

export default function ProfileScreen() {
  const router = useRouter();
  const { appSettings, setIsLoggedIn, setRole } = useApp();
  const t = useT();

  const [isEditing, setIsEditing] = useState(false);
  const [acceptingCustomers, setAcceptingCustomers] = useState(true);
  const [servedToday, setServedToday] = useState(12);

  const [businessHours, setBusinessHours] = useState<BusinessHours[]>([
    { day: 'Monday', open: '09:00 AM', close: '06:00 PM', closed: false },
    { day: 'Tuesday', open: '09:00 AM', close: '06:00 PM', closed: false },
    { day: 'Wednesday', open: '09:00 AM', close: '06:00 PM', closed: false },
    { day: 'Thursday', open: '09:00 AM', close: '06:00 PM', closed: false },
    { day: 'Friday', open: '09:00 AM', close: '06:00 PM', closed: false },
    { day: 'Saturday', open: '10:00 AM', close: '04:00 PM', closed: false },
    { day: 'Sunday', open: '00:00', close: '00:00', closed: true },
  ]);

  const [businessName, setBusinessName] = useState('Grand Dental Clinic');
  const [businessStatus, setBusinessStatus] = useState('Open');

  const handleToggleDay = (index: number) => {
    const updated = [...businessHours];
    updated[index].closed = !updated[index].closed;
    setBusinessHours(updated);
  };

  const handleSave = () => {
    Alert.alert('Success', 'Profile and settings saved', [{ text: 'OK' }]);
    setIsEditing(false);
  };

  const handleToggleAccepting = () => {
    setAcceptingCustomers(!acceptingCustomers);
    setBusinessStatus(acceptingCustomers ? 'Closed' : 'Open');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setRole(null);
    router.replace('/');
  };

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
        <Text style={styles.headerTitle}>Profile & Settings</Text>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
        >
          {isEditing ? (
            <Save color={Colors.teal} size={24} />
          ) : (
            <Edit2 color={Colors.teal} size={24} />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.container}>
          {/* Business Info Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Business Information</Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Business Name</Text>
              <Text style={styles.infoValue}>{businessName}</Text>
            </View>

            <View style={[styles.infoRow, styles.infoRowBorder]}>
              <Text style={styles.infoLabel}>Status</Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: businessStatus === 'Open' ? Colors.success : Colors.danger },
                ]}
              >
                <Text style={styles.statusBadgeText}>{businessStatus}</Text>
              </View>
            </View>
          </View>

          {/* Queue Settings */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Queue Settings</Text>

            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingLabel}>Accept New Customers</Text>
                <Text style={styles.settingDescription}>
                  {acceptingCustomers ? 'Accepting customers' : 'Not accepting customers'}
                </Text>
              </View>
              <Switch
                value={acceptingCustomers}
                onValueChange={handleToggleAccepting}
                trackColor={{ false: Colors.border, true: Colors.teal }}
                thumbColor={Colors.card}
              />
            </View>
          </View>

          {/* Analytics */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Today''s Analytics</Text>

            <View style={styles.analyticsGrid}>
              <View style={styles.analyticsItem}>
                <Text style={styles.analyticsValue}>{servedToday}</Text>
                <Text style={styles.analyticsLabel}>Customers Served</Text>
              </View>

              <View style={[styles.analyticsItem, styles.analyticsBorder]}>
                <Text style={styles.analyticsValue}>45</Text>
                <Text style={styles.analyticsLabel}>Minutes Avg Wait</Text>
              </View>
            </View>
          </View>

          {/* Business Hours */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Business Hours</Text>

            {businessHours.map((hours, index) => (
              <View key={index}>
                <View style={styles.hoursRow}>
                  <View style={styles.hoursLeft}>
                    <Text style={styles.hoursDay}>{hours.day}</Text>
                    {!hours.closed ? (
                      <View style={styles.hoursTime}>
                        <Clock color={Colors.teal} size={14} />
                        <Text style={styles.hoursTimeText}>
                          {hours.open} - {hours.close}
                        </Text>
                      </View>
                    ) : (
                      <Text style={styles.closedText}>Closed</Text>
                    )}
                  </View>
                  {isEditing && (
                    <TouchableOpacity
                      onPress={() => handleToggleDay(index)}
                      style={styles.toggleBtn}
                    >
                      <Text style={styles.toggleText}>
                        {hours.closed ? 'Open' : 'Close'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
                {index < businessHours.length - 1 && <View style={styles.separator} />}
              </View>
            ))}
          </View>

          {/* Account Actions */}
          <View style={styles.card}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Change Password</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonDanger]}
              onPress={handleLogout}
            >
              <Text style={[styles.actionButtonText, styles.actionButtonDangerText]}>
                Logout
              </Text>
            </TouchableOpacity>
          </View>
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
  editBtn: {
    padding: 8,
  },
  scroll: {
    paddingVertical: 16,
    paddingBottom: 32,
  },
  container: {
    paddingHorizontal: 16,
    gap: 20,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    fontFamily: 'Poppins',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoRowBorder: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: 'Poppins',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    fontFamily: 'Poppins',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.white,
    fontFamily: 'Poppins',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLeft: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    fontFamily: 'Poppins',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: 'Poppins',
  },
  analyticsGrid: {
    flexDirection: 'row',
  },
  analyticsItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
  },
  analyticsBorder: {
    borderLeftWidth: 1,
    borderLeftColor: Colors.border,
  },
  analyticsValue: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.teal,
    fontFamily: 'Poppins',
    marginBottom: 4,
  },
  analyticsLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: 'Poppins',
    textAlign: 'center',
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  hoursLeft: {
    flex: 1,
  },
  hoursDay: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    fontFamily: 'Poppins',
    marginBottom: 4,
  },
  hoursTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hoursTimeText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: 'Poppins',
  },
  closedText: {
    fontSize: 12,
    color: Colors.danger,
    fontFamily: 'Poppins',
  },
  toggleBtn: {
    backgroundColor: Colors.cardDark,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  toggleText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.teal,
    fontFamily: 'Poppins',
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border,
  },
  actionButton: {
    backgroundColor: Colors.cardDark,
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  actionButtonDanger: {
    borderColor: Colors.danger,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    fontFamily: 'Poppins',
  },
  actionButtonDangerText: {
    color: Colors.danger,
  },
});
