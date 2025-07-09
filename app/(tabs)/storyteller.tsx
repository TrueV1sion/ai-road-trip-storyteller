import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import {
  Mic,
  Play,
  Pause,
  SkipForward,
  Volume2,
  Heart,
  Share,
  Sparkles,
  MapPin,
  Clock,
  Star,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const voicePersonalities = [
  {
    id: 1,
    name: 'Mickey Mouse',
    description: 'Perfect for Disney adventures',
    category: 'Event-Based',
    image: 'https://images.pexels.com/photos/1166209/pexels-photo-1166209.jpeg?auto=compress&cs=tinysrgb&w=400',
    color: '#ff6b6b',
    isActive: true,
  },
  {
    id: 2,
    name: 'California Surfer',
    description: 'Laid-back coastal vibes',
    category: 'Regional',
    image: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=400',
    color: '#4ecdc4',
    isActive: false,
  },
  {
    id: 3,
    name: 'Mountain Guide',
    description: 'Expert wilderness companion',
    category: 'Professional',
    image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=400',
    color: '#45b7d1',
    isActive: false,
  },
  {
    id: 4,
    name: 'Rock DJ',
    description: 'High-energy music lover',
    category: 'Event-Based',
    image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400',
    color: '#f39c12',
    isActive: false,
  },
];

const currentStories = [
  {
    id: 1,
    title: 'The Legend of Golden Gate',
    narrator: 'California Surfer',
    duration: '3:45',
    location: 'San Francisco, CA',
    isPlaying: false,
    isLiked: true,
  },
  {
    id: 2,
    title: 'Secrets of Alcatraz',
    narrator: 'Historic Guide',
    duration: '5:20',
    location: 'Alcatraz Island',
    isPlaying: true,
    isLiked: false,
  },
  {
    id: 3,
    title: 'Fisherman\'s Tales',
    narrator: 'Local Expert',
    duration: '2:15',
    location: 'Fisherman\'s Wharf',
    isPlaying: false,
    isLiked: true,
  },
];

export default function StorytellerTab() {
  const [selectedPersonality, setSelectedPersonality] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [playingStory, setPlayingStory] = useState<number | null>(2);

  const togglePlayback = (storyId: number) => {
    setPlayingStory(playingStory === storyId ? null : storyId);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>AI Storyteller</Text>
          <Text style={styles.subtitle}>Your magical journey companion</Text>
        </View>
        <View style={styles.headerIcon}>
          <Sparkles size={24} color="#7c3aed" />
        </View>
      </View>

      {/* Voice Personalities */}
      <View style={styles.personalitiesSection}>
        <Text style={styles.sectionTitle}>Choose Your Voice</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.personalitiesContainer}
        >
          {voicePersonalities.map((personality) => (
            <TouchableOpacity
              key={personality.id}
              style={[
                styles.personalityCard,
                selectedPersonality === personality.id && styles.selectedPersonality,
                { borderColor: personality.color }
              ]}
              onPress={() => setSelectedPersonality(personality.id)}
              activeOpacity={0.8}
            >
              <Image source={{ uri: personality.image }} style={styles.personalityImage} />
              <View style={styles.personalityOverlay}>
                {personality.isActive && (
                  <View style={[styles.activeIndicator, { backgroundColor: personality.color }]}>
                    <Text style={styles.activeText}>ACTIVE</Text>
                  </View>
                )}
              </View>
              <View style={styles.personalityContent}>
                <Text style={styles.personalityName}>{personality.name}</Text>
                <Text style={styles.personalityDescription}>{personality.description}</Text>
                <Text style={styles.personalityCategory}>{personality.category}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* AI Recording Controls */}
      <View style={styles.recordingSection}>
        <View style={styles.recordingHeader}>
          <Text style={styles.sectionTitle}>Create Story</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Volume2 size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.recordingCard}>
          <View style={styles.recordingVisualizer}>
            {[...Array(20)].map((_, index) => (
              <View
                key={index}
                style={[
                  styles.visualizerBar,
                  {
                    height: isRecording ? Math.random() * 40 + 10 : 4,
                    backgroundColor: isRecording ? '#7c3aed' : '#374151',
                  }
                ]}
              />
            ))}
          </View>
          
          <TouchableOpacity
            style={[styles.recordButton, isRecording && styles.recordingActive]}
            onPress={() => setIsRecording(!isRecording)}
            activeOpacity={0.8}
          >
            <Mic size={32} color="white" strokeWidth={2} />
          </TouchableOpacity>
          
          <Text style={styles.recordingText}>
            {isRecording ? 'Listening for your story...' : 'Tap to start recording'}
          </Text>
        </View>
      </View>

      {/* Current Stories */}
      <View style={styles.storiesSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Stories</Text>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {currentStories.map((story) => (
          <View key={story.id} style={styles.storyCard}>
            <TouchableOpacity
              style={styles.playButton}
              onPress={() => togglePlayback(story.id)}
            >
              {playingStory === story.id ? (
                <Pause size={20} color="white" />
              ) : (
                <Play size={20} color="white" />
              )}
            </TouchableOpacity>
            
            <View style={styles.storyInfo}>
              <Text style={styles.storyTitle}>{story.title}</Text>
              <View style={styles.storyMeta}>
                <Text style={styles.storyNarrator}>{story.narrator}</Text>
                <Text style={styles.storyDuration}>• {story.duration}</Text>
              </View>
              <View style={styles.storyLocation}>
                <MapPin size={12} color="#6b7280" />
                <Text style={styles.locationText}>{story.location}</Text>
              </View>
            </View>
            
            <View style={styles.storyActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Heart 
                  size={18} 
                  color={story.isLiked ? '#ef4444' : '#6b7280'} 
                  fill={story.isLiked ? '#ef4444' : 'none'}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Share size={18} color="#6b7280" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* AI Features */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>AI Features</Text>
        
        <View style={styles.featureCard}>
          <View style={styles.featureIcon}>
            <Sparkles size={24} color="#7c3aed" />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Smart Context Awareness</Text>
            <Text style={styles.featureDescription}>
              AI automatically detects your location, weather, and events to create personalized stories
            </Text>
          </View>
        </View>
        
        <View style={styles.featureCard}>
          <View style={styles.featureIcon}>
            <Clock size={24} color="#059669" />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Real-time Adaptation</Text>
            <Text style={styles.featureDescription}>
              Stories evolve based on your journey, traffic conditions, and points of interest
            </Text>
          </View>
        </View>
        
        <View style={styles.featureCard}>
          <View style={styles.featureIcon}>
            <Star size={24} color="#f59e0b" />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Personalized Recommendations</Text>
            <Text style={styles.featureDescription}>
              Get suggestions for restaurants, attractions, and hidden gems along your route
            </Text>
          </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
  },
  headerContent: {
    flex: 1,
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
  headerIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#1e1b4b',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  personalitiesSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  personalitiesContainer: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  personalityCard: {
    width: width * 0.6,
    marginRight: 16,
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPersonality: {
    borderWidth: 2,
  },
  personalityImage: {
    width: '100%',
    height: 120,
  },
  personalityOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  activeIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  activeText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: 'white',
  },
  personalityContent: {
    padding: 16,
  },
  personalityName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 4,
  },
  personalityDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
    marginBottom: 8,
  },
  personalityCategory: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  recordingSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  recordingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingsButton: {
    width: 40,
    height: 40,
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  recordingVisualizer: {
    flexDirection: 'row',
    alignItems: 'end',
    height: 50,
    gap: 3,
    marginBottom: 24,
  },
  visualizerBar: {
    width: 3,
    borderRadius: 2,
  },
  recordButton: {
    width: 80,
    height: 80,
    backgroundColor: '#7c3aed',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  recordingActive: {
    backgroundColor: '#ef4444',
  },
  recordingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#9ca3af',
    textAlign: 'center',
  },
  storiesSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#4f46e5',
  },
  storyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  playButton: {
    width: 48,
    height: 48,
    backgroundColor: '#4f46e5',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  storyInfo: {
    flex: 1,
  },
  storyTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 4,
  },
  storyMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  storyNarrator: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
  },
  storyDuration: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  storyLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  storyActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuresSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  featureIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#1e1b4b',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
    lineHeight: 20,
  },
});