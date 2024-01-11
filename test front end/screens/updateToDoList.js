import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';

const TaskListScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editedTask, setEditedTask] = useState({});

  useEffect(() => {
    // Simulate fetching tasks from the backend (Replace this with your actual API calls)
    const simulatedTasks = [
      { ToDoID: 1, Title: 'Task 1', Priority: 5, Description: 'Description 1', Category: 'Category 1', Notes: 'Notes 1', Time_Estimate: '2h', Reminders: '2022-01-01', Status: 'Not Started' },
      { ToDoID: 2, Title: 'Task 2', Priority: 3, Description: 'Description 2', Category: 'Category 2', Notes: 'Notes 2', Time_Estimate: '1h', Reminders: '2022-01-02', Status: 'In Progress' },
      { ToDoID: 3, Title: 'Task 3', Priority: 7, Description: 'Description 3', Category: 'Category 3', Notes: 'Notes 3', Time_Estimate: '3h', Reminders: '2022-01-03', Status: 'Complete' },
    ];
    setTasks(simulatedTasks);
  }, []);

  const openModal = (task) => {
    setSelectedTask(task);
    setEditedTask({ ...task });
    setModalVisible(true);
  };

  const handleDeleteTask = (taskId) => {
    // Simulate task deletion (Replace this with your actual API calls)
    const updatedTasks = tasks.filter((task) => task.ToDoID !== taskId);
    setTasks(updatedTasks);
    setModalVisible(false);
  };

  const handleChangeTask = () => {
    // Simulate updating the task (Replace this with your actual API calls)
    const updatedTasks = tasks.map((task) =>
      task.ToDoID === selectedTask.ToDoID ? editedTask : task
    );
    setTasks(updatedTasks);
    setModalVisible(false);
  };

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
        onChangeText={(text) => setEditedTask({ ...editedTask, Description: text })}
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
        onChangeText={(text) => setEditedTask({ ...editedTask, Time_Estimate: text })}
        value={editedTask.Time_Estimate}
        placeholder="Time Estimate"
      />
      <TextInput
        style={styles.input}
        onChangeText={(text) => setEditedTask({ ...editedTask, Reminders: text })}
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
        onChangeText={(text) => setEditedTask({ ...editedTask, Priority: text })} // Add this line for Priority
        value={editedTask.Priority.toString()} // Convert Priority to string
        placeholder="Priority" // Add a placeholder for Priority
      />
      <TouchableOpacity
        style={styles.changeTaskButton}
        onPress={handleChangeTask}
      >
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
  

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => openModal(item)}>
      <View style={styles.itemContainer}>
        <Text style={styles.title}>{item.Title}</Text>
        <Text>Priority: {item.Priority}</Text>
        <Text>Description: {item.Description}</Text>
        <Text>Category: {item.Category}</Text>
        <Text>Notes: {item.Notes}</Text>
        <Text>Time Estimate: {item.Time_Estimate}</Text>
        <Text>Reminders: {item.Reminders}</Text>
        <Text>Status: {item.Status}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.ToDoID.toString()}
        renderItem={renderItem}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          {selectedTask && renderModalContent()}
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
      padding: 20, // Increase padding to make the item bigger
      marginVertical: 12, // Increase margin to add more space between items
      borderRadius: 5,
      backgroundColor: 'white', // Optional: Add background color
      borderWidth: 1, // Optional: Add border for separation
      borderColor: '#ddd', // Optional: Border color
    },
    title: {
      fontWeight: 'bold',
      fontSize: 18, // Increase font size for the title
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
        // Increase the width and height of the modal content here
        width: '80%', // You can adjust the width as needed
        height: '80%', // You can adjust the height as needed
        // Add scrolling if the content overflows
        overflow: 'scroll', // Add this to allow scrolling within the modal
        // Add elevation for Android to show a shadow
        elevation: 5,
      },
    deleteButton: {
      marginTop: 20,
      backgroundColor: 'red',
      padding: 12, // Increase padding for the buttons
      borderRadius: 5,
    },
    deleteButtonText: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    closeButton: {
      marginTop: 20,
      backgroundColor: '#f9f9f9',
      padding: 12, // Increase padding for the buttons
      borderRadius: 5,
    },
    closeButtonText: {
      fontWeight: 'bold',
      textAlign: 'center',
    },
    input: {
      height: 40,
      width: '100%',
      borderColor: 'gray',
      borderWidth: 1,
      marginTop: 10,
      marginBottom: 10,
      paddingLeft: 10,
    },
    changeTaskButton: {
      marginTop: 20,
      backgroundColor: 'green',
      padding: 12, // Increase padding for the buttons
      borderRadius: 5,
    },
    changeTaskButtonText: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });
  
export default TaskListScreen;
