import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DealsScreen from '../screens/main/DealsScreen';
import CreateDealScreen from '../screens/deals/CreateDealScreen';

export type DealsStackParamList = {
  DealsList: undefined;
  CreateDeal: undefined;
  EditDeal: { deal: import('../types/deal').Deal };
};

const Stack = createNativeStackNavigator<DealsStackParamList>();

export default function DealsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="DealsList" component={DealsScreen} options={{ title: 'Deals' }} />
      <Stack.Screen name="CreateDeal" component={CreateDealScreen} options={{ title: 'Create Deal' }} />
      <Stack.Screen name="EditDeal" getComponent={() => require('../screens/deals/EditDealScreen').default} options={{ title: 'Edit Deal' }} />
    </Stack.Navigator>
  );
}




