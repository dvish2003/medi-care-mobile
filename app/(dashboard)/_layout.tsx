import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";

type TabConfig = {
  label: string;
  name: string;
  icon: keyof typeof MaterialIcons.glyphMap;
};

const tabs: TabConfig[] = [
  { label: "Home", name: "home", icon: "home" },
    { label: "Reminder", name: "reminder", icon: "alarm" },
  { label: "Medicines", name: "medicines", icon: "medical-services" },
  { label: "Account", name: "account", icon: "person-outline" },
];

const DashboardLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#fff", 
        tabBarInactiveTintColor: "#888", 
        headerShown: false,
        tabBarStyle: {
          height: 60,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          backgroundColor: '#000',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
          marginBottom: 5,
        },
        tabBarIconStyle: {
          marginBottom: -3,
        },
      }}
    >
      {tabs.map(({ name, icon, label }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title: label,
            tabBarIcon: ({ color, size, focused }) => (
              <MaterialIcons 
                name={icon} 
                color={focused ? "#fff" : color} 
                size={size} 
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
};

export default DashboardLayout;
