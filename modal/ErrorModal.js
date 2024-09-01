import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';

const ErrorModal = ({ visible, message, onClose }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Pressable style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeText}>×</Text>
                    </Pressable>
                    <Text style={styles.modalText}>{message}</Text>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    modalView: {
        width: '90%',
        backgroundColor: 'rgba(255, 0, 0, 0.8)', // Полупрозрачный красный фон
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        marginBottom: 20, // Отступ снизу
    },
    closeButton: {
        position: 'absolute',
        right: 10,
        top: 10,
    },
    closeText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        color: 'white',
    },
});

export default ErrorModal;
