import { View, Text, Pressable, StyleSheet } from "react-native";
import React from "react";
import { useRouter, useSegments } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Define the Tab type
type Tab = {
  label: string;
  path: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const tabs: Tab[] = [
  { label: "Home", path: "/home", icon: "home" },
  { label: "Medicines", path: "/medicines", icon: "medical" },
  { label: "Packages", path: "/packages", icon: "bag" },
  { label: "Wellness", path: "/wellness", icon: "heart" },
  { label: "Account", path: "/account", icon: "person" }
] as const;

const FooterNav = () => {
  const router = useRouter();
  const segment = useSegments();
  const activeRouter = "/" + (segment[0] || "");

  return (
    <View style={styles.container}>
      {tabs.map((data) => (
        <Pressable
          key={data.path}
          style={[
            styles.tabButton,
            data.path === activeRouter && styles.activeTabButton
          ]}
          onPress={() => {
            router.push(data.path as any);
          }}
        >
          <Ionicons 
            name={data.icon} 
            size={24} 
            color={data.path === activeRouter ? "#fff" : "#000"} 
          />
          <Text style={[
            styles.tabText,
            data.path === activeRouter && styles.activeTabText
          ]}>
            {data.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 16,
  },
  activeTabButton: {
    backgroundColor: '#000',
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    color: '#000',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
  },
});

export default FooterNav;