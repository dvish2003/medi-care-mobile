import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking, Animated, Easing, Dimensions } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const Home = () => {
  // Updated contact information
  const contactMethods: { id: string; type: string; value: string; icon: 'phone' | 'email' | 'location-on'; action: string }[] = [
    { id: '1', type: 'Phone', value: '0725038727', icon: 'phone', action: 'tel:0725038727' },
    { id: '2', type: 'Email', value: 'vishanchathuranga81@gmail.com', icon: 'email', action: 'mailto:vishanchathuranga81@gmail.com' },
    { id: '3', type: 'Address', value: 'Sri Lanka, Kalutara', icon: 'location-on', action: 'https://maps.google.com/?q=Kalutara,Sri+Lanka' },
  ];

  const features: { id: string; title: string; icon: keyof typeof MaterialIcons.glyphMap; description: string; color: string }[] = [
    { id: '1', title: 'Medicine Management', icon: 'medical-services', description: 'Browse and order medicines with detailed information', color: '#034c36' },
    { id: '2', title: 'Health Packages', icon: 'inventory', description: 'Specialized health packages tailored to your needs', color: '#003333' },
    { id: '3', title: 'Wellness Guidance', icon: 'favorite', description: 'Daily health tips and medication reminders', color: '#BDCDCF' },
    { id: '4', title: '24/7 Support', icon: 'support-agent', description: 'Round the clock customer support and consultation', color: '#034c36' },
  ];

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;
  const scaleValue = useRef(new Animated.Value(0.9)).current;
  const featureAnimations = features.map(() => useRef(new Animated.Value(0)).current);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // Header hide animation
  const headerTranslateY = useRef(new Animated.Value(0)).current;
  const headerOpacity = useRef(new Animated.Value(1)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  // Scroll handler for header hide/show
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: { nativeEvent: { contentOffset: { y: number } } }) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        // Show/hide header based on scroll direction
        if (offsetY > 100 && isHeaderVisible) {
          hideHeader();
        } else if (offsetY <= 100 && !isHeaderVisible) {
          showHeader();
        }
      }
    }
  );

  const hideHeader = () => {
    setIsHeaderVisible(false);
    Animated.parallel([
      Animated.timing(headerTranslateY, {
        toValue: -150,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(headerOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start();
  };

  const showHeader = () => {
    setIsHeaderVisible(true);
    Animated.parallel([
      Animated.timing(headerTranslateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start();
  };

  useEffect(() => {
    // Header animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();

    // Staggered features animation
    Animated.stagger(200, featureAnimations.map(anim => 
      Animated.timing(anim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      })
    )).start();

    // Pulsing animation for header
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, []);

  const renderFeatureCard = (item: any, index: number) => {
    const translateY = featureAnimations[index].interpolate({
      inputRange: [0, 1],
      outputRange: [60, 0],
    });

    const opacity = featureAnimations[index];

    return (
      <Animated.View 
        key={item.id} 
        style={[
          styles.featureCard,
          {
            opacity,
            transform: [{ translateY }],
          }
        ]}
      >
        <View style={[styles.featureIconContainer, { backgroundColor: `${item.color}15` }]}>
          <MaterialIcons name={item.icon} size={32} color={item.color} />
        </View>
        <Text style={styles.featureTitle}>{item.title}</Text>
        <Text style={styles.featureDescription}>{item.description}</Text>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Animated Header - Will hide on scroll */}
      <Animated.View style={[
        styles.header,
        {
          opacity: headerOpacity,
          transform: [
            { translateY: headerTranslateY },
            { scale: pulseAnim }
          ]
        }
      ]}>
        <LinearGradient
          colors={['#BDCDCF', '#034c36', '#003333']}
          locations={[0, 0.5, 1]}
          style={styles.gradientBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <View style={styles.headerContent}>
          <View style={styles.welcomeSection}>
            <Text style={styles.greeting}>Welcome to</Text>
            <Text style={styles.appName}>Medi-Care</Text>
            <Text style={styles.tagline}>Your Health, Our Priority</Text>
          </View>
        </View>
      </Animated.View>

      {/* Main Content */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Add extra padding at top to account for header space */}
        <View style={styles.scrollPadding} />
        
        {/* About Us Section */}
        <Animated.View 
          style={[
            styles.aboutSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }]
            }
          ]}
        >
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
        </Animated.View>

        {/* Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Features</Text>
          <View style={styles.featuresGrid}>
            {features.map((item, index) => renderFeatureCard(item, index))}
          </View>
        </View>

        {/* Contact Us Section */}
        <Animated.View 
          style={[
            styles.contactSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }]
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <Text style={styles.contactIntro}>
            Have questions or need assistance? We're here to help you!
          </Text>
          
          <View style={styles.contactMethods}>
            {contactMethods.map((item, index) => (
              <Animated.View
                key={item.id}
                style={{
                  opacity: featureAnimations[index] || fadeAnim,
                  transform: [{ translateY: featureAnimations[index]?.interpolate({
                    inputRange: [0, 1],
                    outputRange: [40, 0],
                  }) || 0 }]
                }}
              >
                <TouchableOpacity 
                  style={styles.contactCard}
                  onPress={() => Linking.openURL(item.action)}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={['#BDCDCF', '#034c36']}
                    style={styles.contactIcon}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <MaterialIcons name={item.icon} size={24} color="#fff" />
                  </LinearGradient>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactType}>{item.type}</Text>
                    <Text style={styles.contactValue}>{item.value}</Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={20} color="#034c36" />
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Footer */}
        <View style={styles.footer}>
          <LinearGradient
            colors={['#BDCDCF', '#034c36', '#003333']}
            style={styles.footerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.footerText}>© 2025 Medi-Care. All rights reserved.</Text>
          </LinearGradient>
        </View>
      </ScrollView>

      {/* Floating action button to show header when hidden */}
      {!isHeaderVisible && (
        <TouchableOpacity 
          style={styles.showHeaderButton}
          onPress={showHeader}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#BDCDCF', '#034c36']}
            style={styles.showHeaderGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <MaterialIcons name="arrow-upward" size={24} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 18,
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontWeight: '400',
    marginBottom: 5,
  },
  appName: {
    color: '#fff',
    fontSize: 46,
    fontWeight: '800',
    marginTop: 5,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  tagline: {
    color: 'rgba(255, 255, 255, 0.95)',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  content: {
    flex: 1,
  },
  scrollPadding: {
    height: 180, // Extra padding to account for header space
  },
  aboutSection: {
    padding: 25,
    margin: 20,
    borderRadius: 25,
    backgroundColor: '#fff',
    shadowColor: '#034c36',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#BDCDCF',
  },
  section: {
    backgroundColor: 'transparent',
    padding: 20,
    marginHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#003333',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  aboutText: {
    color: '#034c36',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: '500',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#034c36',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderTopWidth: 3,
    borderTopColor: '#BDCDCF',
  },
  featureIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#f0f5f5',
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#003333',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 13,
    color: '#034c36',
    textAlign: 'center',
    lineHeight: 18,
    fontWeight: '500',
  },
  contactSection: {
    padding: 25,
    margin: 20,
    borderRadius: 25,
    backgroundColor: '#fff',
    shadowColor: '#034c36',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 10,
    borderRightWidth: 4,
    borderRightColor: '#BDCDCF',
  },
  contactIntro: {
    color: '#034c36',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
    fontWeight: '500',
  },
  contactMethods: {
    marginTop: 10,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 18,
    borderRadius: 18,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#034c36',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  contactIcon: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  contactInfo: {
    flex: 1,
    marginLeft: 16,
  },
  contactType: {
    fontSize: 14,
    color: '#003333',
    fontWeight: '700',
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 14,
    color: '#034c36',
    fontWeight: '500',
  },
  footer: {
    marginTop: 20,
    borderRadius: 20,
    marginHorizontal: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  footerGradient: {
    padding: 25,
    alignItems: 'center',
  },
  footerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  showHeaderButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1001,
  },
  showHeaderGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});

export default Home;