import React, { useEffect } from 'react';
import Home from './screens/Home'
import WillWatch from './screens/WillWatch';
import Settings from './screens/Settings'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function Index(){

    const Tab = createBottomTabNavigator();

    return (
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen
                    name="Просмотренные"
                    component={Home} 
                    options={{
                        tabBarLabel: 'Просмотренные',
                        tabBarIcon: ({ color, size }) => (
                            <FontAwesome name="home" size={24} color="black" />  
                        )       
                    }}
                />
                <Tab.Screen
                    name="Не просмотренные"
                    component={WillWatch} 
                    options={{
                        tabBarLabel: 'Не просмотренные',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="playlist-edit" size={28} color="black" /> 
                        )       
                    }}
                />
                <Tab.Screen 
                    name="Настройки" 
                    component={Settings}
                    options={{
                        tabBarLabel: 'Настройки',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="settings" size={22} color="black" />  
                        )      
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}