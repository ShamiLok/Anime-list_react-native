import React, { useEffect } from "react"
import { View, Text, TextInput, SafeAreaView, StyleSheet, Switch, Pressable, ToastAndroid } from "react-native";
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setServerAddressRedux, setLoginRedux, setPasswordRedux, setIsWebRedux } from "../store/actions"

export default function Settings(props) {
    
    const [serverAddress, setServerAddress] = React.useState('');
    const [login, setLogin] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [isWeb, setIsWeb] = React.useState(true)

    useEffect( () => {
        fetchStorageData();
    }, []);

    const dispatch = useDispatch();
    
    const getIsWeb = useSelector(state => state.isWeb);
    const getServerAddress = useSelector(state => state.serverAddress);
    const getLogin = useSelector(state => state.login);
    const getPassword = useSelector(state => state.password);

    const fetchStorageData = async () => {
        setServerAddress(getServerAddress ? getServerAddress : '')
        setLogin(getLogin ? getLogin : '')
        setPassword(getPassword ? getPassword : '')
        setIsWeb(getIsWeb ? JSON.parse(getIsWeb) : '')
    }
    
    const toggleSwitch = () => {
      if (isWeb) {
        
      } else {

      }
      setIsWeb(prev => !prev)
    }

    storeData = async (key, value) => {
        await AsyncStorage.setItem(key, value);
    };

    const saveDate = async () => {
        storeData("serverAddress", serverAddress)
        dispatch(setServerAddressRedux(serverAddress));
        storeData("login", login)
        dispatch(setLoginRedux(login));
        storeData("password", password)
        dispatch(setPasswordRedux(password));
        storeData("isWeb", JSON.stringify(isWeb))
        dispatch(setIsWebRedux(JSON.stringify(isWeb)));
        showToast("Новые настройки были сохранены")
    }
 
    const showToast = (message) => {
        ToastAndroid.showWithGravity(
            message,
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
        );
    }

    return (
        <View style={styles.container}>
            <SafeAreaView>
                <View style={{ flexDirection: "row" }}>
                    <Text style={styles.switchText}>Веб сервер</Text>
                    <Switch
                        onValueChange={toggleSwitch}
                        value={isWeb}
                        style={{flex: 1, marginRight: 10}}
                    />
                </View>
                <Text style={styles.text}>Адрес сервера</Text>
                <TextInput
                    style={styles.input}
                    placeholder="http://192.168.31.100:22848/index.php"
                    onChangeText={setServerAddress}
                    value={serverAddress}
                />
                <Text style={styles.text}>Логин</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Логин"
                    onChangeText={setLogin}
                    value={login}
                />
                <Text style={styles.text}>Пароль</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Пароль"
                    onChangeText={setPassword}
                    value={password}
                />
                <Pressable 
                    style={styles.button} 
                    onPress={saveDate}
                >
                    <Text style={styles.btnText}>Сохранить</Text>
                </Pressable>
            </SafeAreaView>
        </View>
      );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22,
    },
    input: {
        height: 40,
        marginHorizontal: 10,
        marginBottom: 5,
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
    },
    text: {
        height: 40,
        marginHorizontal: 10,
        marginTop: 5,
        fontSize: 20,
    },
    switchText: {
        height: 40,
        marginHorizontal: 10,
        marginTop: 5,
        fontSize: 20,
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 32,
        borderRadius: 4,
        // elevation: 3,
        backgroundColor: 'green',
        margin: 10,
    },
    btnText: {
        // fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
  });