import { Tabs } from "expo-router";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { StyleSheet, View, Animated, TouchableOpacity } from "react-native";
import React, { useRef, useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from 'expo-blur';

type TabConfig = {
  label: string;
  name: string;
  icon: keyof typeof MaterialIcons.glyphMap | keyof typeof Ionicons.glyphMap;
  iconType?: 'material' | 'ionicon';
};

const tabs: TabConfig[] = [
  { label: "Home", name: "home", icon: "home", iconType: 'material' },
  { label: "Reminder", name: "reminder", icon: "alarm", iconType: 'material' },
  { label: "Medicines", name: "medicines", icon: "medical-services", iconType: 'material' },
  { label: "Account", name: "account", icon: "person-circle-outline", iconType: 'ionicon' },
];

const DashboardLayout = () => {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#034c36", 
        tabBarInactiveTintColor: "#7A8D8F", 
        headerShown: false,
        tabBarStyle: styles.tabBar,
      }}
      screenListeners={{
        tabPress: (e) => {
          setActiveTab(e.target?.split('-')[0] || 'home');
        },
      }}
    >
      {tabs.map(({ name, icon, label, iconType }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title: '',
            tabBarIcon: ({ focused }) => (
              <TabButton 
                icon={icon} 
                focused={focused}
                iconType={iconType}
                label={label}
                isActive={activeTab === name}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
};

const TabButton = ({ icon, focused, iconType, label, isActive }: {
  icon: string;
  focused: boolean;
  iconType?: 'material' | 'ionicon';
  label: string;
  isActive: boolean;
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (focused) {
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.15,
          tension: 200,
          friction: 4,
          useNativeDriver: true,
        }),
        Animated.spring(bounceAnim, {
          toValue: 1,
          tension: 200,
          friction: 4,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 200,
          friction: 4,
          useNativeDriver: true,
        }),
        Animated.spring(bounceAnim, {
          toValue: 0,
          tension: 200,
          friction: 4,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [focused]);

  const translateY = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -5],
  });

  const IconComponent = iconType === 'ionicon' ? Ionicons : MaterialIcons;

  return (
    <TouchableOpacity style={styles.tabButton}>
      <Animated.View 
        style={[
          styles.buttonContent,
          {
            transform: [{ scale: scaleAnim }, { translateY }],
          }
        ]}
      >
        <View style={[
          styles.iconContainer,
          focused && styles.iconContainerActive
        ]}>
          <IconComponent 
            name={icon as any} 
            color={focused ? "#fff" : "#7A8D8F"} 
            size={24} 
          />
        </View>
        
        <Animated.Text 
          style={[
            styles.buttonLabel,
            {
              color: focused ? "#034c36" : "#7A8D8F",
              fontWeight: focused ? '700' : '500',
            }
          ]}
        >
          {label}
        </Animated.Text>
      </Animated.View>
      
      {focused && <View style={styles.activeIndicator} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 0,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: "#034c36",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 15,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(189, 205, 207, 0.3)",
    paddingHorizontal: 5,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  buttonContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(189, 205, 207, 0.1)',
    marginBottom: 4,
  },
  iconContainerActive: {
    backgroundColor: '#034c36',
    shadowColor: "#034c36",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#034c36',
  },
});

export default DashboardLayout;