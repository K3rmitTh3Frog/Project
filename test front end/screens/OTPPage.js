//OTPPage.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { verifyOTP } from '../api/accountApi'; // Adjust the import path as needed

export default function OTPPage({ navigation }) {
  const [otp, setOTP] = useState('');

  const handleOTPSubmit = async () => {
    try {
        const response = await verifyOTP(otp);
        console.log('API Response:', response);
        if (response.message === 'Account created successfully') {
            navigation.navigate('HOME');
        } else {
            // Show an error message if OTP verification failed
            alert('Invalid OTP. Please try again.');
        }
    } catch (error) {
        console.error('Error during OTP verification:', error);
        alert('An error occurred during OTP verification.');
    }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>
      <TextInput
        style={styles.input}
        placeholder="OTP"
        onChangeText={text => setOTP(text)}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleOTPSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // Change the background color as needed
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});
