import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const JumanLogoutScreen = ({ navigation }) => {
  const handleLogout = () => {
    // I’m gonna try implementing my logic here later
    console.log('Logout successful');
    // For demonstration purposes, let's navigate back to the login screen
    navigation.navigate('jumanlogin');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Logout</Text>
      <Text style={styles.message}>Are you sure you want to logout?</Text>
      <Button title="Logout" onPress={handleLogout} />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A1A', // Dark blue background color
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    color: '#3498DB', // Robotic blue color
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    color: '#FFFFFF', // White text color
  },
});

export default JumanLogoutScreen;