import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'

import BottomNavBar from '../../../components/layout/BottomNavBar'
type Props = {}

const InformationScreen= (props: Props) => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.goBackButton} onPress={() => router.push('/main/Settings')}>
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
      <View style={styles.header}>
        <Text style={styles.userName}>Information & Help</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.settingsList}>
          <View style={styles.settingItem}>
            <Text style={styles.settingText}>About We Saturday</Text>
            <Text style={styles.settingDescription}>
              We Saturday is your personal assistant to manage your events and tasks efficiently. From sorting your emails to scheduling your week, We Saturday is here to optimize your productivity.
            </Text>
          </View>
          <View style={styles.settingItem}>
            <Text style={styles.settingText}>How to Use</Text>
            <Text style={styles.settingDescription}>
              Navigate through the tabs to access your Calendar, Mail Inbox, and To-Do Lists. Tap on any item to view details or perform actions.
            </Text>
          </View>
          <View style={styles.settingItem}>
            <Text style={styles.settingText}>FAQs</Text>
            <Text style={styles.settingDescription}>
              Q: How do I sync my calendar?{'\n'}A: Go to Settings  Sync Calendar to integrate your existing calendar.{'\n'}
              Q: Can I customize my notifications?{'\n'}A: Yes, notifications can be customized in Settings  Notifications.
            </Text>
          </View>
        </View>
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
    marginTop: 65,
  },
  userName: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  scrollView: {
    marginTop: 20,
  },
  settingsList: {
    marginTop: 20,
  },
  settingItem: {
    backgroundColor: '#21394B',
    borderRadius: 30,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginVertical: 7,
    marginHorizontal: 13,
  },
  settingText: {
    fontSize: 17,
    color: '#FFFFFF',
    fontWeight: '500',
    marginBottom: 10,
  },
  settingDescription: {
    fontSize: 15,
    color: '#FFFFFF',
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

export default InformationScreen;
