import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Button, StyleSheet, Modal, RefreshControl } from 'react-native';
import { fetchPriorityEmails, addPriorityEmail, deletePriorityEmail } from '../api/emailApi'; // Import API functions

const PriorityEmailScreen = () => {
    const [priorityEmails, setPriorityEmails] = useState([]);
    const [newEmail, setNewEmail] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        loadPriorityEmails();
    }, []);

    const loadPriorityEmails = async () => {
        try {
            const data = await fetchPriorityEmails();
            setPriorityEmails(data);
        } catch (error) {
            console.error('Failed to load priority emails:', error);
        }
    };

    const handleAddPriorityEmail = async () => {
        try {
            await addPriorityEmail(newEmail);
            setNewEmail('');
            loadPriorityEmails();
        } catch (error) {
            console.error('Failed to add priority email:', error);
        }
    };

    const handleDeletePriorityEmail = async (priorityId) => {
        try {
            await deletePriorityEmail(priorityId);
            loadPriorityEmails();
        } catch (error) {
            console.error('Failed to delete priority email:', error);
        }
        setModalVisible(false);
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);

        try {
            const data = await fetchPriorityEmails();
            setPriorityEmails(data);
        } catch (error) {
            console.error('Failed to refresh priority emails:', error);
        } finally {
            setIsRefreshing(false);
        }
    };

    const openModal = (item) => {
        setSelectedItem(item);
        setModalVisible(true);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => openModal(item)}>
            <View style={styles.emailContainer}>
                <Text style={styles.emailText}>{item.EmailAddress}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={priorityEmails}
                keyExtractor={item => item.PriorityID.toString()}
                renderItem={renderItem}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                    />
                }
            />

            <TextInput 
                placeholder="Enter Priority Email"
                value={newEmail}
                onChangeText={setNewEmail}
            />
            <Button title="Add Priority Email" onPress={handleAddPriorityEmail} />

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Button title="Delete" onPress={() => handleDeletePriorityEmail(selectedItem.PriorityID)} />
                        <Button title="Cancel" onPress={() => setModalVisible(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
    },
    emailContainer: {
        padding: 10,
        marginVertical: 8,
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
    },
    emailText: {
        fontWeight: 'bold',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
});

export default PriorityEmailScreen;
