import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  Modal,
  TouchableOpacity,
  RefreshControl,
  TextInput, // Import TextInput
} from 'react-native';

// Import your API functions here
import {
  fetchTodoLists,
  markTodoList,
  deleteTodoList,
  updateTodoList, // Add your updateTodoList function here
} from '../api/toDoListApi'; // Ensure this path is correct

const ToDoListScreen = ({ navigation }) => {
  const [toDoLists, setToDoLists] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [editedTask, setEditedTask] = useState({
    Title: '',
    Description: '',
    Category: '',
    Notes: '',
    Time_Estimate: '',
    Reminders: '',
    Status: '',
    Priority: '', // Add Priority to editedTask
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await fetchTodoLists();
      setToDoLists(data);
    } catch (error) {
      console.error(error);
    }
  };

  const refreshToDoLists = async () => {
    setRefreshing(true);
    try {
      const data = await fetchTodoLists();
      setToDoLists(data);
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleMarkFinished = async () => {
    if (selectedItem && selectedItem.ToDoID) {
      try {
        const response = await markTodoList(selectedItem.ToDoID);
        if (response.success) {
          console.log('To-Do List marked as finished:', response);
          refreshToDoLists();
        } else {
          console.error('Failed to mark To-Do List:', response.message);
        }
      } catch (error) {
        console.error('Error in marking To-Do List:', error);
      }
    }
    setModalVisible(false);
  };

  const handleChangeTask = async () => {
    if (selectedItem && selectedItem.ToDoID) {
      try {
        // Update the task using the API function, passing editedTask
        //const response = await updateTodoList(selectedItem.ToDoID, editedTask);
        if (response.success) {
          console.log('To-Do List updated successfully:', response);
          refreshToDoLists();
        } else {
          console.error('Failed to update To-Do List:', response.message);
        }
      } catch (error) {
        console.error('Error in updating To-Do List:', error);
      }
    }
    setModalVisible(false);
  };

  const handleUpdate = () => {
    if (selectedItem) {
      // Pass selectedItem as a parameter to the TaskDetail screen
      navigation.navigate('TaskDetail', { item: selectedItem });
      setModalVisible(false);
    }
  };

  const handleDelete = async () => {
    if (selectedItem && selectedItem.ToDoID) {
      try {
        await deleteTodoList(selectedItem.ToDoID);
        console.log('To-Do List deleted successfully.');
        refreshToDoLists();
      } catch (error) {
        console.error('Error in deleting To-Do List:', error.message);
      }
    }
    setModalVisible(false);
  };

  const openModal = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
    // Set the editedTask state to the selected item's values
    setEditedTask({
      Title: item.Title,
      Description: item.Description,
      Category: item.Category,
      Notes: item.Notes,
      Time_Estimate: item.Time_Estimate,
      Reminders: item.Reminders,
      Status: item.Status,
      Priority: item.Priority.toString(), // Convert Priority to string
    });
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
      </View>
    </TouchableOpacity>
  );

  const renderModalContent = () => (
    <View style={styles.modalView}>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setEditedTask({ ...editedTask, Title: text })}
        value={editedTask.Title}
        placeholder="Title"
      />
      <TextInput
        style={styles.input}
        onChangeText={(text) =>
          setEditedTask({ ...editedTask, Description: text })
        }
        value={editedTask.Description}
        placeholder="Description"
      />
      <TextInput
        style={styles.input}
        onChangeText={(text) => setEditedTask({ ...editedTask, Category: text })}
        value={editedTask.Category}
        placeholder="Category"
      />
      <TextInput
        style={styles.input}
        onChangeText={(text) => setEditedTask({ ...editedTask, Notes: text })}
        value={editedTask.Notes}
        placeholder="Notes"
      />
      <TextInput
        style={styles.input}
        onChangeText={(text) =>
          setEditedTask({ ...editedTask, Time_Estimate: text })
        }
        value={editedTask.Time_Estimate}
        placeholder="Time Estimate"
      />
      <TextInput
        style={styles.input}
        onChangeText={(text) =>
          setEditedTask({ ...editedTask, Reminders: text })
        }
        value={editedTask.Reminders}
        placeholder="Reminders"
      />
      <TextInput
        style={styles.input}
        onChangeText={(text) => setEditedTask({ ...editedTask, Status: text })}
        value={editedTask.Status}
        placeholder="Status"
      />
      <TextInput
        style={styles.input}
        onChangeText={(text) =>
          setEditedTask({ ...editedTask, Priority: text })
        } // Add this line for Priority
        value={editedTask.Priority.toString()} // Convert Priority to string
        placeholder="Priority" // Add a placeholder for Priority
      />
      <TouchableOpacity style={styles.changeTaskButton} onPress={handleChangeTask}>
        <Text style={styles.changeTaskButtonText}>Change Task</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteTask(selectedTask.ToDoID)}
      >
        <Text style={styles.deleteButtonText}>Delete Task</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => setModalVisible(false)}
      >
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={toDoLists}
        keyExtractor={(item) => item.ToDoID.toString()}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refreshToDoLists} />
        }
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
          {renderModalContent()}
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    width: '100%', // Full width of the container
    textAlign: 'left', // Left-align the text
    // Add any other uniform styling properties as needed
  },
  changeTaskButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  changeTaskButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ToDoListScreen;
