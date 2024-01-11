import { createDrawerNavigator } from '@react-navigation/drawer';
import HomePage from '../screens/HomePage';
import SettingsPage from '../screens/Settings';
import { NavigationContainer } from '@react-navigation/native';

const Drawer = createDrawerNavigator();
export const MyDrawer =() => {
    return (
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Home">
          <Drawer.Screen name="Home2" component={HomePage} />
          <Drawer.Screen name="settings" component={SettingsPage} />
        </Drawer.Navigator>
      </NavigationContainer>
    );
  }