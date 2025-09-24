import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, Alert, StyleSheet, Animated } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { getCurrentUser, logout } from "@/services/authService";
import { UserData } from "@/types/user";
import { getUserById, saveUser } from "@/services/userService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Account = () => {
  const router = useRouter();
  const currentEmail = getCurrentUser() ?? "";

  const [editing, setEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(
    "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
  );
  const [userData, setUserData] = useState<UserData>({
    name: "",
    email: currentEmail,
    phone: "",
    age: "",
    address: "",
  });
  const [saved, setSaved] = useState(false);
  
  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideUpAnim = useState(new Animated.Value(30))[0];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (userId) {
          const data = await getUserById(userId);
          if (data) {
            setUserData(data);
            console.log("Fetched user data:", data);
          } else {
            console.log("No user data found for ID:", userId);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    
    fetchUserData();
    
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  // Gradient color scheme
  const gradientColors = ['#BDCDCF', '#034c36', '#003333'];
  const colors = {
    primary: '#003333',
    secondary: '#034c36',
    accent: '#BDCDCF',
    background: '#f8f9fa',
    surface: '#ffffff',
    text: '#003333',
    textLight: '#034c36',
    border: '#BDCDCF',
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleInputChange = (field: keyof UserData, value: string) => {
    setUserData({
      ...userData,
      [field]: value,
    });
  };

  const saveUserData = async () => {
    if (!userData.name || !userData.email || !userData.phone) {
      Alert.alert("Error", "Please fill in all required fields (Name, Email, Phone)");
      return;
    }

    try {
      const response = await saveUser(userData);
      if (!response) {
        Alert.alert("Error", "User credentials not saved");
        return;
      }

      await AsyncStorage.setItem("userId", response);
      setEditing(false);
      setSaved(true);
      Alert.alert("Success", "Profile updated successfully!");
      console.log("User Data Saved:", response);
    } catch (error) {
      console.error("Error saving user data:", error);
      Alert.alert("Error", "Something went wrong while saving profile");
    }
  };

  const handleLogout = async () => {
    console.log("🔒 User logged out");
    try {
      await logout();
      Alert.alert("Success", "You have been logged out");
      router.replace("/login");
    } catch (error) {
      Alert.alert("Error", "Logout failed. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Gradient Background */}
      <View style={[styles.gradientBackground, { backgroundColor: gradientColors[0] }]} />
      
      <Animated.View 
        style={[
          styles.header,
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideUpAnim }]
          }
        ]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>My Profile</Text>
        <TouchableOpacity 
          style={[styles.logoutButton, { backgroundColor: colors.primary }]} 
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <Animated.View 
            style={[
              styles.profileImageContainer,
              { 
                opacity: fadeAnim,
                transform: [{ translateY: slideUpAnim }]
              }
            ]}
          >
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
            <TouchableOpacity style={[styles.editImageButton, { backgroundColor: colors.primary }]} onPress={pickImage}>
              <Ionicons name="camera" size={20} color="#fff" />
            </TouchableOpacity>
          </Animated.View>

          {!saved && (
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideUpAnim }]
              }}
            >
              <TouchableOpacity
                style={[styles.editButton, { backgroundColor: colors.primary }]}
                onPress={async () => {
                  if (editing) {
                    await saveUserData();
                  } else {
                    setEditing(true);
                  }
                }}
              >
                <Text style={styles.editButtonText}>
                  {editing ? "Save Changes" : "Edit Profile"}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Profile Form */}
          <Animated.View 
            style={[
              styles.form,
              { 
                opacity: fadeAnim,
                transform: [{ translateY: slideUpAnim }]
              }
            ]}
          >
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Full Name *</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.surface, 
                  color: colors.text, 
                  borderColor: colors.border 
                }]}
                value={userData.name}
                onChangeText={(text) => handleInputChange("name", text)}
                editable={editing}
                placeholder="Enter your full name"
                placeholderTextColor={colors.textLight}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Email *</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.surface, 
                  color: colors.text, 
                  borderColor: colors.border 
                }]}
                value={userData.email}
                editable={editing}
                onChangeText={(text) => handleInputChange("email", text)}
                keyboardType="email-address"
                placeholder="Enter your email"
                placeholderTextColor={colors.textLight}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Phone Number *</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.surface, 
                  color: colors.text, 
                  borderColor: colors.border 
                }]}
                value={userData.phone}
                onChangeText={(text) => handleInputChange("phone", text)}
                editable={editing}
                keyboardType="phone-pad"
                placeholder="Enter your phone number"
                placeholderTextColor={colors.textLight}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Age</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.surface, 
                  color: colors.text, 
                  borderColor: colors.border 
                }]}
                value={userData.age}
                onChangeText={(text) => handleInputChange("age", text)}
                editable={editing}
                keyboardType="numeric"
                placeholder="Enter your age"
                placeholderTextColor={colors.textLight}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Address</Text>
              <TextInput
                style={[styles.input, styles.textArea, { 
                  backgroundColor: colors.surface, 
                  color: colors.text, 
                  borderColor: colors.border 
                }]}
                value={userData.address}
                onChangeText={(text) => handleInputChange("address", text)}
                editable={editing}
                multiline
                placeholder="Enter your address"
                placeholderTextColor={colors.textLight}
              />
            </View>
          </Animated.View>

          <Animated.View 
            style={[
              styles.emptyState,
              { 
                opacity: fadeAnim,
                transform: [{ translateY: slideUpAnim }]
              }
            ]}
          >
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f8f9fa" 
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    opacity: 0.1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "transparent",
  },
  backButton: { 
    padding: 12, 
    borderRadius: 30, 
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: { 
    fontSize: 28, 
    fontWeight: "800", 
    letterSpacing: -0.5,
  },
  logoutButton: {
    padding: 12,
    borderRadius: 30,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  scrollView: { 
    flex: 1,
  },
  scrollContent: { 
    padding: 20, 
    paddingBottom: 40 
  },
  profileSection: { 
    alignItems: "center" 
  },
  profileImageContainer: { 
    position: "relative", 
    marginBottom: 24 
  },
  profileImage: { 
    width: 140, 
    height: 140, 
    borderRadius: 70, 
    borderWidth: 4, 
    borderColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  editImageButton: {
    position: "absolute",
    bottom: 5,
    right: 5,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  editButton: { 
    paddingHorizontal: 32, 
    paddingVertical: 16, 
    borderRadius: 30, 
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  editButtonText: { 
    color: "#fff", 
    fontWeight: "700", 
    fontSize: 16,
    letterSpacing: 0.5,
  },
  form: { 
    width: "100%", 
    marginBottom: 24 
  },
  inputGroup: { 
    marginBottom: 20 
  },
  label: { 
    fontSize: 16, 
    fontWeight: "600", 
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  input: { 
    padding: 18, 
    borderRadius: 16, 
    borderWidth: 2,
    fontSize: 16,
    fontWeight: "500",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  textArea: { 
    minHeight: 100, 
    textAlignVertical: "top" 
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    marginTop: 20,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "500",
    marginTop: 12,
    lineHeight: 22,
    letterSpacing: 0.3,
  },
});

export default Account;