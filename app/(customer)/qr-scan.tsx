import React, { useEffect, useState } from 'react';
import {
  Alert,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useT } from '@/context/AppContext';
import Logo from '@/components/Logo';
import { supabase } from '@/lib/supabase';

export default function QRScanScreen() {
  const router = useRouter();
  const t = useT();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [showManualEntry, setShowManualEntry] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const saveTicket = async (ticketValue: string) => {
    const ticket = ticketValue.startsWith('SMARTQUEUE:') ? ticketValue.split(':')[1] : ticketValue;
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;

    if (sessionError || !userId) {
      setIsSaving(false);
      Alert.alert('Error', 'Unable to record scan. Please log in again.');
      return;
    }

    const { error } = await supabase.from('queue_entries').insert({
      user_id: userId,
      ticket,
      status: 'waiting',
    });

    setIsSaving(false);

    if (error) {
      Alert.alert('Error', 'Unable to save ticket: ' + error.message);
      return;
    }

    setScanResult(ticket);
    Alert.alert('Success', `Ticket saved: ${ticket}`, [
      {
        text: 'OK',
        onPress: () => router.replace('/(customer)'),
      },
    ]);
  };

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    setIsSaving(true);
    await saveTicket(data);
  };

  const handleManualSubmit = async () => {
    if (!manualCode.trim()) {
      Alert.alert('Error', 'Please enter or scan a valid ticket code.');
      return;
    }

    setScanned(true);
    setIsSaving(true);
    await saveTicket(manualCode.trim());
  };

  const handleScanAgain = () => {
    setScanned(false);
    setScanResult(null);
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <Text style={styles.message}>Requesting camera permission...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <Text style={styles.message}>Camera access is required to scan QR codes.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.logoRow}>
          <Logo size="small" />
        </View>

        <Text style={styles.title}>{t('scanQr')}</Text>

        <CameraView
          style={styles.camera}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        >
          <View style={styles.scanFrame} />
        </CameraView>

        <Text style={styles.scanText}>
          {scanned ? `Scanned: ${scanResult ?? 'unknown'}` : 'Point the camera at a QR code'}
        </Text>

        {!scanned && (
          <View style={styles.manualEntryContainer}>
            <Text style={styles.manualLabel}>{t('enterCodeManually')}</Text>
            <TextInput
              style={styles.manualInput}
              value={manualCode}
              onChangeText={setManualCode}
              placeholder="SMARTQUEUE:A-123"
              placeholderTextColor={Colors.gray}
              autoCapitalize="characters"
              autoCorrect={false}
            />
            <TouchableOpacity style={styles.manualButton} onPress={handleManualSubmit} activeOpacity={0.85}>
              <Text style={styles.manualButtonText}>{t('continue')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {scanned && (
          <TouchableOpacity style={styles.scanAgainButton} onPress={handleScanAgain} activeOpacity={0.85}>
            <Text style={styles.scanAgainText}>Scan again</Text>
          </TouchableOpacity>
        )}

        {isSaving && <Text style={styles.savingText}>Saving scan...</Text>}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  logoRow: {
    alignSelf: 'flex-start',
    marginBottom: 24,
  },
  title: {
    color: Colors.white,
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    marginBottom: 16,
  },
  camera: {
    width: '100%',
    height: 360,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  scanFrame: {
    flex: 1,
    borderWidth: 2,
    borderColor: Colors.teal,
    margin: 48,
    borderRadius: 16,
  },
  scanText: {
    color: Colors.grayLight,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginBottom: 16,
  },
  scanAgainButton: {
    backgroundColor: Colors.teal,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  scanAgainText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  manualEntryContainer: {
    width: '100%',
    marginTop: 24,
    padding: 16,
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  manualLabel: {
    color: Colors.grayLight,
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    marginBottom: 10,
  },
  manualInput: {
    backgroundColor: Colors.inputBg,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: Colors.white,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 12,
  },
  manualButton: {
    backgroundColor: Colors.teal,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  manualButtonText: {
    color: Colors.white,
    fontSize: 15,
    fontFamily: 'Poppins-Bold',
  },
  savingText: {
    color: Colors.gray,
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    marginTop: 10,
  },
  message: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
});
