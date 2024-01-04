import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Modal,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  Alert,
  TextInput, // Import TextInput for priority input
} from 'react-native';
import { fetchEmails, deleteEmail, fetchEmailsNoRefresh, changeEmailPriority } from '../api/emailApi'; // Ensure this includes the deleteEmail function
import { useNavigation } from '@react-navigation/native'; // Import the necessary navigation hook

const EmailListScreen = () => {
  const [emails, setEmails] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [newPriority, setNewPriority] = useState(''); // New state for new priority (as a string)
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await fetchEmailsNoRefresh();
      setEmails(data);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch emails');
    }
  };

  const refreshEmails = async () => {
    setRefreshing(true);
    try {
      const data = await fetchEmails();
      setEmails(data);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to refresh emails');
    } finally {
      setRefreshing(false);
    }
  };

  const openModal = (email) => {
    setSelectedEmail(email);
    setNewPriority(email.IsPriority.toString()); // Set new priority when opening the modal
    setModalVisible(true);
  };

  const handleDeleteEmail = async (emailId) => {
    try {
      await deleteEmail(emailId);
      setEmails(emails.filter((email) => email.EmailID !== emailId));
      setModalVisible(false);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to delete email');
    }
  };

  const { navigate } = useNavigation();

  // Function to navigate to the Priority Email screen
  const navigateToPriorityEmail = () => {
    // You should replace 'PriorityEmailScreen' with the actual name of your Priority Email screen component
    navigate('priorityEmail');
  };

  const priorityToColor = (priority) => {
    // Base color: blue
    const baseColor = 240; // Hue of blue in HSL
    let lightness;

    if (priority === 0) {
      lightness = 100; // Very light (Not important)
    } else if (priority <= 3) {
      lightness = 93; // Lighter blue (Little important)
    } else if (priority <= 6) {
      lightness = 87; // Moderate blue (Moderately important)
    } else if (priority <= 9) {
      lightness = 80; // Darker blue (Important)
    } else {
      lightness = 70; // Very dark (Super important)
    }

    return `hsl(${baseColor}, 100%, ${lightness}%)`;
  };

  const handleChangePriority = async () => {
    if (selectedEmail) {
      const parsedPriority = parseInt(newPriority);
      if (isNaN(parsedPriority) || parsedPriority < 0 || parsedPriority > 10) {
        Alert.alert('Error', 'Please enter a valid priority between 0 and 10.');
      } else {
        try {
          const response = await changeEmailPriority(selectedEmail.EmailID, parsedPriority);
          if (response.success) {
            setEmails(emails.map((email) =>
              email.EmailID === selectedEmail.EmailID
                ? { ...email, IsPriority: parsedPriority }
                : email
            ));
            Alert.alert('Success', 'Email priority updated successfully');
            setModalVisible(false);
          } else {
            Alert.alert('Error', response.message);
          }
        } catch (error) {
          console.error(error);
          Alert.alert('Error', 'Failed to change email priority');
        }
      }
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => openModal(item)}>
      <View style={[styles.itemContainer, { backgroundColor: priorityToColor(item.IsPriority) }]}>
        <Text style={styles.title}>{item.Subject}</Text>
        <Text>From: {item.Sender}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderModalContent = () => (
    <View style={styles.modalView}>
      <ScrollView>
        <Text>{selectedEmail?.Body}</Text>
      </ScrollView>
      <TextInput
        style={styles.priorityInput}
        onChangeText={(text) => setNewPriority(text)}
        value={newPriority}
        keyboardType="numeric"
        placeholder="Enter new priority (0-10)"
      />
      <TouchableOpacity
        style={styles.changePriorityButton} // New button style
        onPress={handleChangePriority} // Call the function to change priority
      >
        <Text style={styles.changePriorityButtonText}>Change Priority</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteEmail(selectedEmail?.EmailID)}
      >
        <Text style={styles.deleteButtonText}>Delete Email</Text>
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
      {/* Priority Button */}
      <TouchableOpacity
        style={styles.priorityButton}
        onPress={navigateToPriorityEmail}
      >
        <Text style={styles.priorityButtonText}>Priority</Text>
      </TouchableOpacity>

      {/* Emails List */}
      <FlatList
        data={emails}
        keyExtractor={(item) => item.EmailID.toString()}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refreshEmails} />
        }
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          {selectedEmail && renderModalContent()}
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
  deleteButton: {
    marginTop: 20,
    backgroundColor: 'red',
    padding: 10,
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
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // Priority Button styles
  priorityButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'blue', // Customize the button's style
    padding: 10,
    borderRadius: 5,
    zIndex: 1, // Ensure the button is displayed above other elements
  },
  priorityButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // Change Priority Button styles
  changePriorityButton: {
    marginTop: 20,
    backgroundColor: 'green', // Customize the button's style
    padding: 10,
    borderRadius: 5,
  },
  changePriorityButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // Priority Input styles
  priorityInput: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 10,
  },
});

export default EmailListScreen;
