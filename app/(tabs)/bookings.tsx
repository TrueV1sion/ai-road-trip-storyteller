import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { Calendar, MapPin, Clock, Users, Star, CreditCard, CircleCheck as CheckCircle, CircleAlert as AlertCircle, ArrowRight, Utensils, Bed, Zap, Camera } from 'lucide-react-native';

const upcomingBookings = [
  {
    id: 1,
    type: 'restaurant',
    name: 'The French Laundry',
    location: 'Yountville, CA',
    date: '2025-01-15',
    time: '7:30 PM',
    guests: 2,
    status: 'confirmed',
    image: 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: '$450',
  },
  {
    id: 2,
    type: 'hotel',
    name: 'Ahwahnee Hotel',
    location: 'Yosemite National Park',
    date: '2025-01-16',
    time: 'Check-in 3:00 PM',
    guests: 2,
    status: 'pending',
    image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: '$320/night',
  },
  {
    id: 3,
    type: 'charging',
    name: 'Tesla Supercharger',
    location: 'Modesto, CA',
    date: '2025-01-14',
    time: '2:15 PM',
    guests: 1,
    status: 'confirmed',
    image: 'https://images.pexels.com/photos/110844/pexels-photo-110844.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: '$25',
  },
];

const recommendations = [
  {
    id: 1,
    type: 'restaurant',
    name: 'Benu',
    location: 'San Francisco, CA',
    rating: 4.8,
    price: '$$$',
    image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Michelin-starred Asian fusion',
  },
  {
    id: 2,
    type: 'hotel',
    name: 'Post Ranch Inn',
    location: 'Big Sur, CA',
    rating: 4.9,
    price: '$$$',
    image: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Luxury eco-resort with ocean views',
  },
  {
    id: 3,
    type: 'activity',
    name: 'Alcatraz Island Tour',
    location: 'San Francisco Bay',
    rating: 4.7,
    price: '$$',
    image: 'https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Historic prison island experience',
  },
];

const bookingTypes = [
  { icon: Utensils, title: 'Restaurants', color: '#ef4444', count: 12 },
  { icon: Bed, title: 'Hotels', color: '#3b82f6', count: 5 },
  { icon: Zap, title: 'EV Charging', color: '#22c55e', count: 8 },
  { icon: Camera, title: 'Activities', color: '#f59e0b', count: 15 },
];

