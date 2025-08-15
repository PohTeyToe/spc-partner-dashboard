import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/main/DashboardScreen';
import DealsStack from './DealsStack';
import SettingsScreen from '../screens/main/SettingsScreen';
import CreateDealScreen from '../screens/deals/CreateDealScreen';

export type MainTabsParamList = {
  Dashboard: undefined;
  Deals: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<MainTabsParamList>();

export default function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Deals" component={DealsStack} options={{ headerShown: false }} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

