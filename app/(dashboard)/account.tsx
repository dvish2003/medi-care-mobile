import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, Alert, StyleSheet } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';

// Define TypeScript interface
interface UserData {
  name: string;
  email: string;
  phone: string;
  age: string;
  address: string;
}

const Account = () => {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [profileImage, setProfileImage] = useState("https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150&h=150&fit=crop&crop=face");
  
  // User profile data
  const [userData, setUserData] = useState<UserData>({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    age: "35",
    address: "123 Health Street, Medical City",
  });

  // Pick image from gallery
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  // Handle input changes
  const handleInputChange = (field: keyof UserData, value: string): void => {
    setUserData({
      ...userData,
      [field]: value,
    });
  };

  // Save user data
  const saveUserData = () => {
    // Validate required fields
    if (!userData.name || !userData.email || !userData.phone) {
      Alert.alert("Error", "Please fill in all required fields (Name, Email, Phone)");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    // Validate phone number (basic validation)
    if (userData.phone.length < 10) {
      Alert.alert("Error", "Please enter a valid phone number");
      return;
    }

    // Validate age
    const ageAsNumber = parseInt(userData.age);
    if (userData.age && (isNaN(ageAsNumber) || ageAsNumber < 0 || ageAsNumber > 150)) {
      Alert.alert("Error", "Please enter a valid age");
      return;
    }

    // Save data
    Alert.alert("Success", "Profile updated successfully!");
    setEditing(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          {/* Profile Image */}
          <View style={styles.profileImageContainer}>
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
            <TouchableOpacity style={styles.editImageButton} onPress={pickImage}>
              <Ionicons name="camera" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Edit Button */}
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => editing ? saveUserData() : setEditing(true)}
          >
            <Text style={styles.editButtonText}>
              {editing ? "Save Changes" : "Edit Profile"}
            </Text>
          </TouchableOpacity>

          {/* Profile Form */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={styles.input}
                value={userData.name}
                onChangeText={(text) => handleInputChange("name", text)}
                editable={editing}
                placeholder="Enter your full name"
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={styles.input}
                value={userData.email}
                onChangeText={(text) => handleInputChange("email", text)}
                editable={editing}
                keyboardType="email-address"
                placeholder="Enter your email"
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number *</Text>
              <TextInput
                style={styles.input}
                value={userData.phone}
                onChangeText={(text) => handleInputChange("phone", text)}
                editable={editing}
                keyboardType="phone-pad"
                placeholder="Enter your phone number"
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Age</Text>
              <TextInput
                style={styles.input}
                value={userData.age}
                onChangeText={(text) => handleInputChange("age", text)}
                editable={editing}
                keyboardType="numeric"
                placeholder="Enter your age"
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={userData.address}
                onChangeText={(text) => handleInputChange("address", text)}
                editable={editing}
                multiline
                placeholder="Enter your address"
                placeholderTextColor="#888"
              />
            </View>
          </View>

          {/* Additional Info Cards */}
          <View style={styles.infoCardsContainer}>
            <View style={styles.infoCard}>
              <Ionicons name="calendar" size={24} color="#007AFF" />
              <View style={styles.infoCardContent}>
                <Text style={styles.infoCardTitle}>Member Since</Text>
                <Text style={styles.infoCardValue}>January 2024</Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <Ionicons name="document" size={24} color="#34C759" />
              <View style={styles.infoCardContent}>
                <Text style={styles.infoCardTitle}>Prescriptions</Text>
                <Text style={styles.infoCardValue}>3 Active</Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <Ionicons name="people" size={24} color="#FF9500" />
              <View style={styles.infoCardContent}>
                <Text style={styles.infoCardTitle}>Family Members</Text>
                <Text style={styles.infoCardValue}>2 Registered</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f8f8f8',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#000',
    letterSpacing: -0.5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  profileSection: {
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#f8f8f8',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#000',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  editButton: {
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 24,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  form: {
    width: '100%',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 16,
    color: '#000',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  infoCardsContainer: {
    width: '100%',
    gap: 16,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  infoCardContent: {
    marginLeft: 16,
    flex: 1,
  },
  infoCardTitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginBottom: 4,
  },
  infoCardValue: {
    fontSize: 18,
    color: '#000',
    fontWeight: '600',
  },
});
export default Account;