import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, StatusBar } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import BottomNavBar from '../../../components/layout/BottomNavBar';
import { fetchUserData } from '../../../utils/routes';
import { useAppSelector } from '../../../store';

const ProfileScreen = () => {
    const [userData, setUserData] = useState<any>(null);
  const { sessionId } = useAppSelector((state) => state.saved.master);
  useEffect(() => {
    
    const fetchUser = async () => {
      try {
        const data = await fetchUserData(sessionId); 
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Handle error
      }
    };

    fetchUser();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.fieldText1}>Profile</Text>
        </View>
        {userData && (
          <>
            <View style={styles.fieldContainer}>
              <Icon name="user" size={24} color="#FFFFFF" style={styles.fieldIcon} />
              <Text style={styles.fieldText}>{userData.name}</Text>
            </View>
            <View style={styles.fieldContainer}>
              <Icon name="user" size={24} color="#FFFFFF" style={styles.fieldIcon} />
              <Text style={styles.fieldText}>{userData.username}</Text>
            </View>
            <View style={styles.fieldContainer}>
              <Icon name="mail" size={24} color="#FFFFFF" style={styles.fieldIcon} />
              <Text style={styles.fieldText}>{userData.email}</Text>
            </View>
            <View style={styles.fieldContainer}>
              <Icon name="phone" size={24} color="#FFFFFF" style={styles.fieldIcon} />
              <Text style={styles.fieldText}>{userData.phone}</Text>
            </View>
            <View style={styles.fieldContainer}>
              <Icon name="briefcase" size={24} color="#FFFFFF" style={styles.fieldIcon} />
              <Text style={styles.fieldText}>{userData.profession}</Text>
            </View>
          </>
        )}
      </ScrollView>
      <BottomNavBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001C30',
  },
  scrollView: {
    marginHorizontal: 10,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
  },
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#21394B',
    borderRadius: 12,
    padding: 22,
    marginVertical: 8,
  },
  fieldIcon: {
    marginRight: 10,
  },
  fieldText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
  },
  fieldText1: {
    color: '#FFFFFF',
    fontSize: 25,
    lineHeight: 70,
    fontWeight: 'bold', // Add bold style here
    textAlign: 'center', // Center align the text
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#85CCE6',
    height: 108,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 20,
  },
  footerButton: {
    // styles for footer buttons
  },
});

export default ProfileScreen;
