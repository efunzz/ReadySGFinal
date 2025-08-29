import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { colors } from '../constants/theme';

const { width } = Dimensions.get('window');
const cardWidth = (width - 50) / 2; // Exactly 2 cards per row with proper spacing

const EmergencyKitCard = ({ item, isCollected, onCollect }) => {
  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return '#6b7280';
      case 'uncommon': return '#059669'; 
      case 'rare': return '#7c3aed';
      case 'legendary': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getRarityGlow = (rarity) => {
    switch (rarity) {
      case 'common': return '#f3f4f6';
      case 'uncommon': return '#d1fae5'; 
      case 'rare': return '#ede9fe';
      case 'legendary': return '#fef3c7';
      default: return '#f3f4f6';
    }
  };

  const getItemImage = (itemId) => {
    // Static require paths for React Native bundler
    const imageMap = {
      'torchlight': require('../assets/kititems/torchlight.png'),
      'batteries': require('../assets/kititems/batteries.png'),
      'medication': require('../assets/kititems/medication.png'),
      'documents': require('../assets/kititems/documents.png'),
      'whistle': require('../assets/kititems/whistle.png'),
      'firstaid': require('../assets/kititems/firstaid.png'),
      'childcare': require('../assets/kititems/childcare.png'),
      'mask': require('../assets/kititems/mask.png'),
      'contacts': require('../assets/kititems/contacts.png'),
      'cash': require('../assets/kititems/cash.png'),
      'water': require('../assets/kititems/water.png'),
      'clothing': require('../assets/kititems/clothing.png'),
      'emergency_numbers': require('../assets/kititems/emergency_numbers.png')
    };
    return imageMap[itemId] || require('../assets/kititems/default_item.png');
  };

  const rarityColor = getRarityColor(item.rarity);
  const rarityGlow = getRarityGlow(item.rarity);

  return (
    <View style={[
      styles.card,
      { backgroundColor: isCollected ? rarityGlow : '#ffffff' },
      isCollected && styles.collectedCard
    ]}>
      {/* Rarity indicator */}
      <View style={[styles.rarityDot, { backgroundColor: rarityColor }]} />

      {/* Card artwork area */}
      <View style={[
        styles.artworkArea,
        { backgroundColor: isCollected ? '#f0fff4' : '#f8fafc' }
      ]}>
        {isCollected ? (
          <View style={styles.imageContainer}>
            <Image 
              source={getItemImage(item.id)} 
              style={styles.itemImage}
              resizeMode="contain"
            />
          </View>
        ) : (
          <>
            <View style={styles.lockedImageContainer}>
              <Text style={styles.lockedEmoji}>❓</Text>
            </View>
            <View style={styles.lockOverlay}>
              <Text style={styles.lockedText}>LOCKED</Text>
            </View>
          </>
        )}
      </View>

      {/* Card info */}
      <View style={styles.cardInfo}>
        <Text style={[
          styles.itemName,
          { color: isCollected ? colors.text.primary : colors.text.light }
        ]}>
          {item.name}
        </Text>
        
        <Text style={[
          styles.itemDescription,
          { color: isCollected ? colors.text.secondary : colors.text.light }
        ]}>
          {item.description}
        </Text>

        {/* Rarity badge */}
        <View style={[styles.rarityBadge, { backgroundColor: rarityColor }]}>
          <Text style={styles.rarityText}>{item.rarity.toUpperCase()}</Text>
        </View>

        {/* Action button */}
        {!isCollected ? (
          <TouchableOpacity
            style={styles.collectButton}
            onPress={() => onCollect(item.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.collectButtonText}>📸 Take Photo</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.collectedIndicator}>
            <Text style={styles.collectedText}>🏆 COLLECTED!</Text>
          </View>
        )}
      </View>

      {/* Holographic effect for collected items */}
      {isCollected && (
        <View style={styles.holographicEffect} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 3,
    borderColor: '#e2e8f0',
    position: 'relative',
  },
  collectedCard: {
    borderColor: '#10b981',
    transform: [{ scale: 1.02 }],
  },
  rarityDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 12,
    height: 12,
    borderRadius: 6,
    zIndex: 1,
  },
  artworkArea: {
    height: 100,
    borderRadius: 12,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemImage: {
    width: '85%',
    height: '85%',
  },
  imagePlaceholder: {
    width: '90%',
    height: '90%',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
  },
  imagePlaceholderText: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
    fontWeight: '600',
  },
  lockedImageContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemEmoji: {
    fontSize: 40,
  },
  lockedEmoji: {
    fontSize: 40,
    opacity: 0.3,
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockedText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  itemDescription: {
    fontSize: 10,
    marginBottom: 8,
    textAlign: 'center',
    height: 24, // Fixed height to maintain card uniformity
  },
  rarityBadge: {
    alignSelf: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 8,
  },
  rarityText: {
    fontSize: 8,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  collectButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  collectButtonText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  collectedIndicator: {
    backgroundColor: '#10b981',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  collectedText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  holographicEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
    opacity: 0.2,
    backgroundColor: 'transparent',
    // This would be a gradient in actual implementation
    // For now using a subtle overlay
  },
});

export default EmergencyKitCard;