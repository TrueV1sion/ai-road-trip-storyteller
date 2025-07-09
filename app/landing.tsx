import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  Dimensions,
} from 'react-native';
import { Link, router } from 'expo-router';
import { Sparkles, Navigation, Mic, MapPin, Star, ChevronRight } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

export default function LandingPage() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <View style={styles.hero}>
        <View style={styles.heroContent}>
          <View style={styles.logoContainer}>
            <Sparkles size={48} color="#7c3aed" />
          </View>
          <Text style={styles.title}>AI Road Trip Storyteller</Text>
          <Text style={styles.subtitle}>
            Transform your journey into an unforgettable adventure with AI-powered stories
          </Text>
          
          <View style={styles.ctaContainer}>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => router.push('/(auth)/register')}
            >
              <Text style={styles.primaryButtonText}>Start Your Journey</Text>
              <ChevronRight size={20} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => router.push('/(auth)/login')}
            >
              <Text style={styles.secondaryButtonText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* Features Section */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>Why Choose AI Road Trip?</Text>
        
        <View style={styles.featureGrid}>
          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <Mic size={28} color="#7c3aed" />
            </View>
            <Text style={styles.featureTitle}>20+ Voice Personalities</Text>
            <Text style={styles.featureDescription}>
              From Mickey Mouse to Mountain Guide, find the perfect narrator for your journey
            </Text>
          </View>
          
          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <Navigation size={28} color="#10b981" />
            </View>
            <Text style={styles.featureTitle}>Smart Navigation</Text>
            <Text style={styles.featureDescription}>
              Real-time route guidance with contextual stories based on your location
            </Text>
          </View>
          
          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <MapPin size={28} color="#f59e0b" />
            </View>
            <Text style={styles.featureTitle}>Local Insights</Text>
            <Text style={styles.featureDescription}>
              Discover hidden gems and local favorites along your route
            </Text>
          </View>
          
          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <Star size={28} color="#ef4444" />
            </View>
            <Text style={styles.featureTitle}>Personalized Stories</Text>
            <Text style={styles.featureDescription}>
              AI creates unique narratives tailored to your interests and journey
            </Text>
          </View>
        </View>
      </View>
      {/* How It Works */}
      <View style={styles.howItWorksSection}>
        <Text style={styles.sectionTitle}>How It Works</Text>
        
        <View style={styles.stepContainer}>
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.stepTitle}>Plan Your Trip</Text>
            <Text style={styles.stepDescription}>
              Enter your destination and let AI create the perfect route
            </Text>
          </View>
          
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.stepTitle}>Choose Your Voice</Text>
            <Text style={styles.stepDescription}>
              Select from 20+ personality options to narrate your journey
            </Text>
          </View>
          
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.stepTitle}>Hit the Road</Text>
            <Text style={styles.stepDescription}>
              Enjoy personalized stories and discover amazing places
            </Text>
          </View>
        </View>
      </View>

      {/* Footer CTA */}
      <View style={styles.footerCTA}>
        <Text style={styles.footerTitle}>Ready to Start Your Adventure?</Text>
        <Text style={styles.footerSubtitle}>
          Join thousands of travelers discovering the magic in every mile
        </Text>
        <TouchableOpacity 
          style={styles.footerButton}
          onPress={() => router.push('/(auth)/register')}
        >
          <Text style={styles.footerButtonText}>Get Started Free</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  hero: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 60,
    alignItems: 'center',
  },
  heroContent: {
    alignItems: 'center',
    maxWidth: isWeb ? 600 : '100%',
  },
  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#1e1b4b',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: isWeb ? 48 : 36,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: isWeb ? 20 : 18,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 32,
  },
  ctaContainer: {
    flexDirection: isWeb ? 'row' : 'column',
    gap: 16,
    width: '100%',
    maxWidth: 400,
  },
  primaryButton: {
    backgroundColor: '#7c3aed',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    flex: isWeb ? 1 : 0,
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: '#374151',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    flex: isWeb ? 1 : 0,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#9ca3af',
  },
  featuresSection: {
    paddingHorizontal: 20,
    paddingVertical: 60,
    backgroundColor: '#1a1a2e',
  },
  sectionTitle: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 40,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
    maxWidth: isWeb ? 1200 : '100%',
    alignSelf: 'center',
  },
  featureCard: {
    backgroundColor: '#0f0f23',
    borderRadius: 16,
    padding: 24,
    width: isWeb ? (width > 1200 ? 280 : '45%') : '100%',
    minWidth: isWeb ? 280 : 0,
  },
  featureIcon: {
    width: 56,
    height: 56,
    backgroundColor: '#1e1b4b',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
    lineHeight: 20,
  },
  howItWorksSection: {
    paddingHorizontal: 20,
    paddingVertical: 60,
  },
  stepContainer: {
    maxWidth: isWeb ? 800 : '100%',
    alignSelf: 'center',
    gap: 32,
  },
  step: {
    flexDirection: isWeb ? 'row' : 'column',
    alignItems: isWeb ? 'center' : 'flex-start',
    gap: isWeb ? 24 : 16,
  },
  stepNumber: {
    width: 48,
    height: 48,
    backgroundColor: '#7c3aed',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: 'white',
  },
  stepTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
    lineHeight: 24,
  },
  footerCTA: {
    paddingHorizontal: 20,
    paddingVertical: 60,
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
  footerTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12,
  },
  footerSubtitle: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 32,
    maxWidth: 600,
  },
  footerButton: {
    backgroundColor: '#7c3aed',
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 12,
  },
  footerButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
});