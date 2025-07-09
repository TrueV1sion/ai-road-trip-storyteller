import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  RefreshControl,
} from 'react-native';
import {
  MapPin,
  Clock,
  Star,
  ArrowRight,
  Sparkles,
  User,
  Navigation,
  Heart,
  Play,
  Mic,
  Calendar,
  TrendingUp,
  Camera,
  Coffee,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import LoadingSpinner from '../../components/LoadingSpinner';

const { width } = Dimensions.get('window');

const categories = [
  { 
    icon: '🏖️', 
    title: 'Beach', 
    color: '#FF6B6B', 
    gradient: ['#FF6B6B', '#FF8E53'],
    destinations: 127
  },
  { 
    icon: '🏔️', 
    title: 'Mountain', 
    color: '#4ECDC4', 
    gradient: ['#4ECDC4', '#44A08D'],
    destinations: 89
  },
  { 
    icon: '🏛️', 
    title: 'Culture', 
    color: '#45B7D1', 
    gradient: ['#45B7D1', '#96C93D'],
    destinations: 156
  },
  { 
    icon: '🍜', 
    title: 'Food', 
    color: '#FFA07A', 
    gradient: ['#FFA07A', '#FA8072'],
    destinations: 203
  },
];

const featuredDestinations = [
  {
    id: '1',
    title: 'Santorini, Greece',
    subtitle: 'Cycladic Paradise',
    description: 'Experience stunning sunsets and white-washed buildings',
    image_url: 'https://images.pexels.com/photos/161901/santorini-greece-island-sunset-161901.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: {
      latitude: 36.3932,
      longitude: 25.4615,
      address: 'Santorini, Greece',
    },
    rating: 4.9,
    price_range: '$1,299',
    duration: '7 days',
    category: 'culture',
    featured: true,
  },
  {
    id: '2',
    title: 'Kyoto, Japan',
    subtitle: 'Ancient Temples & Gardens',
    description: 'Discover traditional Japanese culture and beautiful temples',
    image_url: 'https://images.pexels.com/photos/402028/pexels-photo-402028.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: {
      latitude: 35.0116,
      longitude: 135.7681,
      address: 'Kyoto, Japan',
    },
    rating: 4.8,
    price_range: '$899',
    duration: '5 days',
    category: 'culture',
    featured: true,
  },
  {
    id: '3',
    title: 'Swiss Alps',
    subtitle: 'Mountain Adventure',
    description: 'Experience breathtaking mountain views and outdoor activities',
    image_url: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800',
    location: {
      latitude: 46.8182,
      longitude: 8.2275,
      address: 'Swiss Alps',
    },
    rating: 4.7,
    price_range: '$2,199',
    duration: '10 days',
    category: 'mountain',
    featured: true,
  },
];

const quickActions = [
  {
    icon: Navigation,
    title: 'Plan Trip',
    subtitle: 'AI-powered route planning',
    color: '#4f46e5',
    action: () => router.push('/(tabs)/navigation'),
  },
  {
    icon: Sparkles,
    title: 'AI Stories',
    subtitle: 'Generate magical narratives',
    color: '#7c3aed',
    action: () => router.push('/(tabs)/storyteller'),
  },
  {
    icon: Calendar,
    title: 'Smart Booking',
    subtitle: 'Auto-reserve your journey',
    color: '#06b6d4',
    action: () => router.push('/(tabs)/bookings'),
  },
  {
    icon: Camera,
    title: 'Capture Moments',
    subtitle: 'Photo-story integration',
    color: '#10b981',
    action: () => {},
  },
];

