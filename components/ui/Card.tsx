import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
  margin?: number;
  backgroundColor?: string;
  shadow?: boolean;
  borderRadius?: number;
}

export function Card({
  children,
  style,
  padding = 16,
  margin = 0,
  backgroundColor = '#ffffff',
  shadow = true,
  borderRadius = 12,
}: CardProps) {
  return (
    <View
      style={[
        styles.card,
        {
          padding,
          margin,
          backgroundColor,
          borderRadius,
          ...(shadow && styles.shadow),
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 0,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
});