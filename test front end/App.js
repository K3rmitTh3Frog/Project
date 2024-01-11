//Apps.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomePage from './screens/WelcomePage';
import LoginScreen from './screens/LoginScreen';
import OTPPage from './screens/OTPPage';
import RegisterScreen from './screens/RegisterScreen';
import HomePage from './screens/HomePage';
import CalendarPage from './screens/CalendarPage';
import ProfileScreen from './screens/ProfileScreen'; 
import SettingsScreen from './screens/Settings';
import ToDOListScreen from './screens/ToDoListScreen';
import CreateToDoList from './screens/CreateToDoListScreen';
import EmailPage from './screens/EmailPage';
import PriorityEmailScreen from './screens/priorityEmails';
import JumanLoginScreen from './screens/jumanLogin'; 
import JumanLogoutScreen from './screens/jumanlogout';
import TaskDetail from './screens/updateToDoList';
import 'react-native-gesture-handler';


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Welcome" component={WelcomePage} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="OTP" component={OTPPage} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="Calendar" component={CalendarPage} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="ToDoList" component={ToDOListScreen} />
        <Stack.Screen name="CreateToDoList" component={CreateToDoList} />
        <Stack.Screen name="email" component={EmailPage} />
        <Stack.Screen name="priorityEmail" component={PriorityEmailScreen} />
        <Stack.Screen name="jumanlogin" component={JumanLoginScreen}/>
        <Stack.Screen name="jumanlogout" component={JumanLogoutScreen}/>
        <Stack.Screen name="TaskDetail" component={TaskDetail}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}