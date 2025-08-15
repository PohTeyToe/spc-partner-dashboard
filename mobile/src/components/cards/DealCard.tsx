import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

type Props = {
  title: string;
  subtitle?: string;
};

export default function DealCard({ title, subtitle }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text
  },
  subtitle: {
    color: colors.textSecondary,
    marginTop: 4
  }
});

