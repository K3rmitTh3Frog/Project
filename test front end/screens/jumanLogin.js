import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image } from 'react-native';
import bgImage from '../images/bg.jpg';

const JumanLoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username && password) {
      console.log('Login successful');
    } else {
      console.log('Please enter both your username and password');
    }
  };

  return (
    <View style={styles.container}>
      {/* Saturday logo at the top right */}
      <View style={styles.logoContainer}>
        {/* Use the imported bgImage directly */}
        <Image
          source={bgImage}
          style={styles.logo}
        />
        <Text style={styles.logoText}>Saturday</Text>
      </View>

      <Text style={styles.header}>Login</Text>

      {/* Username */}
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#B0B0B0"
        onChangeText={(text) => setUsername(text)}
        value={username}
      />

      {/* Password */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#B0B0B0"
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
        value={password}
      />

      {/* Login button */}
      <Button title="Login" onPress={handleLogin} />
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
  logoContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 5,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3498DB', // Robotic blue color
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    color: '#3498DB', // Robotic blue color
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: '#3498DB', // Robotic blue border color
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    color: '#FFFFFF', // White text color
  },
});

export default JumanLoginScreen;