export default function HomeScreen() {
  const { user, isLoading } = useAuthContext();
  const toast = useToast();
  const [refreshing, setRefreshing] = useState(false);
  const [greeting, setGreeting] = useState('Good morning');
  const [currentStory, setCurrentStory] = useState({
    title: 'The Golden Gate Chronicles',
    narrator: 'California Surfer',
    progress: 0.3,
    isPlaying: false,
  });

  useEffect(() => {
    updateGreeting();
  }, []);

  const updateGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good morning');
    } else if (hour < 18) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
      toast.success('Content refreshed!');
    }, 1000);
  };

  const handleCategoryPress = (category: string) => {
    router.push({
      pathname: '/(tabs)/search',
      params: { category: category.toLowerCase() },
    });
  };

  const handleDestinationPress = (destination: any) => {
    toast.info(`Exploring ${destination.title}...`);
  };

  const toggleStoryPlayback = () => {
    setCurrentStory(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
    toast.success(currentStory.isPlaying ? 'Story paused' : 'Story playing');
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner size={48} color="#4f46e5" />
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh}
          colors={['#4f46e5']}
          tintColor="#4f46e5"
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>{greeting}!</Text>
          <Text style={styles.userName}>
            {user?.full_name || user?.username || 'Explorer'}
          </Text>
          <Text style={styles.subtitle}>Ready for your next adventure?</Text>
        </View>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => router.push('/(tabs)/profile')}
        >
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200' }}
            style={styles.profileImage}
          />
          <View style={styles.onlineIndicator} />
        </TouchableOpacity>
      </View>

      {/* Current Story Player */}
      <View style={styles.storyPlayer}>
        <View style={styles.storyPlayerContent}>
          <View style={styles.storyInfo}>
            <Text style={styles.storyTitle}>{currentStory.title}</Text>
            <Text style={styles.storyNarrator}>by {currentStory.narrator}</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${currentStory.progress * 100}%` }]} />
            </View>
          </View>
          <TouchableOpacity 
            style={styles.playButton}
            onPress={toggleStoryPlayback}
          >
            {currentStory.isPlaying ? (
              <View style={styles.pauseIcon}>
                <View style={styles.pauseLine} />
                <View style={styles.pauseLine} />
              </View>
            ) : (
              <Play size={20} color="#ffffff" fill="#ffffff" />
            )}
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.micButton}>
          <Mic size={18} color="#4f46e5" />
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsSection}>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <TrendingUp size={24} color="#22c55e" />
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Trips Planned</Text>
          </View>
          <View style={styles.statCard}>
            <Star size={24} color="#f59e0b" />
            <Text style={styles.statValue}>4.9</Text>
            <Text style={styles.statLabel}>Avg Rating</Text>
          </View>
          <View style={styles.statCard}>
            <MapPin size={24} color="#ef4444" />
            <Text style={styles.statValue}>47</Text>
            <Text style={styles.statLabel}>Countries</Text>
          </View>
        </View>
      </View>

      {/* Categories */}
      <View style={styles.categoriesSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Explore by Category</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/search')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.categoriesGrid}>
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.categoryCard, { backgroundColor: category.color }]}
              activeOpacity={0.8}
              onPress={() => handleCategoryPress(category.title)}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={styles.categoryTitle}>{category.title}</Text>
              <Text style={styles.categoryCount}>{category.destinations} places</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Featured Destinations */}
      <View style={styles.featuredSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Destinations</Text>
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={() => router.push('/(tabs)/search')}
          >
            <Text style={styles.viewAllText}>View All</Text>
            <ArrowRight size={16} color="#4f46e5" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.destinationsContainer}
        >
          {featuredDestinations.map((destination) => (
            <TouchableOpacity
              key={destination.id}
              style={styles.destinationCard}
              activeOpacity={0.9}
              onPress={() => handleDestinationPress(destination)}
            >
              <Image 
                source={{ uri: destination.image_url }} 
                style={styles.destinationImage} 
              />
              <View style={styles.destinationOverlay}>
                <TouchableOpacity style={styles.favoriteButton}>
                  <Heart size={18} color="#ffffff" />
                </TouchableOpacity>
                <View style={styles.destinationRating}>
                  <Star size={12} color="#FFD700" fill="#FFD700" />
                  <Text style={styles.ratingText}>{destination.rating}</Text>
                </View>
              </View>
              <View style={styles.destinationContent}>
                <Text style={styles.destinationTitle}>{destination.title}</Text>
                <Text style={styles.destinationSubtitle}>{destination.subtitle}</Text>
                <View style={styles.destinationMeta}>
                  <View style={styles.metaItem}>
                    <Clock size={14} color="#8E8E93" />
                    <Text style={styles.metaText}>{destination.duration}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <MapPin size={14} color="#8E8E93" />
                    <Text style={styles.metaText}>{destination.location.address}</Text>
                  </View>
                </View>
                <View style={styles.destinationFooter}>
                  <Text style={styles.price}>{destination.price_range}</Text>
                  <TouchableOpacity style={styles.exploreButton}>
                    <Text style={styles.exploreButtonText}>Explore</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsSection}>
        <Text style={styles.sectionTitle}>AI-Powered Tools</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.quickAction}
              onPress={action.action}
              activeOpacity={0.8}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                <action.icon size={24} color="#ffffff" strokeWidth={2} />
              </View>
              <Text style={styles.quickActionTitle}>{action.title}</Text>
              <Text style={styles.quickActionSubtitle}>{action.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Travel Inspiration */}
      <View style={styles.inspirationSection}>
        <View style={styles.inspirationCard}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/1562058/pexels-photo-1562058.jpeg?auto=compress&cs=tinysrgb&w=800' }}
            style={styles.inspirationImage}
          />
          <View style={styles.inspirationOverlay}>
            <View style={styles.inspirationContent}>
              <Text style={styles.inspirationTitle}>Weekend Getaway</Text>
              <Text style={styles.inspirationSubtitle}>Discover hidden gems within 2 hours of your location</Text>
              <TouchableOpacity style={styles.inspirationButton}>
                <Text style={styles.inspirationButtonText}>Find Now</Text>
                <ArrowRight size={16} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
  },
  headerContent: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
  },
  userName: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
  },
  profileButton: {
    position: 'relative',
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    backgroundColor: '#22c55e',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  storyPlayer: {
    marginHorizontal: 20,
    marginVertical: 16,
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  storyPlayerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  storyInfo: {
    flex: 1,
    marginRight: 16,
  },
  storyTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 4,
  },
  storyNarrator: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94a3b8',
    marginBottom: 8,
  },
  progressBar: {
    height: 3,
    backgroundColor: '#334155',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4f46e5',
  },
  playButton: {
    width: 40,
    height: 40,
    backgroundColor: '#4f46e5',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseIcon: {
    flexDirection: 'row',
    gap: 3,
  },
  pauseLine: {
    width: 3,
    height: 12,
    backgroundColor: '#ffffff',
    borderRadius: 1,
  },
  micButton: {
    width: 36,
    height: 36,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#0f172a',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748b',
    textAlign: 'center',
  },
  categoriesSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: '#0f172a',
  },
  viewAllText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#4f46e5',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  categoriesGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  categoryCard: {
    flex: 1,
    paddingVertical: 24,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  categoryIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  featuredSection: {
    marginBottom: 32,
  },
  destinationsContainer: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  destinationCard: {
    width: width * 0.75,
    marginRight: 16,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  destinationImage: {
    width: '100%',
    height: 200,
  },
  destinationOverlay: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  favoriteButton: {
    width: 36,
    height: 36,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  destinationRating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  destinationContent: {
    padding: 20,
  },
  destinationTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  destinationSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginBottom: 16,
  },
  destinationMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748b',
  },
  destinationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#0f172a',
  },
  exploreButton: {
    backgroundColor: '#4f46e5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  exploreButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  quickActionsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickAction: {
    width: (width - 52) / 2,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  quickActionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#0f172a',
    marginBottom: 4,
    textAlign: 'center',
  },
  quickActionSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 16,
  },
  inspirationSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  inspirationCard: {
    height: 180,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  inspirationImage: {
    width: '100%',
    height: '100%',
  },
  inspirationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inspirationContent: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  inspirationTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  inspirationSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  inspirationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4f46e5',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    gap: 8,
  },
  inspirationButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
});