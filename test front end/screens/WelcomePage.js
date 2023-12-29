//WelcomePage.js
import React from 'react';
import { View, Text,TextInput, TouchableOpacity, StyleSheet,ImageBackground  } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // You can use a library like @expo/vector-icons for icons

import bgImage from '../images/bg.jpg';

export default function WelcomePage({ navigation }) {
  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  const handleRegisterPress = () => {
    navigation.navigate('Register');
  };

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={bgImage}
        style={{ flex: 1, resizeMode: 'cover', justifyContent: 'center' }}
      >
        <View style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <Text style={{ textAlign: 'center', fontSize: 24, color: 'white', marginTop: 20 }}>
            Welcome to saturday
          </Text>
          <Text style={{ textAlign: 'center', fontSize: 16, color: 'white', marginHorizontal: 20, marginBottom: 20 }}>
            I am your virtual personal assistent
          </Text>
        </View>
      </ImageBackground>
      <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>Sign In</Text>
        {/* Social icons */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 20 }}>
          <TouchableOpacity style={{ backgroundColor: 'blue', padding: 10, borderRadius: 5, marginRight: 10 }}>
            <FontAwesome name="google" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={{ backgroundColor: 'blue', padding: 10, borderRadius: 5, marginRight: 10 }}>
            <FontAwesome name="facebook" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={{ backgroundColor: 'blue', padding: 10, borderRadius: 5 }}>
            <FontAwesome name="twitter" size={20} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={{ textAlign: 'center', color: 'white', marginBottom: 10 }}>or</Text>
        {/* Sign In Form */}
        
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