import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { useRouter } from 'expo-router'
import BottomNavBar from '../../../components/layout/BottomNavBar'
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
const SettingsScreen = (props: Props) => {
    const router = useRouter()
    const [userData, setUserData] = useState<{ name: string, email: string } | null>(null);
    const { sessionId } = useAppSelector((state) => state.saved.master);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await fetchUserData(sessionId);
                setUserData(userData); 
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchData();
    }, []);
    return (
        <View style={styles.container}>
            {/* Go Back Arrow */}
            <TouchableOpacity style={styles.goBackButton} onPress={() => router.push('/main/home')}>
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

            {/* Menu Icon and User Info */}
            <View style={styles.header}>
                {userData && (
                    <>
                        <Text style={styles.userName}>{userData.name}</Text>
                        <Text style={styles.userEmail}>{userData.email}</Text>
                    </>
                )}
            </View>

            {/* Settings Options List */}
            <ScrollView style={styles.settingsList}>
                <SettingsOption title="Profile Information" iconName="person-circle" onPress={() => router.push('/main/profileInfo')} />
                <SettingsOption title="FAQ" iconName="help-circle" onPress={() => router.push('/main/FAQ')} />
                <SettingsOption title="Notifications" iconName="notifications" onPress={() => router.push('/main/notifications')} />
                <SettingsOption title="Connect Your Inbox" iconName="link" onPress={() => router.push('/main/ConnectInbox')} />
                <SettingsOption title="Priority Emails" iconName="alert-circle" onPress={() => router.push('/main/PriorityEmails')}/>
            </ScrollView>
            {/* Bottom Tab Navigation */}
            <BottomNavBar />
        </View>
    );
};


const styles = StyleSheet.create({
    goBackButton: {
        position: 'absolute',
        top: 35,
        left: 20,
        zIndex: 1,
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
