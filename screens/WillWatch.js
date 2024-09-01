import React, { Profiler, useEffect, useState, useRef } from "react";
import { View, Text, FlatList, StyleSheet, StatusBar, TextInput, Pressable, ToastAndroid } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setServerAddressRedux, setLoginRedux, setPasswordRedux, setIsWebRedux, setTokenRedux } from "../store/actions"
import { showToast } from "../utils/Toast";

export default function WillWatch() {
    const [show, setShow] = useState(false)
    const [willWatchList, setWillWathcList] = useState([]);
    const [name, setName] = useState('')
    const [notes, setNotes] = useState('')
    
    const token = useSelector(state => state.token);
    const address = useSelector(state => state.serverAddress);

    useEffect( () => {
        getList();
    }, []);

    const getList = async () => {
        
        try {
            // console.log(address)
            // console.log(token)
            const response = await fetch(
                address + '?type=willwatch', {
                    headers: {
                        'authorization': 'Bearer ' + token,
                    }
                }
            );
            currList = await response.json()
            await currList.shift()
            await currList.reverse()
            setWillWathcList(currList);
        } catch (error) {
            console.error(error);
        }
    };

    const addAnime = async () => {
        const lastid = getLastId()
        data = {
            method: 'POST',
            headers:  {
                'type': 'addrow',
                'authorization': 'Bearer ' + token,
            },
            body: JSON.stringify({
                "ID": Number(lastid) + 1,
                "Name": name,
                "Notes": notes ? notes : "n/d",
            }),
        }
        
        // console.log("address");
        // console.log(address);
        // console.log(token);
        try {  
            await fetch(address + '?type=willwatch', data)
            // .then(async response => {
            //     console.log(await response.json())
            //     getList()
            // })
            await getList()
            setName('')
            setNotes('')
            showToast("Было добавлено - " + name)
        } catch (error) { 
            console.error(error);
        }
    };

    const getLastId =  () => {
        if (willWatchList[0] === undefined)
            return -1
        return willWatchList[0].ID
    }

    const deleteAnime = async (id, name) => {
        data = {
            method: 'DELETE',
            headers:  {
                'authorization': 'Bearer ' + token,
            },
        }
        try {  
            await fetch(address + '?type=willwatch&number=' + id, data)
            // .then(async response => {
            //     console.log(await response.json())
            //     getList()
            // })
            await getList()
            showToast("Было удалено - " + name)
        } catch (error) { 
            console.error(error);
        }
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
            <FlatList
                data={willWatchList}
                renderItem={({item}) => 
                    <View style={styles.item}>
                        <View style={{flex: 1}}>
                            <Text>
                                {item.Name}
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
        </View>
    );
    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingTop: 22,
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