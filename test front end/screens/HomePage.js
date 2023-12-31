import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchUserData, logoutUser } from '../api/accountApi';
import { useNavigation } from '@react-navigation/native';
import { BackHandler } from 'react-native';


export default function HomePage() {
  const [userName, setUserName] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigation = useNavigation();

  const handleRefresh = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const data = await fetchUserData();
      if (data && data.name) {
        setUserName(data.name);
      }
    } catch (error) {
      // Handle or display error as needed
      Alert.alert('Error', 'Failed to fetch user data.');
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const initialize = async () => {
      try {
        const data = await fetchUserData();
        if (data && data.name) {
          setUserName(data.name);
        }
      } catch (error) {
        // Handle or display error as needed
        Alert.alert('Error', 'Failed to fetch user data.');
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.headerButton}>Logout</Text>
        </TouchableOpacity>
      ),
      headerLeft: null, // Removes the back arrow
    });
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true // Return true to indicate that we have handled the back press
    );

    // Cleanup function
    return () => backHandler.remove();
  }, [navigation]);

  const handleLogout = async () => {
    try {
      const success = await logoutUser();
      if (success) {
        await AsyncStorage.removeItem('userToken');
        navigation.navigate('Login');
      } else {
        Alert.alert('Logout Failed', 'Could not log out. Please try again.');
      }
    } catch (error) {
      // Handle or display error as needed
      Alert.alert('Logout Error', 'An error occurred during logout');
    }
  };

  const handleCalendarPress = () => {
    navigation.navigate('Calendar');
  };

  const handleMailInboxPress = () => {
    navigation.navigate('Emails');
  };

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  const handleToDOPress = () => {
    navigation.navigate('ToDoList');
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollViewContainer}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={styles.container}>
        <Text style={styles.welcomeText}>Welcome, {userName || 'Guest'}!</Text>
        <Text style={styles.progressText}>
          Your Progress: (implement a function)
        </Text>
        <View style={styles.categoryContainer}>
          <TouchableOpacity
            style={styles.categoryButton}
            onPress={handleCalendarPress}
          >
            <Text style={styles.categoryButtonText}>Calendar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.categoryButton}
            onPress={handleMailInboxPress}
          >
            <Text style={styles.categoryButtonText}>Mail Inbox</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.categoryButton}
            onPress={handleToDOPress}
          >
            <Text style={styles.categoryButtonText}>To-Do List</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryButton}>
            <Text style={styles.categoryButtonText}>Write to Saturday</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.categoryButton}
            onPress={handleProfilePress}
          >
            <Text style={styles.categoryButtonText}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  progressText: {
    fontSize: 16,
    marginBottom: 20,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  categoryButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  categoryButtonText: {
    color: 'white',
    fontSize: 18,
  },
  scrollViewContainer: {
    flexGrow: 1,
  },
});
