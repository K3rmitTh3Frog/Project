import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { fetchTodoLists,markTodoList,deleteTodoList } from '../api/toDoListApi'; // Ensure this path is correct

const ToDoListScreen = ({ navigation }) => {
    const [toDoLists, setToDoLists] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchTodoLists();
                setToDoLists(data);
            } catch (error) {
                console.error(error);
            }
        };

        loadData();
    }, []);

    const handleMarkFinished = async () => {
        if (selectedItem && selectedItem.ToDoID) {
            try {
                const response = await markTodoList(selectedItem.ToDoID);
                if (response.success) {
                    console.log('To-Do List marked as finished:', response);
                    // Optionally refresh the to-do list or update UI
                } else {
                    console.error('Failed to mark To-Do List:', response.message);
                }
            } catch (error) {
                console.error('Error in marking To-Do List:', error);
            }
        }
        setModalVisible(false);
    };

    
    const handleUpdate = () => {
        // Implementation to update the item
        //navigation.navigate('UpdateToDoList', { item: selectedItem });
        setModalVisible(false);
    };

    const handleDelete = async () => {
        if (selectedItem && selectedItem.ToDoID) {
            try {
                const response = await deleteTodoList(selectedItem.ToDoID);
                if (response.success) {
                    console.log('To-Do List deleted:', response);
                    // Optionally refresh the to-do list or update UI
                    // You might want to fetch the updated list here
                } else {
                    console.error('Failed to delete To-Do List:', response.message);
                }
            } catch (error) {
                console.error('Error in deleting To-Do List:', error);
            }
        }
        setModalVisible(false);
    };
    
    const openModal = (item) => {
        setSelectedItem(item);
        setModalVisible(true);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => openModal(item)}>
            <View style={styles.itemContainer}>
                <Text style={styles.title}>{item.Description}</Text>
                <Text>Due: {item.Due}</Text>
                <Text>Priority: {item.Priority}</Text>
                <Text>Category: {item.Category}</Text>
                <Text>Est. Time: {item.Time_Estimate}</Text>
                <Text>Status: {item.Status}</Text>
                {/* Add other fields as necessary */}
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={toDoLists}
                keyExtractor={item => item.ToDoID.toString()}
                renderItem={renderItem}
            />
            <Button
                title="Add To-Do List"
                onPress={() => navigation.navigate('CreateToDoList')}
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Button title="Mark Finished" onPress={handleMarkFinished} />
                        <Button title="Update" onPress={handleUpdate} />
                        <Button title="Delete" onPress={handleDelete} />
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
    itemContainer: {
        padding: 10,
        marginVertical: 8,
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
    },
    title: {
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
    // Add other styles as necessary
});

export default ToDoListScreen;
