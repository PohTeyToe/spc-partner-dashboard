import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { colors } from '../../theme/colors';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { API_BASE_URL } from '../../config/apiConfig';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

type FormValues = z.infer<typeof schema>;

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [apiMessage, setApiMessage] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: 'demo@merchant.com', password: 'Password123!' }
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await signIn(data.email, data.password);
      Alert.alert('Success', 'You are signed in.');
    } catch (e: any) {
      Alert.alert('Login Failed', e?.message || 'Please try again.');
    }
  };

  const onTestApi = async () => {
    try {
      const res = await api.get<{ status: string }>('/health');
      setApiMessage(JSON.stringify(res.data));
      Alert.alert('Health', JSON.stringify(res.data));
    } catch {
      setApiMessage('Request failed');
      Alert.alert('Health', 'Request failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

      <Button
        title={isSubmitting ? 'Signing In...' : 'Sign In'}
        onPress={handleSubmit(onSubmit)}
      />
      <View style={{ height: 12 }} />
      <Button title="Test API" onPress={onTestApi} variant="secondary" />

      {apiMessage ? <Text style={styles.apiText}>{apiMessage}</Text> : null}
      <Text style={styles.debug}>API: {API_BASE_URL}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
    justifyContent: 'center'
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 24
  },
  input: {
    borderWidth: 1,
    borderColor: colors.muted,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8
  },
  error: {
    color: colors.danger,
    marginBottom: 8
  },
  apiText: {
    marginTop: 16,
    color: colors.textSecondary
  },
  debug: {
    marginTop: 20,
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: 'center'
  }
});

