import React from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent } from 'react-native';
import { colors } from '../../theme/colors';

type ButtonProps = {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  variant?: 'primary' | 'secondary' | 'danger';
};

export default function Button({ title, onPress, variant = 'primary' }: ButtonProps) {
  const styleVariant =
    variant === 'primary' ? styles.primary : variant === 'secondary' ? styles.secondary : styles.danger;

  return (
    <TouchableOpacity onPress={onPress} style={[styles.base, styleVariant]} activeOpacity={0.8}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center'
  },
  primary: {
    backgroundColor: colors.primary
  },
  secondary: {
    backgroundColor: colors.muted
  },
  danger: {
    backgroundColor: colors.danger
  },
  text: {
    color: '#ffffff',
    fontWeight: '600'
  }
});

