import React from 'react'
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../../../constants'
import BottomNavBar from '../../../components/layout/BottomNavBar'
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen'
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {}
import * as AuthSession from 'expo-auth-session';


const redirectUri = AuthSession.makeRedirectUri({
  path: 'main/inbox',
});


interface DiscoveryDocument {
  authorizationEndpoint: string,
  tokenEndpoint: string,
}

const discovery: DiscoveryDocument = {
  authorizationEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
  tokenEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
};

interface AuthRequestConfig{
  clientId:string
  redirectUri:string,
  scopes:string[],
  responseType:string,
  usePKCE: boolean;
}

const authRe: AuthRequestConfig=
{
  clientId:'f167588e-779c-4604-894e-dc7afafd0955',
  redirectUri:redirectUri,
  scopes:['https://graph.microsoft.com/Mail.Read','openid','offline_access'],
  responseType:'code',
  usePKCE: false,
}



  
const ConnectInboxScreen = (props: Props) => {
    const [token, setToken] = React.useState(null);
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    authRe,
    discovery
  )
  

React.useEffect(() => {
  if (response?.type === 'success') {
    console.log('inside')
    console.log(request)
    console.log(response)
    const { code } = response.params;

    const fetchToken = async () => {
      console.log('in')
      const tokenResponse = await fetch(discovery.tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `grant_type=authorization_code&code=${code}&redirect_uri=${authRe.redirectUri}&client_id=${authRe.clientId}&scope=${authRe.scopes}`,
      });

      const json = await tokenResponse.json();
      console.log('access ',json.access_token);
      setToken(json.access_token);
    };
    fetchToken();
  }
  else{
    console.log('try again')
  }
}, [response]);

    const onConnectGmail = () => {}

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.content}>
                    <Text style={styles.headerText}>Connect Your Inbox</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => promptAsync()}
                        >
                            <Ionicons
                                name="logo-windows"
                                size={hp(3)}
                                color="white"
                            />
                            <Text style={styles.buttonText}>
                                Connect Microsoft Account
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={onConnectGmail}
                        >
                            <Ionicons
                                name="logo-google"
                                size={hp(3)}
                                color="white"
                            />
                            <Text style={styles.buttonText}>
                                Connect Gmail Account
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            <BottomNavBar />
        </SafeAreaView>
    )
}

export default ConnectInboxScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bg,
        justifyContent: 'space-between',
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        width: '90%',
        alignItems: 'center',
    },
    headerText: {
        fontFamily: 'Poppins_700Bold',
        fontSize: hp(2.6),
        color: colors['brand-100'],
        textAlign: 'center',
        marginBottom: hp(4),
    },
    buttonContainer: {
        width: '100%',
    },
    button: {
        flexDirection: 'row',
        backgroundColor: colors['brand-200'],
        borderColor: colors['brand-100'],
        borderWidth: 1,
        padding: hp(2),
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: hp(2),
    },
    buttonText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: hp(2),
        color: 'white',
        marginLeft: wp(2),
    },
})