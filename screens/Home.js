import React, { Profiler, useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, StatusBar, TextInput, Pressable, ToastAndroid } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { setLoginRedux, setPasswordRedux } from "../store/actions"
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Settings(props) {
    const [list, setList] = React.useState([]);
    const [name, setName] = useState('')
    const [selectedType, setSelectedType] = useState('сезоны');
    const [progress, setProgress] = useState('')
    const [notes, setNotes] = useState('')

    let savedToken = "";

    useEffect(() => {
        getList();
    }, []);
    
    const getList = async () => {
        //получение токена через AsyncStorage, а нужно через redux
        savedToken = await AsyncStorage.getItem("token")
        savedAddress = await AsyncStorage.getItem("serverAddress")
        try {
            const response = await fetch(
                savedAddress + '?type=main', {
                    headers: {
                        'authorization': 'Bearer ' + savedToken,
                    }
                }
            );
            currList = await response.json()
            currList.shift()
            currList.reverse()
            setList(currList);
        } catch (error) {
            console.error(error);
        }
    };

    const addAnime = async () => {
        if (selectedType === "не применимо" && progress != "")
            return
        if ((selectedType === "сезоны" || selectedType === "серии") && progress === "")
            return
        if (isNaN(Number(progress)))
            return
        // console.log("typeof(progress)")
        // console.log(typeof(progress))
        // console.log(typeof(Number(progress)))
        // console.log(Number(progress))
        // console.log("Number(progress)")
        const lastid = getLastId()
        //получение токена через AsyncStorage, а нужно через redux
        savedToken = await AsyncStorage.getItem("token")
        savedAddress = await AsyncStorage.getItem("serverAddress")
        data = {
            method: 'POST',
            headers:  {
                'type': 'addrow',
                'authorization': 'Bearer ' + savedToken,
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
            fetch(savedAddress + '?type=main', data)
            // .then(async response => {
            //     console.log(await response.json())
            //     getList()
            // })
            await getList()
            setName('')
            setProgress('')
            setNotes('')
            showToast("Было добавлено - " + name)
        } catch (error) { 
            console.error(error);
        }
    };

    const getLastId =  () => {
        // console.log("list")
        // console.log(list)
        // console.log(list[0])
        if (list[0] === undefined)
            return -1
        return list[0].ID
    }
    // console.log(list)

    const deleteAnime = async (id, name) => {
        savedToken = await AsyncStorage.getItem("token")
        savedAddress = await AsyncStorage.getItem("serverAddress")
        data = {
            method: 'DELETE',
            headers:  {
                'authorization': 'Bearer ' + savedToken,
            },
        }
        try {  
            fetch(savedAddress + '?type=main&number=' + id, data)
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

    const showToast = (message) => {
        ToastAndroid.showWithGravity(
            message,
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
        );
    }

    return (
        <View style={styles.container}>
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
            <FlatList
                data={list}
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
});