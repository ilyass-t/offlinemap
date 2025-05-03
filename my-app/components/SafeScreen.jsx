import React from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import COLORS from '../constants/colors';

export default function SafeScreen({ children }) {
  const insets = useSafeAreaInsets(); // Get safe area insets

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background, // Use backgroundColor instead of ImageBackground
  },
});