export default function BookingsTab() {
  const [selectedTab, setSelectedTab] = useState('upcoming');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle size={16} color="#22c55e" />;
      case 'pending':
        return <AlertCircle size={16} color="#f59e0b" />;
      default:
        return <Clock size={16} color="#6b7280" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'restaurant':
        return <Utensils size={20} color="#ef4444" />;
      case 'hotel':
        return <Bed size={20} color="#3b82f6" />;
      case 'charging':
        return <Zap size={20} color="#22c55e" />;
      default:
        return <Camera size={20} color="#f59e0b" />;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Smart Bookings</Text>
        <Text style={styles.subtitle}>AI-powered travel reservations</Text>
      </View>

      {/* Booking Types Overview */}
      <View style={styles.typesSection}>
        <Text style={styles.sectionTitle}>Quick Book</Text>
        <View style={styles.typesGrid}>
          {bookingTypes.map((type, index) => (
            <TouchableOpacity key={index} style={styles.typeCard} activeOpacity={0.8}>
              <View style={[styles.typeIcon, { backgroundColor: type.color }]}>
                <type.icon size={24} color="white" strokeWidth={2} />
              </View>
              <Text style={styles.typeTitle}>{type.title}</Text>
              <Text style={styles.typeCount}>{type.count} nearby</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabNavigation}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'upcoming' && styles.activeTab]}
          onPress={() => setSelectedTab('upcoming')}
        >
          <Text style={[styles.tabText, selectedTab === 'upcoming' && styles.activeTabText]}>
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'recommendations' && styles.activeTab]}
          onPress={() => setSelectedTab('recommendations')}
        >
          <Text style={[styles.tabText, selectedTab === 'recommendations' && styles.activeTabText]}>
            Recommendations
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content based on selected tab */}
      {selectedTab === 'upcoming' ? (
        <View style={styles.bookingsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Bookings</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>Manage All</Text>
              <ArrowRight size={16} color="#4f46e5" />
            </TouchableOpacity>
          </View>

          {upcomingBookings.map((booking) => (
            <TouchableOpacity key={booking.id} style={styles.bookingCard} activeOpacity={0.9}>
              <Image source={{ uri: booking.image }} style={styles.bookingImage} />
              <View style={styles.bookingContent}>
                <View style={styles.bookingHeader}>
                  <View style={styles.bookingType}>
                    {getTypeIcon(booking.type)}
                  </View>
                  <View style={styles.bookingStatus}>
                    {getStatusIcon(booking.status)}
                    <Text style={styles.statusText}>{booking.status}</Text>
                  </View>
                </View>
                
                <Text style={styles.bookingName}>{booking.name}</Text>
                <View style={styles.bookingLocation}>
                  <MapPin size={14} color="#6b7280" />
                  <Text style={styles.locationText}>{booking.location}</Text>
                </View>
                
                <View style={styles.bookingDetails}>
                  <View style={styles.detailItem}>
                    <Calendar size={14} color="#6b7280" />
                    <Text style={styles.detailText}>{booking.date}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Clock size={14} color="#6b7280" />
                    <Text style={styles.detailText}>{booking.time}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Users size={14} color="#6b7280" />
                    <Text style={styles.detailText}>{booking.guests} guests</Text>
                  </View>
                </View>
                
                <View style={styles.bookingFooter}>
                  <Text style={styles.bookingPrice}>{booking.price}</Text>
                  <TouchableOpacity style={styles.manageButton}>
                    <Text style={styles.manageButtonText}>Manage</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.recommendationsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>AI Recommendations</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All</Text>
              <ArrowRight size={16} color="#4f46e5" />
            </TouchableOpacity>
          </View>

          {recommendations.map((rec) => (
            <TouchableOpacity key={rec.id} style={styles.recommendationCard} activeOpacity={0.9}>
              <Image source={{ uri: rec.image }} style={styles.recImage} />
              <View style={styles.recContent}>
                <View style={styles.recHeader}>
                  <Text style={styles.recName}>{rec.name}</Text>
                  <View style={styles.recRating}>
                    <Star size={12} color="#fbbf24" fill="#fbbf24" />
                    <Text style={styles.ratingText}>{rec.rating}</Text>
                  </View>
                </View>
                
                <View style={styles.recLocation}>
                  <MapPin size={12} color="#6b7280" />
                  <Text style={styles.recLocationText}>{rec.location}</Text>
                </View>
                
                <Text style={styles.recDescription}>{rec.description}</Text>
                
                <View style={styles.recFooter}>
                  <Text style={styles.recPrice}>{rec.price}</Text>
                  <TouchableOpacity style={styles.bookButton}>
                    <Text style={styles.bookButtonText}>Book Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* AI Booking Assistant */}
      <View style={styles.assistantSection}>
        <View style={styles.assistantCard}>
          <View style={styles.assistantHeader}>
            <View style={styles.assistantIcon}>
              <CreditCard size={24} color="#4f46e5" />
            </View>
            <Text style={styles.assistantTitle}>AI Booking Assistant</Text>
          </View>
          <Text style={styles.assistantDescription}>
            Let our AI automatically detect booking opportunities and make reservations for you based on your journey and preferences.
          </Text>
          <TouchableOpacity style={styles.assistantButton}>
            <Text style={styles.assistantButtonText}>Enable Auto-Booking</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  typesSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 16,
  },
  typesGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  typeCard: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  typeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 4,
  },
  typeCount: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  tabNavigation: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#4f46e5',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  activeTabText: {
    color: 'white',
  },
  bookingsSection: {
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
  bookingCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  bookingImage: {
    width: '100%',
    height: 120,
  },
  bookingContent: {
    padding: 16,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bookingType: {
    width: 36,
    height: 36,
    backgroundColor: '#1e1b4b',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookingStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#9ca3af',
    textTransform: 'capitalize',
  },
  bookingName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 6,
  },
  bookingLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  locationText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  bookingDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookingPrice: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  manageButton: {
    backgroundColor: '#4f46e5',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  manageButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: 'white',
  },
  recommendationsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  recommendationCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  recImage: {
    width: 100,
    height: 100,
  },
  recContent: {
    flex: 1,
    padding: 16,
  },
  recHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  recName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    flex: 1,
    marginRight: 8,
  },
  recRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#ffffff',
  },
  recLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  recLocationText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  recDescription: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
    marginBottom: 12,
    lineHeight: 18,
  },
  recFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recPrice: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  bookButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  bookButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: 'white',
  },
  assistantSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  assistantCard: {
    backgroundColor: '#1e1b4b',
    borderRadius: 20,
    padding: 20,
  },
  assistantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  assistantIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#312e81',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  assistantTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  assistantDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
    lineHeight: 20,
    marginBottom: 16,
  },
  assistantButton: {
    backgroundColor: '#4f46e5',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  assistantButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
});