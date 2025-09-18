import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, FlatList, StyleSheet } from "react-native";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const PackagesScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Package categories
  const categories = [
    { id: "all", name: "All Packages", icon: "package" },
    { id: "firstaid", name: "First Aid", icon: "medical-bag" },
    { id: "wellness", name: "Wellness", icon: "heart" },
    { id: "seasonal", name: "Seasonal", icon: "weather-sunny" },
    { id: "chronic", name: "Chronic Care", icon: "accessibility" },
    { id: "family", name: "Family Care", icon: "family-restroom" },
  ];

  // Sample package data
  const packages = [
    {
      id: "1",
      name: "Complete First Aid Kit",
      price: "$24.99",
      description: "Essential supplies for minor injuries and emergencies",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=300&h=200&fit=crop",
      category: "firstaid",
      includes: ["Bandages", "Antiseptic wipes", "Gauze pads", "Medical tape", "Pain relievers"],
      rating: 4.8,
      reviews: 124,
    },
    {
      id: "2",
      name: "Cold & Flu Relief Pack",
      price: "$19.99",
      description: "Everything you need to fight cold and flu symptoms",
      image: "https://images.unsplash.com/photo-1576091160552-0e355a510e3d?w=300&h=200&fit=crop",
      category: "seasonal",
      includes: ["Decongestant", "Cough syrup", "Throat lozenges", "Pain reliever", "Thermometer"],
      rating: 4.5,
      reviews: 89,
    },
    {
      id: "3",
      name: "Vitamin Boost Bundle",
      price: "$29.99",
      description: "Essential vitamins for daily health maintenance",
      image: "https://images.unsplash.com/photo-1590502593745-0a9c9d4ef14a?w=300&h=200&fit=crop",
      category: "wellness",
      includes: ["Multivitamin", "Vitamin D", "Vitamin C", "Omega-3", "Probiotics"],
      rating: 4.7,
      reviews: 156,
    },
    {
      id: "4",
      name: "Diabetes Care Package",
      price: "$34.99",
      description: "Specialized supplies for diabetes management",
      image: "https://images.unsplash.com/photo-1576091160247-26950f53d5e1?w=300&h=200&fit=crop",
      category: "chronic",
      includes: ["Glucose meter", "Test strips", "Lancets", "Sugar-free supplements", "Foot care items"],
      rating: 4.9,
      reviews: 67,
    },
    {
      id: "5",
      name: "Family Wellness Kit",
      price: "$49.99",
      description: "Comprehensive health package for the whole family",
      image: "https://images.unsplash.com/photo-1576091160390-3dfc1ee8c74c?w=300&h=200&fit=crop",
      category: "family",
      includes: ["Children's vitamins", "Adult vitamins", "First aid supplies", "Thermometer", "Health guides"],
      rating: 4.6,
      reviews: 203,
    },
    {
      id: "6",
      name: "Senior Care Package",
      price: "$39.99",
      description: "Tailored health solutions for seniors",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=300&h=200&fit=crop",
      category: "chronic",
      includes: ["Joint supplements", "Blood pressure monitor", "Vitamin D", "Calcium supplements", "Pain relief"],
      rating: 4.8,
      reviews: 98,
    },
  ];

  // Filter packages based on selected category and search query
  const filteredPackages = packages.filter(pkg => {
    const matchesCategory = selectedCategory === "all" || pkg.category === selectedCategory;
    const matchesSearch = pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pkg.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderCategoryItem = ({ item }: { item: typeof categories[0] }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item.id && styles.categoryItemSelected
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <MaterialIcons 
        name={item.icon} 
        size={24} 
        color={selectedCategory === item.id ? "#fff" : "#7226ff"} 
      />
      <Text style={[
        styles.categoryText,
        selectedCategory === item.id && styles.categoryTextSelected
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderPackageItem = ({ item }: { item: typeof packages[0] }) => (
    <View style={styles.packageCard}>
      <Image source={{ uri: item.image }} style={styles.packageImage} />
      
      <View style={styles.packageContent}>
        <View style={styles.packageHeader}>
          <Text style={styles.packageName}>{item.name}</Text>
          <Text style={styles.packagePrice}>{item.price}</Text>
        </View>
        
        <Text style={styles.packageDescription}>{item.description}</Text>
        
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating}</Text>
          <Text style={styles.reviewsText}>({item.reviews} reviews)</Text>
        </View>
        
        <View style={styles.includesContainer}>
          <Text style={styles.includesTitle}>Includes:</Text>
            {item.includes.slice(0, 3).map((include: string, index: number) => (
            <Text key={index} style={styles.includeItem}>• {include}</Text>
            ))}
          {item.includes.length > 3 && (
            <Text style={styles.moreItems}>+{item.includes.length - 3} more items</Text>
          )}
        </View>
        
        <TouchableOpacity style={styles.viewButton}>
          <Text style={styles.viewButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header with Gradient */}
      <LinearGradient
        colors={['#0033FF', '#977DFF']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Health Packages</Text>
          <Text style={styles.headerSubtitle}>Curated solutions for your health needs</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#777" style={styles.searchIcon} />
          <TextInput
            placeholder="Search health packages..."
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#777" />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Categories */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Package Categories</Text>
          <FlatList
            horizontal
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Packages List */}
        <View style={styles.packagesSection}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === "all" ? "All Health Packages" : 
             categories.find(cat => cat.id === selectedCategory)?.name}
            <Text style={styles.resultsCount}> ({filteredPackages.length} results)</Text>
          </Text>
          
          {filteredPackages.length > 0 ? (
            <FlatList
              data={filteredPackages}
              renderItem={renderPackageItem}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.packagesList}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="search" size={48} color="#ccc" />
              <Text style={styles.emptyStateText}>No packages found</Text>
              <Text style={styles.emptyStateSubtext}>
                Try adjusting your search or filter criteria
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    marginBottom: 15,
  },
  headerTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'white',
    fontSize: 16,
    opacity: 0.9,
    marginTop: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 45,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  categoriesSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  categoriesList: {
    paddingRight: 16,
  },
  categoryItem: {
    alignItems: 'center',
    padding: 12,
    marginRight: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    minWidth: 100,
  },
  categoryItemSelected: {
    backgroundColor: '#0033FF',
  },
  categoryText: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: '500',
    color: '#0033FF',
    textAlign: 'center',
  },
  categoryTextSelected: {
    color: '#fff',
  },
  packagesSection: {
    flex: 1,
  },
  resultsCount: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#666',
  },
  packagesList: {
    paddingBottom: 20,
  },
  packageCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  packageImage: {
    width: '100%',
    height: 150,
  },
  packageContent: {
    padding: 16,
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  packageName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  packagePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0033FF',
  },
  packageDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 4,
    marginRight: 8,
  },
  reviewsText: {
    fontSize: 14,
    color: '#666',
  },
  includesContainer: {
    marginBottom: 16,
  },
  includesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  includeItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  moreItems: {
    fontSize: 14,
    color: '#0033FF',
    fontStyle: 'italic',
    marginTop: 4,
  },
  viewButton: {
    backgroundColor: '#0033FF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default PackagesScreen;