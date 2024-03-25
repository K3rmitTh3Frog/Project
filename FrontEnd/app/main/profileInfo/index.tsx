import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, StatusBar, TouchableOpacity, TextInput } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import BottomNavBar from '../../../components/layout/BottomNavBar';
import { fetchUserData, changeEmail, changeProfession, changePhone } from '../../../utils/routes'; // Modified imports
import { useAppSelector } from '../../../store';


import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'; 


type IconName =
  | "arrow-back"


const ProfileScreen = () => {
  const [userData, setUserData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState<Record<string, boolean>>({});
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const { sessionId } = useAppSelector((state) => state.saved.master);
  const router = useRouter();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await fetchUserData(sessionId);
        setUserData(data);
        setEditValues({
          name: data.name,
          username: data.username,
          email: data.email,
          phone: data.phone,
          profession: data.profession,
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, []);

  const handleEdit = (field: string) => {
    setIsEditing({ ...isEditing, [field]: true });
  };

  const handleSave = async (field: string) => {
    try {
      let updatedData;
      switch (field) {
        case 'email':
          updatedData = await changeEmail(editValues[field],sessionId);
          break;
        case 'profession':
          updatedData = await changeProfession(editValues[field],sessionId);
          break;
        case 'phone':
          updatedData = await changePhone(editValues[field],sessionId);
          break;
        default:
          console.error('Invalid field:', field);
          return;
      }
      
      setUserData({ ...userData, [field]: editValues[field] });
      setIsEditing({ ...isEditing, [field]: false });
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
    }
  };

  const handleChange = (field: string, value: string) => {
    setEditValues({ ...editValues, [field]: value });
  };

  const renderField = (field: string, icon: string) => (
    
    <View style={styles.fieldContainer} key={field}>
      <Icon name={icon} size={24} color="#FFFFFF" style={styles.fieldIcon} />
      {isEditing[field] ? (
        <TextInput
          value={editValues[field]}
          onChangeText={(value) => handleChange(field, value)}
          style={styles.fieldInput}
          autoFocus
        />
      ) : (
        <TouchableOpacity style={{ flex: 1 }} onPress={() => handleEdit(field)}>
          <Text style={styles.fieldText}>{userData[field]}</Text>
        </TouchableOpacity>
      )}
      {isEditing[field] && (
        <TouchableOpacity onPress={() => handleSave(field)}>
          <Icon name="check" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.goBackButton} onPress={() => router.push('/main/Settings')}>
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.fieldText1}>Profile</Text>
        </View>
        {userData && (
          <>
            {renderField('name', 'user')}
            {renderField('username', 'user')}
            {renderField('email', 'mail')}
            {renderField('phone', 'phone')}
            {renderField('profession', 'briefcase')}
          </>
        )}
      </ScrollView>
      <BottomNavBar />
    </SafeAreaView>
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
    fontWeight: 'bold',
    textAlign: 'center',
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
  fieldInput: {
    color: '#FFFFFF',
    fontSize: 14,
    flex: 1,
    marginRight: 10,
  },
});

export default ProfileScreen;
