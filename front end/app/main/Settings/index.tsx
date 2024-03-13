import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import BottomNavBar from '../../../components/layout/BottomNavBar'
import { useRouter } from 'expo-router'
import { fetchUserData } from '../../../utils/routes'
import { useAppSelector } from '../../../store';

type IconName =
  | "menu"
  | "person-circle"
  | "help-circle"
  | "notifications"
  | "link"
  | "alert-circle";

interface SettingsOptionProps {
  title: string;
  iconName: IconName;
  onPress?: () => void;
}

const SettingsOption: React.FC<SettingsOptionProps> = ({ title, iconName, onPress }) => {
  return (
    <TouchableOpacity style={styles.optionButton} onPress={onPress}>
      <Ionicons name={iconName} size={30} color="#85CCE6" />
      <Text style={styles.optionText}>{title}</Text>
      <Ionicons name="chevron-forward" size={30} color="#E6F7FD" />
    </TouchableOpacity>
  );
};
type Props = {}
const SettingsScreen =(props: Props) =>{
    const router = useRouter()
    const [userData, setUserData] = useState<{name: string, email: string} | null>(null);
    const { sessionId } = useAppSelector((state) => state.saved.master);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await fetchUserData(sessionId);
                setUserData(userData); // Assuming fetchUserData returns an object with name and email properties
            } catch (error) {
                console.error('Error fetching user data:', error);
                // Handle error fetching user data
            }
        };
        fetchData();
    }, []);

  return (
    <View style={styles.container}>

      {/* Menu Icon and User Info */}
      <View style={styles.header}>
        {userData && (
          <>
            <Text style={styles.userName}>{userData.name}</Text>
            <Text style={styles.userEmail}>{userData.email}</Text>
          </>
        )}
        <TouchableOpacity style={styles.editProfileButton} onPress={() => router.push('/main/home')}>
          <Text style={styles.editProfileText}>Edit profile</Text>
        </TouchableOpacity>
      </View>

      {/* Settings Options List */}
      <ScrollView style={styles.settingsList}>
        <SettingsOption title="Profile Information" iconName="person-circle" onPress={() => router.push('/main/profileInfo')} />
        <SettingsOption title="FAQ" iconName="help-circle" onPress={() => router.push('/main/FAQ')} />
        <SettingsOption title="Notifications" iconName="notifications" onPress={() => router.push('/main/notifications')} />
        <SettingsOption title="Connect Your Inbox" iconName="link" onPress={() => router.push('/main/home')} />
        <SettingsOption title="Priority Emails" iconName="alert-circle" />
      </ScrollView>

      {/* Bottom Tab Navigation */}
      <BottomNavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  menuIcon: {
    marginTop: 50,
    marginLeft: 26,
  },
  container: {
    flex: 1,
    backgroundColor: '#001C30',
  },
  header: {
    alignItems: 'center',
    marginTop: 80,
  },
  userName: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  userEmail: {
    color: '#858895',
    fontSize: 15,
  },
  editProfileButton: {
    backgroundColor: '#85CCE6',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignSelf: 'center',
    marginTop: 20,
    shadowColor: 'rgba(149, 173, 254, 0.25)',
    shadowOffset: { width: 10, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 22,
  },
  editProfileText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  settingsList: {
    marginTop: 20,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#21394B',
    borderRadius: 30,
    padding: 20,
    marginVertical: 7,
    marginHorizontal: 13,
  },
  optionText: {
    flex: 1,
    color: 'white',
    fontSize: 17,
    marginLeft: 20,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#85CCE6',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#95ADFE',
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 22,
  },
});

export default SettingsScreen;
