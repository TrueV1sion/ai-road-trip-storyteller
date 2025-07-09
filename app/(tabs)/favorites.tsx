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
import {
  Heart,
  MapPin,
  Star,
  Clock,
  Trash2,
} from 'lucide-react-native';

const favoriteDestinations = [
  {
    id: 1,
    title: 'Paris, France',
    subtitle: 'City of Light',
    rating: 4.9,
    image: 'https://images.pexels.com/photos/161853/eiffel-tower-paris-france-tower-161853.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: '$1,299',
    duration: '5 days',
    savedDate: '2 weeks ago',
  },
  {
    id: 2,
    title: 'Tokyo, Japan',
    subtitle: 'Modern Metropolis',
    rating: 4.8,
    image: 'https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: '$1,599',
    duration: '7 days',
    savedDate: '1 month ago',
  },
  {
    id: 3,
    title: 'Machu Picchu, Peru',
    subtitle: 'Ancient Wonder',
    rating: 4.7,
    image: 'https://images.pexels.com/photos/2129796/pexels-photo-2129796.jpeg?auto=compress&cs=tinysrgb&w=400',
    price: '$999',
    duration: '6 days',
    savedDate: '3 days ago',
  },
];

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState(favoriteDestinations);

  const removeFavorite = (id: number) => {
    setFavorites(prev => prev.filter(item => item.id !== id));
  };

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Heart size={48} color="#D1D1D6" />
      </View>
      <Text style={styles.emptyTitle}>No favorites yet</Text>
      <Text style={styles.emptySubtitle}>
        Start exploring and save your favorite destinations here
      </Text>
      <TouchableOpacity style={styles.exploreButton}>
        <Text style={styles.exploreButtonText}>Explore Destinations</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Favorites</Text>
        <Text style={styles.subtitle}>
          {favorites.length} saved destination{favorites.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {favorites.length === 0 ? (
        <EmptyState />
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {favorites.map((destination) => (
            <View key={destination.id} style={styles.favoriteCard}>
              <Image source={{ uri: destination.image }} style={styles.favoriteImage} />
              <View style={styles.favoriteContent}>
                <View style={styles.favoriteHeader}>
                  <View style={styles.favoriteInfo}>
                    <Text style={styles.favoriteTitle}>{destination.title}</Text>
                    <Text style={styles.favoriteSubtitle}>{destination.subtitle}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => removeFavorite(destination.id)}
                  >
                    <Trash2 size={18} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.favoriteMeta}>
                  <View style={styles.metaItem}>
                    <Star size={12} color="#FFD700" fill="#FFD700" />
                    <Text style={styles.metaText}>{destination.rating}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Clock size={12} color="#8E8E93" />
                    <Text style={styles.metaText}>{destination.duration}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <MapPin size={12} color="#8E8E93" />
                    <Text style={styles.metaText}>Saved {destination.savedDate}</Text>
                  </View>
                </View>
                
                <View style={styles.favoriteFooter}>
                  <Text style={styles.favoritePrice}>{destination.price}</Text>
                  <TouchableOpacity style={styles.viewButton}>
                    <Text style={styles.viewButtonText}>View Details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
          
          {/* Tips Section */}
          <View style={styles.tipsSection}>
            <View style={styles.tipCard}>
              <View style={styles.tipIcon}>
                <Heart size={20} color="#FF3B30" fill="#FF3B30" />
              </View>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Pro Tip</Text>
                <Text style={styles.tipText}>
                  Save destinations you're interested in to compare prices and plan your perfect trip!
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  favoriteCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  favoriteImage: {
    width: '100%',
    height: 120,
  },
  favoriteContent: {
    padding: 16,
  },
  favoriteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  favoriteInfo: {
    flex: 1,
  },
  favoriteTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  favoriteSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
  },
  removeButton: {
    width: 36,
    height: 36,
    backgroundColor: '#F2F2F7',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
  },
  favoriteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  favoritePrice: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1C1C1E',
  },
  viewButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  viewButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
  tipsSection: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tipIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#FFF2F2',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    lineHeight: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    backgroundColor: '#F2F2F7',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  exploreButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  exploreButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
});