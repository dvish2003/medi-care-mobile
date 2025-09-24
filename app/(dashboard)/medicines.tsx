import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, FlatList, StyleSheet, Animated, Easing } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

type Medicine = {
  id: string;
  name: string;
  price: string;
  description: string;
  image: string;
  category: string;
  inStock: boolean;
};

const MedicinesScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;
  const scaleValue = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
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
  }, []);

  // Medicine categories with your gradient colors
  const categories: { id: string; name: string; icon: keyof typeof Ionicons.glyphMap; gradient: string[] }[] = [
    { id: "all", name: "All", icon: "apps", gradient: ['#BDCDCF', '#034c36'] },
    { id: "pain", name: "Pain", icon: "medkit-outline", gradient: ['#034c36', '#003333'] },
    { id: "vitamins", name: "Vitamins", icon: "nutrition-outline", gradient: ['#BDCDCF', '#003333'] },
    { id: "cold", name: "Cold & Flu", icon: "thermometer-outline", gradient: ['#034c36', '#BDCDCF'] },
    { id: "skincare", name: "Skincare", icon: "body-outline", gradient: ['#003333', '#034c36'] },
    { id: "digestive", name: "Digestive", icon: "medical-outline", gradient: ['#BDCDCF', '#034c36'] },
  ];

  // Sample medicine data
  const medicines = [
    {
      id: "1",
      name: "Paracetamol 500mg",
      price: "$5.99",
      description: "Pain reliever and fever reducer",
      image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=300&h=200&fit=crop",
      category: "pain",
      inStock: true,
    },
    {
      id: "2",
      name: "Vitamin C 1000mg",
      price: "$8.49",
      description: "Immune system support with advanced formula",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop",
      category: "vitamins",
      inStock: true,
    },
    {
      id: "3",
      name: "Ibuprofen 200mg",
      price: "$6.99",
      description: "Anti-inflammatory pain reliever",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=200&fit=crop",
      category: "pain",
      inStock: true,
    },
    {
      id: "4",
      name: "Omega-3 Fish Oil",
      price: "$12.99",
      description: "Heart health supplement with pure ingredients",
      image: "https://images.unsplash.com/photo-1550572017-edd951b55104?w=300&h=200&fit=crop",
      category: "vitamins",
      inStock: true,
    },
    {
      id: "5",
      name: "Cold & Flu Relief",
      price: "$9.99",
      description: "Multi-symptom cold medicine",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=200&fit=crop",
      category: "cold",
      inStock: false,
    },
    {
      id: "6",
      name: "Antacid Tablets",
      price: "$7.49",
      description: "Fast heartburn relief",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop",
      category: "digestive",
      inStock: true,
    },
    {
      id: "7",
      name: "Moisturizing Lotion",
      price: "$8.99",
      description: "For dry and sensitive skin",
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=200&fit=crop",
      category: "skincare",
      inStock: true,
    },
    {
      id: "8",
      name: "Multivitamin Complex",
      price: "$15.99",
      description: "Complete daily vitamin supplement",
      image: "https://images.unsplash.com/photo-1593084693234-f8b1b0f07bed?w=300&h=200&fit=crop",
      category: "vitamins",
      inStock: true,
    }
  ];

  // Filter medicines based on selected category and search query
  const filteredMedicines = medicines.filter(medicine => {
    const matchesCategory = selectedCategory === "all" || medicine.category === selectedCategory;
    const matchesSearch = medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          medicine.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const CategoryItem = ({ item, index }: { item: any; index: number }) => {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.sequence([
        Animated.delay(index * 100),
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 150,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 500,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          })
        ])
      ]).start();
    }, []);

    const rotate = rotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    });

    return (
      <TouchableOpacity
        onPress={() => setSelectedCategory(item.id)}
      >
        <Animated.View 
          style={[
            styles.categoryItem,
            selectedCategory === item.id && styles.categoryItemSelected,
            {
              transform: [
                { scale: scaleAnim },
                { rotate }
              ]
            }
          ]}
        >
          <LinearGradient
            colors={item.gradient}
            style={styles.categoryGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons 
              name={item.icon} 
              size={24} 
              color="#fff" 
            />
          </LinearGradient>
          <Text style={[
            styles.categoryText,
            selectedCategory === item.id && styles.categoryTextSelected
          ]}>
            {item.name}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const MedicineCard = ({ item, index }: { item: Medicine; index: number }) => {
    const slideAnim = useRef(new Animated.Value(50)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.sequence([
        Animated.delay(index * 150),
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 600,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          })
        ])
      ]).start();
    }, []);

    return (
      <Animated.View 
        style={[
          styles.medicineCard,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <Image source={{ uri: item.image }} style={styles.medicineImage} />
        <View style={styles.medicineInfo}>
          <Text style={styles.medicineName}>{item.name}</Text>
          <Text style={styles.medicineDescription}>{item.description}</Text>
          <Text style={styles.medicinePrice}>{item.price}</Text>
          <View style={styles.stockStatus}>
            <Ionicons 
              name={item.inStock ? "checkmark-circle" : "close-circle"} 
              size={16} 
              color={item.inStock ? "#4CAF50" : "#F44336"} 
            />
            <Text style={[
              styles.stockText,
              { color: item.inStock ? "#4CAF50" : "#F44336" }
            ]}>
              {item.inStock ? "In Stock" : "Out of Stock"}
            </Text>
          </View>
        </View>
        <TouchableOpacity 
          style={[
            styles.addButton,
            !item.inStock && styles.addButtonDisabled
          ]}
          disabled={!item.inStock}
        >
          <LinearGradient
            colors={item.inStock ? ['#034c36', '#003333'] : ['#666', '#999']}
            style={styles.addButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="add" size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Animated Header with Gradient */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideUpAnim },
              { scale: scaleValue }
            ]
          }
        ]}
      >
        <LinearGradient
          colors={['#BDCDCF', '#034c36', '#003333']}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>Medicines</Text>
              <Text style={styles.headerSubtitle}>Find your healthcare needs</Text>
            </View>
            <Ionicons name="medical" size={32} color="#fff" />
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
            <TextInput
              placeholder="Search medicines..."
              placeholderTextColor="#999"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Categories Section */}
        <Animated.View 
          style={[
            styles.categoriesSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }]
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Categories</Text>
          <FlatList
            horizontal
            data={categories}
            renderItem={({ item, index }) => <CategoryItem item={item} index={index} />}
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </Animated.View>

        {/* Medicines Section */}
        <View style={styles.medicinesSection}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === "all" ? "All Medicines" : 
             categories.find(cat => cat.id === selectedCategory)?.name}
            <Text style={styles.resultsCount}> ({filteredMedicines.length})</Text>
          </Text>
          
          {filteredMedicines.length > 0 ? (
            <FlatList
              data={filteredMedicines}
              renderItem={({ item, index }) => <MedicineCard item={item} index={index} />}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.medicinesList}
            />
          ) : (
            <Animated.View 
              style={[
                styles.emptyState,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideUpAnim }]
                }
              ]}
            >
              <Ionicons name="search-outline" size={64} color="#034c36" />
              <Text style={styles.emptyStateText}>No medicines found</Text>
              <Text style={styles.emptyStateSubtext}>
                Try adjusting your search or filter criteria
              </Text>
            </Animated.View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0f0e',
  },
  header: {
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    overflow: 'hidden',
    shadowColor: '#034c36',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 25,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    borderColor: 'rgba(189, 205, 207, 0.3)',
  },
  searchIcon: {
    marginRight: 10,
    color: '#BDCDCF',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0a0f0e',
  },
  categoriesSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#BDCDCF',
    marginBottom: 15,
  },
  categoriesList: {
    paddingRight: 10,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 15,
    width: 80,
  },
  categoryItemSelected: {
    transform: [{ scale: 1.05 }],
  },
  categoryGradient: {
    width: 60,
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#034c36',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#BDCDCF',
    textAlign: 'center',
  },
  categoryTextSelected: {
    color: '#034c36',
    fontWeight: 'bold',
  },
  medicinesSection: {
    flex: 1,
  },
  resultsCount: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#034c36',
  },
  medicinesList: {
    paddingBottom: 20,
  },
  medicineCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(189, 205, 207, 0.05)',
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(3, 76, 54, 0.2)',
    shadowColor: '#034c36',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  medicineImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 15,
    borderWidth: 2,
    borderColor: 'rgba(3, 76, 54, 0.3)',
  },
  medicineInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  medicineName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#BDCDCF',
    marginBottom: 4,
  },
  medicineDescription: {
    fontSize: 13,
    color: '#8a9a9c',
    marginBottom: 6,
    lineHeight: 18,
  },
  medicinePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#034c36',
    marginBottom: 6,
  },
  stockStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockText: {
    fontSize: 13,
    marginLeft: 4,
    fontWeight: '500',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    overflow: 'hidden',
  },
  addButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 50,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#BDCDCF',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#8a9a9c',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default MedicinesScreen;