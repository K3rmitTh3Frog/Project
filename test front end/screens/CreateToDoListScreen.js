import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text } from 'react-native';
import { createTodoList } from '../api/toDoListApi'; // Ensure correct import path
import DateTimePicker from '@react-native-community/datetimepicker'; // Ensure this package is installed

const CreateToDoListScreen = ({ navigation }) => {
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('');
    const [dueDate, setDueDate] = useState(new Date());
    const [category, setCategory] = useState('');
    const [notes, setNotes] = useState('');
    const [timeEstimate, setTimeEstimate] = useState('');
    const [reminders, setReminders] = useState(new Date());
    const [status, setStatus] = useState('Not Started');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isReminderPickerVisible, setReminderPickerVisibility] = useState(false);

    const handleCreateToDoList = async () => {
        try {
          console.log('description:', description);
          console.log('priority:', priority);
          console.log('dueDate:', dueDate);
          console.log('category:', category);
          console.log('notes:', notes);
          console.log('timeEstimate:', timeEstimate);
          console.log('reminders:', reminders);
          console.log('status:', status);
      
          const newTodoListData = {
            Description: description,
            Priority: parseInt(priority, 10),
            Due: dueDate.toISOString(),
            Category: category,
            Notes: notes,
            Time_Estimate: timeEstimate,
            Reminders: reminders.toISOString(),
            Status: status,
          };
      
          console.log('newTodoListData:', newTodoListData);
      
          const response = await createTodoList(newTodoListData);
      
          if (response.success) {
            Alert.alert('Success', 'To-Do List created successfully');
            navigation.goBack();
          } else {
            Alert.alert('Error', response.message || 'Failed to create To-Do List');
          }
        } catch (error) {
          console.error(error);
          Alert.alert('Error', 'Failed to create To-Do List');
        }
      };
      

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const showReminderPicker = () => {
        setReminderPickerVisibility(true);
    };

    const onDueDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || dueDate;
        setDueDate(currentDate);
        setDatePickerVisibility(false);
    };

    const onReminderChange = (event, selectedDate) => {
        const currentDate = selectedDate || reminders;
        setReminders(currentDate);
        setReminderPickerVisibility(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Description</Text>
            <TextInput
                style={styles.input}
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
            />

            <Text style={styles.label}>Priority</Text>
            <TextInput
                style={styles.input}
                placeholder="Priority"
                value={priority}
                onChangeText={setPriority}
                keyboardType="numeric"
            />

            <Text style={styles.label}>Due Date</Text>
            <Button title="Select Due Date" onPress={showDatePicker} />
            {isDatePickerVisible && (
                <DateTimePicker
                    value={dueDate}
                    mode="date"
                    display="default"
                    onChange={onDueDateChange}
                />
            )}

            <Text style={styles.label}>Category</Text>
            <TextInput
                style={styles.input}
                placeholder="Category"
                value={category}
                onChangeText={setCategory}
            />

            <Text style={styles.label}>Notes</Text>
            <TextInput
                style={styles.input}
                placeholder="Notes"
                value={notes}
                onChangeText={setNotes}
            />

            <Text style={styles.label}>Time Estimate</Text>
            <TextInput
                style={styles.input}
                placeholder="Time Estimate (HH:MM:SS)"
                value={timeEstimate}
                onChangeText={setTimeEstimate}
            />

            <Text style={styles.label}>Reminders</Text>
            <Button title="Set Reminder" onPress={showReminderPicker} />
            {isReminderPickerVisible && (
                <DateTimePicker
                    value={reminders}
                    mode="datetime"
                    display="default"
                    onChange={onReminderChange}
                />
            )}

            {/* Implement the status picker here as previously shown */}

            <Button
                title="Create To-Do List"
                onPress={handleCreateToDoList}
            />
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    // Add more styles as needed
});

export default CreateToDoListScreen;
