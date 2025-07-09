import React from 'react';
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
  User,
  Settings,
  Bell,
  Heart,
  MapPin,
  Star,
  Award,
  ChevronRight,
  LogOut,
  Camera,
} from 'lucide-react-native';

const profileStats = [
  { label: 'Trips', value: '12', icon: MapPin },
  { label: 'Reviews', value: '47', icon: Star },
  { label: 'Favorites', value: '23', icon: Heart },
  { label: 'Points', value: '1.2K', icon: Award },
];

const menuItems = [
  {
    section: 'Account',
    items: [
      { icon: User, title: 'Personal Information', subtitle: 'Update your details' },
      { icon: Bell, title: 'Notifications', subtitle: 'Manage your alerts' },
      { icon: Settings, title: 'Preferences', subtitle: 'App settings' },
    ],
  },
  {
    section: 'Activity',
    items: [
      { icon: MapPin, title: 'Trip History', subtitle: 'View past journeys' },
      { icon: Heart, title: 'Saved Places', subtitle: 'Your favorite spots' },
      { icon: Star, title: 'Reviews', subtitle: 'Your ratings & feedback' },
    ],
  },
];

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ 
                uri: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400' 
              }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editAvatarButton}>
              <Camera size={16} color="white" />
            </TouchableOpacity>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>Sarah Johnson</Text>
            <Text style={styles.userEmail}>sarah.johnson@email.com</Text>
            <View style={styles.membershipBadge}>
              <Star size={12} color="#FFD700" fill="#FFD700" />
              <Text style={styles.membershipText}>Premium Explorer</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.settingsButton}>
          <Settings size={24} color="#8E8E93" />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Your Journey Stats</Text>
        <View style={styles.statsGrid}>
          {profileStats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={styles.statIcon}>
                <stat.icon size={20} color="#007AFF" />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Recent Achievement */}
      <View style={styles.achievementSection}>
        <View style={styles.achievementCard}>
          <View style={styles.achievementIcon}>
            <Award size={24} color="#FFD700" />
          </View>
          <View style={styles.achievementContent}>
            <Text style={styles.achievementTitle}>New Achievement!</Text>
            <Text style={styles.achievementDescription}>
              You've unlocked "World Explorer" - visited 5+ countries
            </Text>
          </View>
        </View>
      </View>

      {/* Menu Items */}
      {menuItems.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>{section.section}</Text>
          {section.items.map((item, itemIndex) => (
            <TouchableOpacity key={itemIndex} style={styles.menuItem} activeOpacity={0.7}>
              <View style={styles.menuItemLeft}>
                <View style={styles.menuItemIcon}>
                  <item.icon size={20} color="#8E8E93" />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                  <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              <ChevronRight size={20} color="#C7C7CC" />
            </TouchableOpacity>
          ))}
        </View>
      ))}

      {/* Premium Upgrade */}
      <View style={styles.premiumSection}>
        <View style={styles.premiumCard}>
          <View style={styles.premiumHeader}>
            <Star size={24} color="#FFD700" />
            <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
          </View>
          <Text style={styles.premiumDescription}>
            Unlock exclusive destinations, priority booking, and personalized recommendations.
          </Text>
          <TouchableOpacity style={styles.premiumButton}>
            <Text style={styles.premiumButtonText}>Upgrade Now</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Sign Out */}
      <TouchableOpacity style={styles.signOutButton} activeOpacity={0.7}>
        <LogOut size={20} color="#FF3B30" />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>TravelApp v1.0.0</Text>
        <Text style={styles.footerSubtext}>Made with ❤️ for travelers</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    backgroundColor: '#007AFF',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    marginBottom: 8,
  },
  membershipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 4,
  },
  membershipText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FF9500',
  },
  settingsButton: {
    width: 44,
    height: 44,
    backgroundColor: '#F2F2F7',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#ffffff',
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
  },
  achievementSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#ffffff',
    marginTop: 12,
  },
  achievementCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF9E6',
    borderRadius: 16,
    padding: 16,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#FFE5B4',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    lineHeight: 20,
  },
  menuSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#ffffff',
    marginTop: 12,
  },
  menuSectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#8E8E93',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
  },
  premiumSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#ffffff',
    marginTop: 12,
  },
  premiumCard: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    padding: 20,
  },
  premiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  premiumTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  premiumDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
    marginBottom: 16,
  },
  premiumButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  premiumButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#007AFF',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    gap: 8,
  },
  signOutText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FF3B30',
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#8E8E93',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#C7C7CC',
  },
});