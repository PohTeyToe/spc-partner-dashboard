import React, { useState } from 'react';
import { View, Text, TextInput, Switch, Button, Alert, StyleSheet, ScrollView } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { updateDeal, deleteDeal } from '../../services/deals';
import { toastSuccess, toastError } from '../../utils/toast';
import { Deal } from '../../types/deal';

type RootParamList = {
  EditDeal: { deal: Deal };
};

export default function EditDealScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RootParamList, 'EditDeal'>>();
  const original = route.params?.deal;

  const [title, setTitle] = useState(original?.title ?? '');
  const [active, setActive] = useState<boolean>(!!original?.active);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!original) {
    return (
      <View style={styles.center}>
        <Text>Missing deal data.</Text>
      </View>
    );
  }

  const onSave = async () => {
    try {
      setSaving(true);
      await updateDeal(original.id, { title, active });
      toastSuccess('Deal updated');
      navigation.navigate('Deals', { refreshAt: Date.now() });
    } catch (e: any) {
      const msg = e?.response?.data?.msg || e?.message || 'Unknown error';
      toastError(msg);
      Alert.alert('Update failed', msg);
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    Alert.alert('Delete Deal', 'Are you sure you want to delete this deal?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            setDeleting(true);
            await deleteDeal(original.id);
            toastSuccess('Deal deleted');
            navigation.navigate('Deals', { refreshAt: Date.now() });
          } catch (e: any) {
            const msg = e?.response?.data?.msg || e?.message || 'Unknown error';
            toastError(msg);
            Alert.alert('Delete failed', msg);
          } finally {
            setDeleting(false);
          }
        },
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Title</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Deal title"
        style={styles.input}
      />

      <View style={styles.row}>
        <Text style={styles.label}>Active</Text>
        <Switch value={active} onValueChange={setActive} />
      </View>

      <View style={styles.spacer} />

      <Button title={saving ? 'Saving…' : 'Save'} onPress={onSave} disabled={saving || !title.trim()} />
      <View style={{ height: 12 }} />
      <Button title={deleting ? 'Deleting…' : 'Delete'} onPress={onDelete} color="#c00" disabled={deleting} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  label: { fontSize: 16, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 },
  spacer: { height: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

