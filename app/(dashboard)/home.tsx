import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";

const Home = () => {
  const features: { id: string; title: string; icon: keyof typeof MaterialIcons.glyphMap; description: string }[] = [
    { id: '1', title: 'Medicine Management', icon: 'medical-services', description: 'Browse and order medicines with detailed information' },
    { id: '2', title: 'Health Packages', icon: 'inventory', description: 'Specialized health packages tailored to your needs' },
    { id: '3', title: 'Wellness Guidance', icon: 'favorite', description: 'Daily health tips and medication reminders' },
    { id: '4', title: '24/7 Support', icon: 'support-agent', description: 'Round the clock customer support and consultation' },
  ];

  const contactMethods: { id: string; type: string; value: string; icon: 'phone' | 'email' | 'location-on'; action: string }[] = [
    { id: '1', type: 'Phone', value: '+1 (555) 123-4567', icon: 'phone', action: 'tel:+15551234567' },
    { id: '2', type: 'Email', value: 'support@medicare.com', icon: 'email', action: 'mailto:support@medicare.com' },
    { id: '3', type: 'Address', value: '123 Health Street, Medical City', icon: 'location-on', action: 'https://maps.google.com' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.welcomeSection}>
            <Text style={styles.greeting}>Welcome to</Text>
            <Text style={styles.appName}>Medi-Care</Text>
            <Text style={styles.tagline}>Your Health, Our Priority</Text>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content}>
        {/* About Us Section */}
        <View style={styles.aboutSection}>
          <Text style={styles.sectionTitle}>About Medi-Care</Text>
          <Text style={styles.aboutText}>
            Medi-Care is a revolutionary pharmacy mobile application designed to simplify 
            pharmacy services while encouraging healthier lifestyles. We bridge the gap between 
            traditional pharmacy services and modern digital convenience.
          </Text>
          <Text style={styles.aboutText}>
            Our mission is to create a simple, user-friendly platform that connects pharmacies 
            with their customers while fostering long-term wellness in the community.
          </Text>
        </View>

        {/* Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Features</Text>
          <View style={styles.featuresGrid}>
            {features.map(item => (
              <View key={item.id} style={styles.featureCard}>
                <View style={styles.featureIconContainer}>
                  <MaterialIcons name={item.icon} size={28} color="#000" />
                </View>
                <Text style={styles.featureTitle}>{item.title}</Text>
                <Text style={styles.featureDescription}>{item.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Contact Us Section */}
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <Text style={styles.contactIntro}>
            Have questions or need assistance? We're here to help you!
          </Text>
          
          <View style={styles.contactMethods}>
            {contactMethods.map(item => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.contactCard}
                onPress={() => Linking.openURL(item.action)}
              >
                <MaterialIcons name={item.icon} size={24} color="#000" />
                <View style={styles.contactInfo}>
                  <Text style={styles.contactType}>{item.type}</Text>
                  <Text style={styles.contactValue}>{item.value}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 Medi-Care. All rights reserved.</Text>
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
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeSection: {
    flex: 1,
    alignItems: 'center',
  },
  greeting: {
    color: '#666',
    fontSize: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '300',
  },
  appName: {
    color: '#000',
    fontSize: 36,
    fontWeight: '800',
    marginTop: 5,
    letterSpacing: -0.5,
  },
  tagline: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  aboutSection: {
    padding: 25,
    margin: 16,
    borderRadius: 16,
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#eee',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  aboutText: {
    color: '#333',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 15,
    textAlign: 'center',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    backgroundColor: '#f8f8f8',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  featureIconContainer: {
    backgroundColor: '#fff',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  contactSection: {
    padding: 25,
    margin: 16,
    borderRadius: 16,
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#eee',
  },
  contactIntro: {
    color: '#333',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  contactMethods: {
    marginTop: 10,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  contactInfo: {
    marginLeft: 16,
  },
  contactType: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 14,
    color: '#333',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
});

export default Home;