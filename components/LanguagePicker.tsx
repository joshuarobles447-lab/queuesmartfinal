import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, FlatList } from 'react-native';
import { Globe } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useApp, useT } from '@/context/AppContext';
import { Language } from '@/constants/translations';

const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'fil', label: 'Filipino', flag: '🇵🇭' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
];

export default function LanguagePicker() {
  const { language, setLanguage } = useApp();
  const t = useT();
  const [visible, setVisible] = useState(false);

  const current = LANGUAGES.find((l) => l.code === language);

  return (
    <>
      <TouchableOpacity style={styles.btn} onPress={() => setVisible(true)} activeOpacity={0.8}>
        <Globe color={Colors.teal} size={14} />
        <Text style={styles.btnText}>{current?.flag} {current?.code.toUpperCase()}</Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setVisible(false)}>
          <View style={styles.menu}>
            <Text style={styles.menuTitle}>{t('language')}</Text>
            {LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[styles.menuItem, language === lang.code && styles.menuItemActive]}
                onPress={() => { setLanguage(lang.code); setVisible(false); }}
              >
                <Text style={styles.menuFlag}>{lang.flag}</Text>
                <Text style={[styles.menuLabel, language === lang.code && styles.menuLabelActive]}>
                  {lang.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.card,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  btnText: {
    color: Colors.teal,
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    width: 220,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  menuTitle: {
    color: Colors.grayLight,
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  menuItemActive: {
    backgroundColor: Colors.tealDark,
  },
  menuFlag: {
    fontSize: 20,
  },
  menuLabel: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  menuLabelActive: {
    fontFamily: 'Poppins-Bold',
    color: Colors.white,
  },
});
