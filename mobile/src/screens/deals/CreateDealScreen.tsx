import React from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../../components/common/Button';
import { colors } from '../../theme/colors';
import { createDeal } from '../../services/deals';
import { toastSuccess, toastError } from '../../utils/toast';
import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

export default function CreateDealScreen() {
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', description: '' }
  });

  const onSubmit = async (values: FormValues) => {
    try {
      if (!values.title.trim()) {
        toastError('Title is required');
        return;
      }
      await createDeal(values);
      await queryClient.invalidateQueries({ queryKey: ['deals'] });
      toastSuccess('Deal created');
      navigation.navigate('Deals', { refreshAt: Date.now() });
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || 'Failed to create deal';
      toastError(msg);
      Alert.alert('Error', msg);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Deal</Text>
      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Title"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.title && <Text style={styles.error}>{errors.title.message}</Text>}

      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
            placeholder="Description"
            onBlur={onBlur}
            onChangeText={onChange}
            multiline
            numberOfLines={4}
            value={value}
          />
        )}
      />
      {errors.description && <Text style={styles.error}>{errors.description.message}</Text>}

      <Button title={isSubmitting ? 'Creating...' : 'Create'} onPress={handleSubmit(onSubmit)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8
  },
  error: {
    color: colors.danger,
    marginBottom: 8
  }
});




