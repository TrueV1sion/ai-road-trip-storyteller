import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  RefreshControl,
} from 'react-native';
import {
  Search,
  Filter,
  MapPin,
  Star,
  Clock,
  Heart,
  X,
} from 'lucide-react-native';
import { useLocalSearchParams } from 'expo-router';
import { useAppStore } from '../../store/appStore';
import { ApiService } from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useToast } from '../../contexts/ToastContext';

const popularFilters = [
  { id: 'beach', label: 'Beach', icon: '🏖️' },
  { id: 'mountain', label: 'Mountain', icon: '🏔️' },
  { id: 'culture', label: 'Culture', icon: '🏛️' },
  { id: 'food', label: 'Food', icon: '🍜' },
  { id: 'adventure', label: 'Adventure', icon: '🎯' },
  { id: 'budget', label: 'Budget', icon: '💰' },
];

const priceRanges = [
  { id: 'budget', label: '$', range: '$0-$500' },
  { id: 'mid', label: '$$', range: '$500-$1500' },
  { id: 'luxury', label: '$$$', range: '$1500+' },
];

export default function SearchScreen() {
  const params = useLocalSearchParams();
  const toast = useToast();
  
  const {
    searchResults,
    setSearchResults,
    searchQuery,
    setSearchQuery,
    selectedFilters,
    setSelectedFilters,
    isLoading,
    setLoading,
    favorites,
    addToFavorites,
    removeFromFavorites,
  } = useAppStore();

  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('');

  useEffect(() => {
    // Handle category filter from navigation params
    if (params.category && typeof params.category === 'string') {
      const categoryFilter = params.category.toLowerCase();
      if (!selectedFilters.includes(categoryFilter)) {
        setSelectedFilters([...selectedFilters, categoryFilter]);
      }
    }
  }, [params.category]);

  useEffect(() => {
    if (searchQuery || selectedFilters.length > 0) {
      performSearch();
    }
  }, [searchQuery, selectedFilters, selectedPriceRange]);

  const performSearch = async () => {
    try {
      setLoading(true);
      
      const filters: any = {};
      
      if (selectedFilters.length > 0) {
        filters.category = selectedFilters[0]; // For now, use first filter
      }
      
      if (selectedPriceRange) {
        filters.priceRange = selectedPriceRange;
      }

      const response = await ApiService.searchDestinations(searchQuery, filters);
      
      if (response.success && response.data) {
        setSearchResults(response.data);
      } else {
        // Fallback to mock data in development
        if (__DEV__) {
          setSearchResults(mockSearchResults);
        } else {
          toast.error('Failed to search destinations');
        }
      }
    } catch (error) {
      console.error('Search error:', error);
      if (__DEV__) {
        setSearchResults(mockSearchResults);
      } else {
        toast.error('Search failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleFilter = (filterId: string) => {
    const newFilters = selectedFilters.includes(filterId)
      ? selectedFilters.filter(f => f !== filterId)
      : [...selectedFilters, filterId];
    setSelectedFilters(newFilters);
  };

  const clearFilters = () => {
    setSelectedFilters([]);
    setSelectedPriceRange('');
  };

  const isFavorite = (destinationId: string) => {
    return favorites.some(fav => fav.id === destinationId);
  };

  const toggleFavorite = async (destination: any) => {
    try {
      if (isFavorite(destination.id)) {
        removeFromFavorites(destination.id);
        await ApiService.removeFromFavorites(destination.id);
        toast.success('Removed from favorites');
      } else {
        addToFavorites(destination);
        await ApiService.addToFavorites(destination.id);
        toast.success('Added to favorites');
      }
    } catch (error) {
      console.error('Favorite toggle error:', error);
      toast.error('Failed to update favorites');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await performSearch();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
        <Text style={styles.subtitle}>Find your perfect destination</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#8E8E93" />
          <TextInput
            style={styles.searchInput}
            placeholder="Where would you like to go?"
            placeholderTextColor="#8E8E93"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            onSubmitEditing={performSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={20} color="#8E8E93" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity 
          style={[styles.filterButton, selectedFilters.length > 0 && styles.filterButtonActive]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} color={selectedFilters.length > 0 ? '#ffffff' : '#4f46e5'} />
          {selectedFilters.length > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{selectedFilters.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Filters Section */}
      {showFilters && (
        <Card style={styles.filtersCard}>
          <View style={styles.filtersHeader}>
            <Text style={styles.filtersTitle}>Filters</Text>
            <TouchableOpacity onPress={clearFilters}>
              <Text style={styles.clearFiltersText}>Clear All</Text>
            </TouchableOpacity>
          </View>
          
          {/* Category Filters */}
          <Text style={styles.filterSectionTitle}>Categories</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersContainer}
          >
            {popularFilters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterChip,
                  selectedFilters.includes(filter.id) && styles.filterChipActive
                ]}
                onPress={() => toggleFilter(filter.id)}
              >
                <Text style={styles.filterIcon}>{filter.icon}</Text>
                <Text
                  style={[
                    styles.filterChipText,
                    selectedFilters.includes(filter.id) && styles.filterChipTextActive
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Price Range */}
          <Text style={styles.filterSectionTitle}>Price Range</Text>
          <View style={styles.priceRangeContainer}>
            {priceRanges.map((range) => (
              <TouchableOpacity
                key={range.id}
                style={[
                  styles.priceRangeChip,
                  selectedPriceRange === range.id && styles.priceRangeChipActive
                ]}
                onPress={() => setSelectedPriceRange(
                  selectedPriceRange === range.id ? '' : range.id
                )}
              >
                <Text style={[
                  styles.priceRangeLabel,
                  selectedPriceRange === range.id && styles.priceRangeLabelActive
                ]}>
                  {range.label}
                </Text>
                <Text style={[
                  styles.priceRangeText,
                  selectedPriceRange === range.id && styles.priceRangeTextActive
                ]}>
                  {range.range}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>
      )}

      {/* Search Results */}
      <ScrollView 
        style={styles.resultsSection} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <LoadingSpinner size={40} color="#4f46e5" />
            <Text style={styles.loadingText}>Searching destinations...</Text>
          </View>
        ) : (
          <>
            <Text style={styles.resultsTitle}>
              {searchResults.length} destination{searchResults.length !== 1 ? 's' : ''} found
            </Text>
            
            {searchResults.map((result) => (
              <Card key={result.id} style={styles.resultCard}>
                <View style={styles.resultImageContainer}>
                  <Image source={{ uri: result.image_url }} style={styles.resultImage} />
                  <TouchableOpacity 
                    style={styles.favoriteButton}
                    onPress={() => toggleFavorite(result)}
                  >
                    <Heart 
                      size={20} 
                      color={isFavorite(result.id) ? '#ef4444' : '#ffffff'} 
                      fill={isFavorite(result.id) ? '#ef4444' : 'none'}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.resultContent}>
                  <View style={styles.resultHeader}>
                    <Text style={styles.resultTitle}>{result.title}</Text>
                    <Text style={styles.resultPrice}>{result.price_range}</Text>
                  </View>
                  <Text style={styles.resultSubtitle}>{result.subtitle}</Text>
                  
                  <View style={styles.resultMeta}>
                    <View style={styles.metaItem}>
                      <Star size={12} color="#FFD700" fill="#FFD700" />
                      <Text style={styles.metaText}>
                        {result.rating}
                      </Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Clock size={12} color="#8E8E93" />
                      <Text style={styles.metaText}>{result.duration}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <MapPin size={12} color="#8E8E93" />
                      <Text style={styles.metaText}>{result.location.address}</Text>
                    </View>
                  </View>

                  <Button 
                    variant="primary" 
                    size="small" 
                    style={styles.exploreButton}
                  >
                    Explore
                  </Button>
                </View>
              </Card>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

// Mock data for development
const mockSearchResults = [
  {
    id: '1',
    title: 'Bali, Indonesia',
    subtitle: 'Tropical Paradise',
    description: 'Beautiful beaches and rich culture',
    image_url: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: {
      latitude: -8.4095,
      longitude: 115.1889,
      address: 'Bali, Indonesia',
    },
    rating: 4.8,
    price_range: '$899',
    duration: '7 days',
    category: 'beach',
    featured: false,
  },
  {
    id: '2',
    title: 'Iceland Ring Road',
    subtitle: 'Nordic Adventure',
    description: 'Epic landscapes and natural wonders',
    image_url: 'https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: {
      latitude: 64.9631,
      longitude: -19.0208,
      address: 'Iceland',
    },
    rating: 4.9,
    price_range: '$1,599',
    duration: '10 days',
    category: 'adventure',
    featured: false,
  },
];

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
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1C1C1E',
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  filterButtonActive: {
    backgroundColor: '#4f46e5',
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  filtersCard: {
    marginHorizontal: 20,
    marginVertical: 8,
  },
  filtersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  filtersTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1C1C1E',
  },
  clearFiltersText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#4f46e5',
  },
  filterSectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1C1C1E',
    marginBottom: 12,
    marginTop: 8,
  },
  filtersContainer: {
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    gap: 6,
  },
  filterChipActive: {
    backgroundColor: '#4f46e5',
  },
  filterIcon: {
    fontSize: 16,
  },
  filterChipText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1C1C1E',
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  priceRangeContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  priceRangeChip: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  priceRangeChipActive: {
    backgroundColor: '#4f46e5',
  },
  priceRangeLabel: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1C1C1E',
  },
  priceRangeLabelActive: {
    color: '#ffffff',
  },
  priceRangeText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    marginTop: 2,
  },
  priceRangeTextActive: {
    color: '#ffffff',
  },
  resultsSection: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    marginTop: 16,
  },
  resultsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1C1C1E',
    padding: 20,
  },
  resultCard: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  resultImageContainer: {
    position: 'relative',
  },
  resultImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultContent: {
    padding: 16,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  resultTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1C1C1E',
    flex: 1,
    marginRight: 8,
  },
  resultPrice: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#4f46e5',
  },
  resultSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    marginBottom: 12,
  },
  resultMeta: {
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
  exploreButton: {
    alignSelf: 'flex-start',
  },
});