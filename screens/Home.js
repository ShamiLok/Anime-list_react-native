import React, { Profiler, useEffect, useState, useRef } from "react";
import { View, Text, FlatList, StyleSheet, StatusBar, TextInput, Pressable, ToastAndroid } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setServerAddressRedux, setLoginRedux, setPasswordRedux, setIsWebRedux, setTokenRedux } from "../store/actions"
import { showToast } from "../utils/Toast";
import ErrorModal from "../modal/ErrorModal";

export default function Home() {
    const [show, setShow] = useState(false)
    const [list, setList] = useState([]); //исходный список
    const [filteredList, setFilteredList] = useState([]); // Отфильтрованный список
    const [name, setName] = useState('')
    const [selectedType, setSelectedType] = useState('сезоны');
    const [progress, setProgress] = useState('')
    const [notes, setNotes] = useState('')
    const [search, setSearch] = useState('')

    const [errorVisible, setErrorVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('error');

    const dispatch = useDispatch();

    let login = useRef('');
    let password = useRef('');
    let token = useRef('');
    let address = useRef('');

    useEffect( () => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const savedLogin = await AsyncStorage.getItem("login")
            const savedPassword = await AsyncStorage.getItem("password")
            const savedToken = await AsyncStorage.getItem("token")
            const savedAddress = await AsyncStorage.getItem("serverAddress")
            const savedIsWeb = await AsyncStorage.getItem("isWeb")

            dispatch(setServerAddressRedux(savedAddress ? savedAddress : ''))
            dispatch(setLoginRedux(savedLogin ? savedLogin : ''))
            dispatch(setPasswordRedux(savedPassword ? savedPassword : ''))
            dispatch(setIsWebRedux(savedIsWeb ? JSON.parse(savedIsWeb) : ''))
            dispatch(setTokenRedux(savedToken ? savedToken : ''))
            
            login.current = savedLogin
            password.current = savedPassword
            token.current = savedToken
            address.current = savedAddress

            if(!savedToken) {
                newToken = await getToken()
                dispatch(setTokenRedux(newToken ? newToken.token : ''))
                await AsyncStorage.setItem("token", newToken.token);
            } else {
                const check = await checkToken()
                if(check.message === "Unauthorized"){
                    newToken = await getToken()
                    dispatch(setTokenRedux(newToken ? newToken.token : ''))
                    await AsyncStorage.setItem("token", newToken.token);
                } else {
                    // console.log("////////////////////")
                    // console.log(check.message)
                }
            }
            await getList();
        } catch(error){
            setErrorVisible(true)
            setErrorMessage(error)
            console.error(error)
        }
    }

    const getToken = async () => {
        data = {
            method: 'POST',
            headers: {
                'type': 'login',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "username": login.current,
                "password": password.current,
            }),
        }
        return nRequest(address.current, data)
    };

    const checkToken = async () => {
        data = {
            method: 'POST',
            headers:  {
                'type': 'tokenCheck',
                'authorization': 'Bearer ' + token.current,
                'Content-Type': 'application/json',
            } 
        }

        return nRequest(address.current, data)
    };

    
    const getList = async () => {
        data = {
            headers: {
                'authorization': 'Bearer ' + token.current,
            }
        }

        try {
            const currList = await nRequest(address.current + '?type=main', data) 
            if (currList.length > 0) {
                await currList.shift()
                await currList.reverse()
            }
            setList(currList) // Устанавливаем исходный список
            setFilteredList(currList); // Устанавливаем отфильтрованный список
        } catch (error) {
            setErrorVisible(true)
            setErrorMessage(error)
            console.error(error);
        }
    };

    const addAnime = async () => {
        if (selectedType === "не применимо" && progress != "")
            return
        if ((selectedType === "сезоны" || selectedType === "серии") && progress === "")
            return
        if (isNaN(Number(progress)) || Number(progress) === 0)
            return
        const lastid = getLastId()
        data = {
            method: 'POST',
            headers:  {
                'type': 'addrow',
                'authorization': 'Bearer ' + token.current,
            },
            body: JSON.stringify({
                "ID": Number(lastid) + 1,
                "Name": name,
                "Progress": progress ? progress : "n/d",
                "ProgressType": selectedType,
                "Notes": notes ? notes : "n/d",
            }),
        }
        
        try {
            await nRequest(address.current + '?type=main', data)
            await getList()
            setName('')
            setProgress('')
            setNotes('')
            showToast("Было добавлено - " + name)
        } catch (error) {
            console.error(error)
        }
    };

    const getLastId =  () => {
        if (list[0] === undefined)
            return -1
        return list[0].ID
    }

    const deleteAnime = async (id, name) => {
        data = {
            method: 'DELETE',
            headers:  {
                'authorization': 'Bearer ' + token.current,
            },
        }
        await nRequest(address.current + '?type=main&number=' + id, data)
        await getList()
        showToast("Было удалено - " + name)
    }

    const nRequest = async (address, data) => {
        return await fetch(address, data)
        .then(async response => {
            return await response.json()
        })
        .catch(function (error) {
            setErrorVisible(true)
            setErrorMessage(error)
            console.log(error);
            console.log(`адресс ${address} с заголовками ${JSON.stringify(data)}`);
        })
    }

    const searchHandler = (text) => {
        setSearch(text)
        setFilteredList(list.filter(anime => anime.Name.includes(text)))
    }

    return (
        <View style={styles.container}>
            {show && <View>
                <Text style={styles.text}>Название</Text>
                <TextInput 
                    style={styles.input}
                    placeholder="fate"
                    onChangeText={setName}
                    value={name}
                />
                <Text style={styles.text}>Тип прогресса</Text>
                <View
                style={{
                    // flex: 1,
                    justifyContent: 'center',
                    // alignItems: 'center',
                    // alignSelf: 'stretch',
                    borderWidth: 1,
                    marginHorizontal: 10,
                    borderRadius: 5,
                    maxHeight: 40
                }}>
                    <Picker
                        selectedValue={selectedType}
                        onValueChange={(itemValue, itemIndex) =>
                            setSelectedType(itemValue)
                        }
                        // style={{flex: 1}}
                    >
                        <Picker.Item label="Сезоны" value="сезоны" />
                        <Picker.Item label="Серии" value="серии" />
                        <Picker.Item label="Фильм" value="фильм" />
                        <Picker.Item label="Не применимо" value="не применимо" />
                    </Picker>
                </View>
                <Text style={styles.text}>Просмотрено</Text>
                <TextInput 
                    style={styles.input}
                    placeholder="2"
                    onChangeText={setProgress}
                    value={progress}
                />
                <Text style={styles.text}>Примечания</Text>
                <TextInput 
                    style={styles.input}
                    placeholder="Классное аниме, плюс просмотрен фильм"
                    onChangeText={setNotes}
                    value={notes}
                />
                <Pressable 
                    style={styles.button} 
                    onPress={addAnime}
                >
                    <Text style={styles.btnText}>Сохранить</Text>
                </Pressable>
                <View
                    style={{
                        borderBottomColor: 'black',
                        borderBottomWidth: StyleSheet.hairlineWidth,
                    }}
                />
            </View>}
            <Pressable 
                style={styles.showBtn} 
                onPress={() => setShow(!show)}
            >
                <Text style={styles.btnText}>{show ? "скрыть" : "добавить аниме"}</Text>
            </Pressable>
            <TextInput 
                style={styles.searchInput}
                placeholder="Поиск"
                onChangeText={searchHandler}
                value={search}
            />
            <FlatList
                data={filteredList}
                renderItem={({item}) => 
                    <View style={styles.item}>
                        <View style={{flex: 1}}>
                            <Text>{item.Name}</Text>
                            <Text>
                                {(item.ProgressType === 'не применимо' || item.ProgressType === 'фильм') && item.ProgressType}
                                {(item.ProgressType === 'сезоны' && item.Progress == 1 ) && item.Progress + " сезон"}
                                {(item.ProgressType === 'сезоны' && (item.Progress > 1 && item.Progress < 5)) && item.Progress + " сезона"}
                                {(item.ProgressType === 'сезоны' && (item.Progress > 4)) && item.Progress + " сезонов"}
                                {(item.ProgressType === 'серии' && item.Progress == 1 ) && item.Progress + " серия"}
                                {(item.ProgressType === 'серии' && (item.Progress > 1 && item.Progress < 5)) && item.Progress + " серии"}
                                {(item.ProgressType === 'серии' && (item.Progress > 4)) && item.Progress + " серий"}
                                {item.Notes === "n/d" ? "" : "\n" + item.Notes}
                            </Text>
                        </View>
                        <Pressable 
                            style={{display: "flex", justifyContent: "center"}} 
                            onPress={() => deleteAnime(item.ID, item.Name)}
                        >
                            <Text style={{color: "#000", fontSize: 25, flex: 1}}>х</Text>
                        </Pressable>
                    </View>
                }
            />
            <StatusBar style="auto" />
            <ErrorModal
                visible={errorVisible}
                message={errorMessage.toString()}
                onClose={() => setErrorVisible(false)}
            />
        </View>
    );
    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    item: {
        padding: 10,
        fontSize: 18,
        borderColor: '#000',
        borderWidth: 1,
        margin: 10,
        borderRadius: 10,
        display: "flex",
        flexDirection: "row"
    },
    text: {
        fontSize: 20,
        marginLeft: 10,
    },
    input: {
        height: 40,
        marginHorizontal: 10,
        marginBottom: 5,
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
    },
    searchInput: {
        height: 40,
        marginHorizontal: 10,
        marginBottom: 5,
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginTop: 10,
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
    showBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 5,
        paddingHorizontal: 32,
        backgroundColor: 'grey',
        marginHorizontal: 10,
    }
});