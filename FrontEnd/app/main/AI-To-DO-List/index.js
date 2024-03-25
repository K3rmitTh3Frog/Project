import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, StatusBar, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import BottomNavBar from '../../../components/layout/BottomNavBar';

const initialTasks = [
  {
    id: '1',
    title: 'Task 1',
    description: 'Pay xfees soon',
  },
  {
    id: '2',
    title: 'Task 2',
    description: 'Submit report by Friday',
  },
  {
    id: '3',
    title: 'Task 3',
    description: 'Call client for follow-up',
  },
];

const App = () => {
  const [tasks, setTasks] = useState(initialTasks);

  const handleDeleteTask = (id) => {
    // Filter out the task with the given id
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    // Trigger alert
    Alert.alert('Deleted', 'Task deleted successfully');
  };

  const handleAddTask = () => {
    // Add your logic to add a new task
    // For now, let's just trigger the alert
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    Alert.alert('Added', 'Task added successfully');
  };

  const renderItem = ({ item }) => (
    <View style={styles.taskItem}>
      <View style={styles.taskDetails}>
        <Text style={styles.taskTitle}>{item.title}</Text>
        <Text style={styles.taskDescription}>{item.description}</Text>
      </View>
      <View style={styles.taskActions}>
        <TouchableOpacity onPress={() => handleDeleteTask(item.id)}>
          <Ionicons name="trash-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleAddTask}>
          <Ionicons name="add-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.headerTitle}>AI to-do List</Text>
      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      <BottomNavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001C30',
  },
  headerTitle: {
    fontSize: 28,
    color: '#FFFFFF',
    textAlign: 'center',
    padding: 40,
    marginTop: 50
  },
  taskItem: {
    backgroundColor: '#21394B',
    borderRadius: 35,
    padding: 30,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskDetails: {
    flex: 1,
  },
  taskActions: {
    flexDirection: 'row',
  },
  taskTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  taskDescription: {
    color: '#858895',
    fontSize: 15,
  },
});

export default App;
