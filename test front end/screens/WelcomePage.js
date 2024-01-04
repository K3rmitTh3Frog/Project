import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, TextInput } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // For icons
import bgImage from '../images/bg.jpg';
import { loginWithGitHub, resetPassword } from '../api/accountApi'; // Import both loginWithGitHub and resetPassword functions

export default function WelcomePage({ navigation }) {
  const [email, setEmail] = useState('');

  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  const handleRegisterPress = () => {
    navigation.navigate('Register');
  };

  const handleGitHubLoginPress = () => {
    loginWithGitHub().then(() => {
      // Handle successful login if needed
    }).catch(error => {
      console.error('GitHub Login Failed:', error);
    });
  };

  const handlePasswordResetPress = () => {
    if (!email) {
      // You can add validation here to ensure email is not empty
      console.error('Please enter your email address.');
      return;
    }

    resetPassword(email)
  .then(response => {
    if (response.success) {
      // Password reset request successful
      window.alert('Password reset request successful: ');
    } else {
      // Password reset request failed
      window.alert('Password reset request failed: ');
    }
  })
  .catch(error => {
    // Handle errors from the resetPassword function
    window.alert('error');
  });

  };

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={bgImage}
        style={{ flex: 1, resizeMode: 'cover', justifyContent: 'center' }}
      >
        {/* ... (Your background and introductory UI) */}
      </ImageBackground>
      <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>Sign In</Text>
        {/* Social icons */}
        {/* ... (Your social login buttons) */}
        
        <TextInput
          style={{ backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 10 }}
          placeholder="Enter your email"
          onChangeText={(text) => setEmail(text)}
          value={email}
        />

        <TouchableOpacity style={{ backgroundColor: 'blue', padding: 15, borderRadius: 10 }} onPress={handlePasswordResetPress}>
          <Text style={{ color: 'white', textAlign: 'center' }}>Forgot Password</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ backgroundColor: 'blue', padding: 15, borderRadius: 10 }} onPress={handleLoginPress}>
          <Text style={{ color: 'white', textAlign: 'center' }}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ backgroundColor: 'blue', padding: 15, borderRadius: 10 }} onPress={handleRegisterPress}>
          <Text style={{ color: 'white', textAlign: 'center' }}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
