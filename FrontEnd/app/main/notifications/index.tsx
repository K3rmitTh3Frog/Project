import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  ScrollView,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'

import BottomNavBar from '../../../components/layout/BottomNavBar'

interface NotificationOption {
  externalName: string;
  internalName: string;
  isEnabled: boolean;
}

const NotificationScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [notificationOptions, setNotificationOptions] = useState<NotificationOption[]>([
    { externalName: "Priority Emails Notification", internalName: "Priority Emails", isEnabled: false },
    { externalName: "To-Do List Reminder Notification", internalName: "todoList Reminder", isEnabled: false },
    { externalName: "Upcoming Event Alert Notification", internalName: "upcoming Event Alert", isEnabled: false },
  ]);
  const router = useRouter();

  // Load the persisted state when the component mounts
  useEffect(() => {
    const loadPersistedOptions = async () => {
      try {
        const savedOptions = await AsyncStorage.getItem('notificationOptions');
        if (savedOptions) {
          setNotificationOptions(JSON.parse(savedOptions));
        }
      } catch (e) {
        console.error('Failed to load the notification options', e);
      }
    };

    loadPersistedOptions();
  }, []);

  const toggleSwitch = async (index: number) => {
    const newOptions = [...notificationOptions];
    newOptions[index].isEnabled = !newOptions[index].isEnabled;
    setNotificationOptions(newOptions);

    try {
      await AsyncStorage.setItem('notificationOptions', JSON.stringify(newOptions));
    } catch (e) {
      console.error('Failed to save the notification options', e);
    }
  };
  
  return (
    <View style={styles.container}>
<TouchableOpacity style={styles.goBackButton} onPress={() => router.push('/main/Settings')}>
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
      <View style={styles.header}>
        <Text style={styles.nameText}>Notification</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {notificationOptions.map((option, index) => (
 
          <TouchableOpacity style={styles.settingItem} key={index} onPress={() => toggleSwitch(index)}>
            <View style={styles.optionContainer}>
              <Text style={styles.settingText}>{option.externalName}</Text>
              <Text style={styles.settingDescription}>{option.internalName}</Text>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={option.isEnabled ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => toggleSwitch(index)}
              value={option.isEnabled}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

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
    marginTop: 85,
  },
  nameText: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 20,
  },
  scrollView: {
    marginTop: 20,
  },
  settingItem: {
    backgroundColor: '#21394B',
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginVertical: 7,
  },
  optionContainer: {
    flex: 1,
  },
  settingText: {
    fontSize: 17,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 14,
    color: '#858895',
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

export default NotificationScreen;
