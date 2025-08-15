import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, RefreshControl, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { colors } from '../../theme/colors';
import DealCard from '../../components/cards/DealCard';
import { useInfiniteDeals } from '../../hooks/useDeals';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';
import { deleteDeal } from '../../services/deals';
import { toastError, toastSuccess } from '../../utils/toast';

function useDebounced<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value);
  React.useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export default function DealsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [search, setSearch] = useState('');
  const debounced = useDebounced(search, 450);
  const [activeOnly, setActiveOnly] = useState<boolean | undefined>(undefined);

  const { data, isLoading, isError, refetch, hasNextPage, fetchNextPage, isFetchingNextPage, isRefetching } = useInfiniteDeals({ q: debounced || undefined, active: activeOnly });

  const items = useMemo(() => (data ? data.pages.flatMap((p) => p.items) : []), [data]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  React.useEffect(() => {
    if ((route.params as any)?.refreshAt) {
      refetch();
    }
  }, [route.params?.refreshAt, refetch]);

  const onEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Deals</Text>
        <TouchableOpacity style={styles.newButton} onPress={() => navigation.navigate('CreateDeal')}>
          <Text style={styles.newButtonText}>+ New</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.search}
        placeholder="Search deals..."
        value={search}
        onChangeText={setSearch}
        autoCapitalize="none"
      />
      <View style={styles.filterRow}>
        <TouchableOpacity
          onPress={() => setActiveOnly((prev) => (prev === true ? undefined : true))}
          style={[styles.filterChip, activeOnly ? styles.filterChipActive : undefined]}
        >
          <Text style={styles.filterChipText}>{activeOnly ? 'Active Only ✓' : 'Active Only'}</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.center}> 
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : isError ? (
        <View style={styles.center}>
          <Text style={{ color: colors.danger, marginBottom: 8 }}>Failed to load deals.</Text>
          <TouchableOpacity onPress={() => refetch()} style={styles.retryBtn}><Text style={styles.retryText}>Retry</Text></TouchableOpacity>
        </View>
      ) : items.length === 0 ? (
        <View style={styles.center}><Text style={{ color: colors.textSecondary }}>No deals found.</Text></View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <Swipeable
              renderRightActions={() => (
                <TouchableOpacity
                  style={{ backgroundColor: colors.danger, justifyContent: 'center', paddingHorizontal: 16, marginVertical: 6, borderRadius: 6 }}
                  onPress={() => {
                    Alert.alert('Delete deal?', 'This cannot be undone.', [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Delete', style: 'destructive', onPress: async () => {
                          try {
                            await deleteDeal(item.id);
                            toastSuccess('Deal deleted');
                            refetch();
                          } catch (e: any) {
                            toastError(e?.response?.data?.message || e?.message || 'Failed to delete');
                            refetch();
                          }
                        }
                      }
                    ]);
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: '700' }}>Delete</Text>
                </TouchableOpacity>
              )}
            >
              <TouchableOpacity onPress={() => navigation.navigate('EditDeal', { deal: item })}>
                <DealCard title={item.title} subtitle={item.description} />
              </TouchableOpacity>
            </Swipeable>
          )}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
          ListFooterComponent={isFetchingNextPage ? <ActivityIndicator color={colors.primary} /> : null}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text
  },
  search: {
    borderWidth: 1,
    borderColor: colors.border,
    padding: 10,
    borderRadius: 8,
    marginBottom: 8
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8
  },
  filterChip: {
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16
  },
  filterChipActive: {
    backgroundColor: colors.border
  },
  filterChipText: {
    color: colors.text
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  retryBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.primary
  },
  retryText: {
    color: '#fff',
    fontWeight: '600'
  },
  newButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.primary
  },
  newButtonText: {
    color: '#fff',
    fontWeight: '600'
  }
});

