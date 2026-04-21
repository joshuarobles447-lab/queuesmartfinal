import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, Modal, TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';
import { Colors } from '@/constants/colors';
import { useT, useApp } from '@/context/AppContext';
import Logo from '@/components/Logo';

export default function QRScanScreen() {
  const router = useRouter();
  const t = useT();
  const { ticketNumber } = useApp();
  const [codeModal, setCodeModal] = useState(false);
  const [manualCode, setManualCode] = useState('');

  const handleJoin = () => {
    router.replace('/');
  };

  const handleManualJoin = () => {
    setCodeModal(false);
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.logoRow}>
          <Logo size="small" />
        </View>

        <Text style={styles.title}>{t('scanQr')}</Text>

        <View style={styles.qrContainer}>
          <View style={styles.qrBox}>
            <QRCode
              value={`SMARTQUEUE:${ticketNumber}`}
              size={180}
              backgroundColor="white"
              color="black"
            />
          </View>
          <View style={styles.cornerTL} />
          <View style={styles.cornerTR} />
          <View style={styles.cornerBL} />
          <View style={styles.cornerBR} />
        </View>

        <Text style={styles.showText}>{t('showGuard')}</Text>

        <TouchableOpacity style={styles.joinBtn} onPress={handleJoin} activeOpacity={0.85}>
          <Text style={styles.joinBtnText}>{t('joinQueue')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.manualBtn}
          onPress={() => setCodeModal(true)}
          activeOpacity={0.85}
        >
          <Text style={styles.manualBtnText}>{t('enterCodeManually')}</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={codeModal} transparent animationType="slide" onRequestClose={() => setCodeModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{t('enterCodeManually')}</Text>
            <TextInput
              style={styles.codeInput}
              value={manualCode}
              onChangeText={setManualCode}
              placeholder="A-001"
              placeholderTextColor={Colors.gray}
              autoCapitalize="characters"
              textAlign="center"
            />
            <TouchableOpacity style={styles.joinBtn} onPress={handleManualJoin} activeOpacity={0.85}>
              <Text style={styles.joinBtnText}>{t('joinQueue')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setCodeModal(false)} style={{ marginTop: 12 }}>
              <Text style={styles.cancelText}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  logoRow: { marginBottom: 24 },
  title: {
    color: Colors.white,
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    marginBottom: 28,
  },
  qrContainer: {
    position: 'relative',
    padding: 4,
    marginBottom: 20,
  },
  qrBox: {
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
  },
  cornerTL: {
    position: 'absolute', top: 0, left: 0,
    width: 28, height: 28,
    borderTopWidth: 4, borderLeftWidth: 4,
    borderColor: Colors.teal, borderTopLeftRadius: 8,
  },
  cornerTR: {
    position: 'absolute', top: 0, right: 0,
    width: 28, height: 28,
    borderTopWidth: 4, borderRightWidth: 4,
    borderColor: Colors.teal, borderTopRightRadius: 8,
  },
  cornerBL: {
    position: 'absolute', bottom: 0, left: 0,
    width: 28, height: 28,
    borderBottomWidth: 4, borderLeftWidth: 4,
    borderColor: Colors.teal, borderBottomLeftRadius: 8,
  },
  cornerBR: {
    position: 'absolute', bottom: 0, right: 0,
    width: 28, height: 28,
    borderBottomWidth: 4, borderRightWidth: 4,
    borderColor: Colors.teal, borderBottomRightRadius: 8,
  },
  showText: {
    color: Colors.grayLight,
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginBottom: 28,
    paddingHorizontal: 20,
  },
  joinBtn: {
    backgroundColor: Colors.teal,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  joinBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  manualBtn: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  manualBtnText: {
    color: Colors.grayLight,
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalBox: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modalTitle: {
    color: Colors.white,
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginBottom: 16,
  },
  codeInput: {
    backgroundColor: Colors.inputBg,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: Colors.white,
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    width: '100%',
    marginBottom: 16,
    letterSpacing: 4,
  },
  cancelText: {
    color: Colors.gray,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
});
