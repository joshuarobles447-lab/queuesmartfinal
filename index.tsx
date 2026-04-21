import React from "react";
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { Users, Bell, Settings, Play, Pause, SkipForward, RotateCcw, X } from "lucide-react-native";
import { Colors } from "@/constants/colors";
import { useApp, useT } from "@/context/AppContext";

interface QueueItem {
  ticket: string;
  status: "serving" | "next" | "standby" | "call";
}

export default function StaffPanelScreen() {
  const router = useRouter();
  const { queueList, inQueueCount, nowServing, acceptingCustomers, setAcceptingCustomers } = useApp();
  const t = useT();

  const statusColors: Record<string, string> = {
    serving: Colors.serving,
    next: Colors.nextUp,
    standby: Colors.standby,
  };

  const statusLabels: Record<string, string> = {
    serving: t("servingNow"),
    next: t("nextUp"),
    standby: t("standBy"),
    call: t("call"),
  };

  const renderQueueItem = ({ item }: { item: QueueItem }) => (
    <View style={styles.queueItem}>
      <Text style={styles.queueTicket}>{item.ticket}</Text>
      <Text style={[styles.queueStatus, { color: statusColors[item.status] || Colors.gray }]}>
        {statusLabels[item.status] || t("standBy")}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t("staffPanel")}</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => router.push("/(staff)/notifications")} activeOpacity={0.8}>
            <Bell color={Colors.white} size={24} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/(staff)/profile")} activeOpacity={0.8}>
            <Settings color={Colors.white} size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.nowServingCard}>
          <Text style={styles.cardTitle}>{t("nowServing")}</Text>
          <Text style={styles.nowServingTicket}>{nowServing || "None"}</Text>
        </View>

        <View style={styles.queueStats}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{inQueueCount}</Text>
            <Text style={styles.statLabel}>{t("inQueue")}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{acceptingCustomers ? "ON" : "OFF"}</Text>
            <Text style={styles.statLabel}>Accepting</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.85}>
            <Users color={Colors.white} size={20} />
            <Text style={styles.actionBtnText}>{t("callNext")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.85}>
            <SkipForward color={Colors.white} size={20} />
            <Text style={styles.actionBtnText}>{t("skip")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.85}>
            <RotateCcw color={Colors.white} size={20} />
            <Text style={styles.actionBtnText}>{t("reCall")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.85}>
            <X color={Colors.white} size={20} />
            <Text style={styles.actionBtnText}>{t("remove")}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.pauseBtn, acceptingCustomers && styles.continueBtn]}
          onPress={() => setAcceptingCustomers(!acceptingCustomers)}
          activeOpacity={0.85}
        >
          {acceptingCustomers ? (
            <>
              <Pause color={Colors.white} size={20} />
              <Text style={styles.pauseBtnText}>{t("pauseQueue")}</Text>
            </>
          ) : (
            <>
              <Play color={Colors.white} size={20} />
              <Text style={styles.pauseBtnText}>{t("continueQueue")}</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>{t("queueList")}</Text>

        <FlatList
          data={queueList}
          renderItem={renderQueueItem}
          keyExtractor={(item) => item.ticket}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
  },
  headerIcons: { flexDirection: "row", gap: 16 },
  scroll: { padding: 16, paddingBottom: 40 },
  nowServingCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
  },
  cardTitle: {
    color: Colors.gray,
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    marginBottom: 8,
  },
  nowServingTicket: {
    color: Colors.teal,
    fontSize: 32,
    fontFamily: "Poppins-Bold",
  },
  queueStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
  },
  stat: { alignItems: "center" },
  statValue: {
    color: Colors.white,
    fontSize: 24,
    fontFamily: "Poppins-Bold",
  },
  statLabel: {
    color: Colors.gray,
    fontSize: 12,
    fontFamily: "Poppins-Regular",
  },
  actionButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  actionBtn: {
    backgroundColor: Colors.teal,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
    minWidth: "45%",
  },
  actionBtnText: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
  },
  pauseBtn: {
    backgroundColor: Colors.orange,
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 24,
  },
  continueBtn: { backgroundColor: Colors.green },
  pauseBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: "Poppins-Bold",
  },
  sectionTitle: {
    color: Colors.grayLight,
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  queueItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  queueTicket: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
  },
  queueStatus: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
  },
  divider: { height: 1, backgroundColor: Colors.border },
});
