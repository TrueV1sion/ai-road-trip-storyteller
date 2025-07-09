import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  Image,
} from 'react-native';
import {
  Search,
  MapPin,
  Navigation,
  Clock,
  Fuel,
  Zap,
  Coffee,
  Camera,
  Star,
  ArrowRight,
} from 'lucide-react-native';

const recentDestinations = [
  { id: 1, name: 'Yosemite National Park', distance: '2.5 hours', type: 'Nature' },
  { id: 2, name: 'San Francisco', distance: '1 hour', type: 'City' },
  { id: 3, name: 'Napa Valley', distance: '1.5 hours', type: 'Wine Country' },
];

const nearbyPOIs = [
  {
    id: 1,
    name: 'Golden Gate Bridge',
    type: 'Landmark',
    distance: '0.5 miles',
    rating: 4.8,
    image: 'https://images.pexels.com/photos/1006965/pexels-photo-1006965.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 2,
    name: 'Alcatraz Island',
    type: 'Historic Site',
    distance: '1.2 miles',
    rating: 4.6,
    image: 'https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 3,
    name: 'Fisherman\'s Wharf',
    type: 'Attraction',
    distance: '0.8 miles',
    rating: 4.4,
    image: 'https://images.pexels.com/photos/1006965/pexels-photo-1006965.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

const quickServices = [
  { icon: Fuel, title: 'Gas Stations', color: '#ef4444' },
  { icon: Zap, title: 'EV Charging', color: '#22c55e' },
  { icon: Coffee, title: 'Rest Stops', color: '#8b5cf6' },
  { icon: Camera, title: 'Photo Spots', color: '#f59e0b' },
];

export default function NavigationTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isNavigating, setIsNavigating] = useState(false);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Navigation</Text>
        <Text style={styles.subtitle}>Your AI-powered travel companion</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#6b7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Where would you like to go?"
            placeholderTextColor="#6b7280"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.voiceButton}>
          <Navigation size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Current Location */}
      <View style={styles.currentLocation}>
        <View style={styles.locationHeader}>
          <MapPin size={20} color="#4f46e5" />
          <Text style={styles.locationTitle}>Current Location</Text>
        </View>
        <Text style={styles.locationAddress}>San Francisco, CA</Text>
        <Text style={styles.locationDetails}>Market Street, Financial District</Text>
      </View>

      {/* Quick Services */}
      <View style={styles.quickServices}>
        <Text style={styles.sectionTitle}>Quick Services</Text>
        <View style={styles.servicesGrid}>
          {quickServices.map((service, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.serviceButton, { backgroundColor: service.color }]}
              activeOpacity={0.8}
            >
              <service.icon size={24} color="white" strokeWidth={2} />
              <Text style={styles.serviceText}>{service.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Destinations */}
      <View style={styles.recentSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Destinations</Text>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All</Text>
            <ArrowRight size={16} color="#4f46e5" />
          </TouchableOpacity>
        </View>
        
        {recentDestinations.map((destination) => (
          <TouchableOpacity key={destination.id} style={styles.destinationCard}>
            <View style={styles.destinationInfo}>
              <Text style={styles.destinationName}>{destination.name}</Text>
              <View style={styles.destinationMeta}>
                <Clock size={14} color="#6b7280" />
                <Text style={styles.destinationDistance}>{destination.distance}</Text>
                <Text style={styles.destinationType}>• {destination.type}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.navigateButton}>
              <Navigation size={16} color="#4f46e5" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>

      {/* Nearby Points of Interest */}
      <View style={styles.poiSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Nearby Attractions</Text>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All</Text>
            <ArrowRight size={16} color="#4f46e5" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.poiContainer}
        >
          {nearbyPOIs.map((poi) => (
            <TouchableOpacity key={poi.id} style={styles.poiCard}>
              <Image source={{ uri: poi.image }} style={styles.poiImage} />
              <View style={styles.poiOverlay}>
                <View style={styles.poiRating}>
                  <Star size={12} color="#fbbf24" fill="#fbbf24" />
                  <Text style={styles.ratingText}>{poi.rating}</Text>
                </View>
              </View>
              <View style={styles.poiContent}>
                <Text style={styles.poiName}>{poi.name}</Text>
                <Text style={styles.poiType}>{poi.type}</Text>
                <View style={styles.poiMeta}>
                  <MapPin size={12} color="#6b7280" />
                  <Text style={styles.poiDistance}>{poi.distance}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Navigation Status */}
      {!isNavigating ? (
        <View style={styles.navigationPrompt}>
          <Navigation size={32} color="#4f46e5" />
          <Text style={styles.promptTitle}>Ready to Navigate</Text>
          <Text style={styles.promptDescription}>
            Choose a destination and let our AI guide you with personalized stories and recommendations along the way.
          </Text>
          <TouchableOpacity 
            style={styles.startNavigationButton}
            onPress={() => setIsNavigating(true)}
          >
            <Text style={styles.startNavigationText}>Start Navigation</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.activeNavigation}>
          <View style={styles.navigationHeader}>
            <Text style={styles.navigationTitle}>Navigating to Yosemite</Text>
            <TouchableOpacity 
              style={styles.stopButton}
              onPress={() => setIsNavigating(false)}
            >
              <Text style={styles.stopButtonText}>Stop</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.navigationStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>2h 15m</Text>
              <Text style={styles.statLabel}>ETA</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>127 mi</Text>
              <Text style={styles.statLabel}>Distance</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>Active</Text>
              <Text style={styles.statLabel}>AI Guide</Text>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#ffffff',
  },
  voiceButton: {
    width: 48,
    height: 48,
    backgroundColor: '#4f46e5',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentLocation: {
    marginHorizontal: 20,
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  locationTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  locationAddress: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 4,
  },
  locationDetails: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
  },
  quickServices: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 16,
  },
  servicesGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  serviceButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  serviceText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: 'white',
    textAlign: 'center',
  },
  recentSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#4f46e5',
  },
  destinationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  destinationInfo: {
    flex: 1,
  },
  destinationName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 4,
  },
  destinationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  destinationDistance: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  destinationType: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  navigateButton: {
    width: 40,
    height: 40,
    backgroundColor: '#1e1b4b',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  poiSection: {
    marginBottom: 24,
  },
  poiContainer: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  poiCard: {
    width: 200,
    marginRight: 16,
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    overflow: 'hidden',
  },
  poiImage: {
    width: '100%',
    height: 120,
  },
  poiOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  poiRating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 3,
  },
  ratingText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: 'white',
  },
  poiContent: {
    padding: 12,
  },
  poiName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 2,
  },
  poiType: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
    marginBottom: 6,
  },
  poiMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  poiDistance: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  navigationPrompt: {
    marginHorizontal: 20,
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 30,
  },
  promptTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginTop: 12,
    marginBottom: 8,
  },
  promptDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  startNavigationButton: {
    backgroundColor: '#4f46e5',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  startNavigationText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
  activeNavigation: {
    marginHorizontal: 20,
    backgroundColor: '#1e1b4b',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
  },
  navigationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  navigationTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  stopButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  stopButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: 'white',
  },
  navigationStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
  },
});