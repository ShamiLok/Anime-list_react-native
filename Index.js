import React, { useEffect } from 'react';
import Home from './screens/Home'
import Settings from './screens/Settings'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { setServerAddressRedux, setLoginRedux, setPasswordRedux, setIsWebRedux, setTokenRedux } from "./store/actions"
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index(){

    const Tab = createBottomTabNavigator();

    const dispatch = useDispatch();

    let login = "";
    let password = "";
    let savedToken = ""

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            login = await AsyncStorage.getItem("login")
            password = await AsyncStorage.getItem("password")
            savedToken = await AsyncStorage.getItem("token")
            dispatch(setServerAddressRedux(await AsyncStorage.getItem("serverAddress") ? await AsyncStorage.getItem("serverAddress") : ''))
            dispatch(setLoginRedux(login ? login : ''))
            dispatch(setPasswordRedux(password ? password : ''))
            dispatch(setIsWebRedux(await AsyncStorage.getItem("isWeb") ? JSON.parse(await AsyncStorage.getItem("isWeb")) : ''))
            dispatch(setTokenRedux(savedToken ? savedToken : ''))
            
            if(!savedToken) {
                newToken = await getToken()
                // console.log(newToken)
                // console.log("newToken")
                // console.log(login)
                // console.log(password)
                dispatch(setTokenRedux(newToken ? newToken.token : ''))
                await AsyncStorage.setItem("token", newToken.token);
            } else {
                const check = await checkToken()
                // console.log("aaaaaaaaaaaaaa")
                // console.log(check)
                // console.log("aaaaaaaaaaaaaaaaa")
                if(check.message === "Unauthorized"){
                    newToken = await getToken()
                    // console.log("+++++++++++++++++++++++++")
                    // console.log(newToken.token)
                    // console.log("+++++++++++++++++++++++++")
                    dispatch(setTokenRedux(newToken ? newToken.token : ''))
                    await AsyncStorage.setItem("token", newToken.token);
                } else {
                    // console.log("////////////////////")
                    // console.log(check.message)
                }
            }
        } catch(err){
            console.error(err)
        }
        
    }

    const getToken = async () => {
        savedAddress = await AsyncStorage.getItem("serverAddress")

        data = {
            method: 'POST',
            headers: {
                'type': 'login',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "username": login,
                "password": password,
            }),
        }
        try {  
            return fetch(savedAddress, data)
            .then(response => {
                return response.json()
            })
        } catch (error) { 
            console.error(error);
        }
    };

    const checkToken = async () => {
        savedAddress = await AsyncStorage.getItem("serverAddress")

        data = {
            method: 'POST',
            headers:  {
                'type': 'tokenCheck',
                'authorization': 'Bearer ' + savedToken,
                'Content-Type': 'application/json',
            } 
        }
        try {  
            return fetch(savedAddress, data)
            .then(async response => {
                return await response.json()
            })
        } catch (error) { 
            console.error(error);
        }
    };

    return (
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen
                    name="Home"
                    component={Home} 
                    options={{
                        tabBarLabel: 'Home',
                        tabBarIcon: ({ color, size }) => (
                            <FontAwesome name="home" size={24} color="black" />  
                        )       
                    }}
                />
                <Tab.Screen 
                    name="Settings" 
                    component={Settings}
                    options={{
                        tabBarLabel: 'Settings',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="settings" size={24} color="black" />  
                        )      
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}