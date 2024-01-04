import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { changePassword, changeEmail, changeProfession, changePhone } from '../api/accountApi';

export default function ProfileScreen({ navigation }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [profession, setProfession] = useState('');
  const [phone, setPhone] = useState('');

  const handleChangePassword = async () => {
    try {
      if (newPassword !== confirmPassword) {
        Alert.alert('Error', 'New passwords do not match.');
        return;
      }

      // Further password validation logic if necessary

      const result = await changePassword(currentPassword, newPassword);

      if (result.success) {
        Alert.alert('Success', result.message);
        navigation.navigate('Login');
      } else {
        // Handle error cases
        if (result.message === 'Authentication failed') {
          // Handle authentication failure, e.g., invalid session
          Alert.alert('Error', 'Authentication failed. Please log in again.');
          // You might want to navigate to the login screen here or take appropriate action
        } else {
          // Handle other error cases
          Alert.alert('Error', result.message);
        }
      }
    } catch (error) {
      console.error('Error while changing password', error);
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  const handleChangeEmail = async () => {
    try {
      const result = await changeEmail(email);

      if (result.success) {
        Alert.alert('Success', result.message);
        // You can update the user's email in your state or context here
      } else {
        // Handle error cases
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Error while changing email', error);
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  const handleChangeProfession = async () => {
    try {
      const result = await changeProfession(profession);

      if (result.success) {
        Alert.alert('Success', result.message);
        // You can update the user's profession in your state or context here
      } else {
        // Handle error cases
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Error while changing profession', error);
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  const handleChangePhone = async () => {
    try {
      const result = await changePhone(phone);

      if (result.success) {
        Alert.alert('Success', result.message);
        // You can update the user's phone number in your state or context here
      } else {
        // Handle error cases
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Error while changing phone number', error);
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Profile Settings</Text>

      {/* Password Section */}
      <View style={styles.section}>
        <TextInput style={styles.input} value={currentPassword} onChangeText={setCurrentPassword} placeholder="Current Password" secureTextEntry={true} />
        <TextInput style={styles.input} value={newPassword} onChangeText={setNewPassword} placeholder="New Password" secureTextEntry={true} />
        <TextInput style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Confirm New Password" secureTextEntry={true} />
        <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity>
      </View>

      {/* Email Section */}
      <View style={styles.section}>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="New Email" />
        <TouchableOpacity style={styles.button} onPress={handleChangeEmail}>
          <Text style={styles.buttonText}>Change Email</Text>
        </TouchableOpacity>
      </View>

      {/* Profession Section */}
      <View style={styles.section}>
        <TextInput style={styles.input} value={profession} onChangeText={setProfession} placeholder="New Profession" />
        <TouchableOpacity style={styles.button} onPress={handleChangeProfession}>
          <Text style={styles.buttonText}>Change Profession</Text>
        </TouchableOpacity>
      </View>

      {/* Phone Section */}
      <View style={styles.section}>
        <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="New Phone Number" keyboardType="phone-pad" />
        <TouchableOpacity style={styles.button} onPress={handleChangePhone}>
          <Text style={styles.buttonText}>Change Phone Number</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  section: {
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
