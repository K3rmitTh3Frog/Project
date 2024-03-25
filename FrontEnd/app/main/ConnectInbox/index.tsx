import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'
import { colors } from '../../../constants'
import BottomNavBar from '../../../components/layout/BottomNavBar'
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen'
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useAppSelector } from '../../../store';
import { addGmailToken } from '../../../utils/routes';
import * as AuthSession from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

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

const authRe: AuthRequestConfig= {
  clientId:'f167588e-779c-4604-894e-dc7afafd0955',
  redirectUri:redirectUri,
  scopes:['https://graph.microsoft.com/Mail.Read','openid','offline_access'],
  responseType:'code',
  usePKCE: false,
}

interface Google{

}

const ConnectInboxScreen = () => {
    const router = useRouter();
    const [token, setToken] = useState(null);
    const { sessionId } = useAppSelector((state) => state.saved.master);
    const [loading, setLoading] = useState(false);
    const [request, response, promptAsync] = AuthSession.useAuthRequest(authRe, discovery);

    useEffect(() => {
        if (response?.type === 'success') {
            const { code } = response.params;
            const fetchToken = async () => {
                const tokenResponse = await fetch(discovery.tokenEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `grant_type=authorization_code&code=${code}&redirect_uri=${authRe.redirectUri}&client_id=${authRe.clientId}&scope=${authRe.scopes}`,
                });
                const json = await tokenResponse.json();
                setToken(json.access_token);
            };
            fetchToken();
        } else {
            console.log('try again');
        }
    }, [response]);

    const onConnectGmail = () => {
        const Googleconfig: Google = {
            androidClientId: "930798779589-l65vsh7jejl8tg1ik67fj016135tu9in.apps.googleusercontent.com",
            iosClientId: "930798779589-o5m2lilqo991ue5o1taioi9fuh6dadd3.apps.googleusercontent.com",
            webClientId: "930798779589-ddknh2qo0mqvmins0kr94re4g25t7bav.apps.googleusercontent.com",
            scopes: ["profile", "email",'https://www.googleapis.com/auth/gmail.readonly','https://www.googleapis.com/auth/gmail.modify'],
            offlineAccess: true,
            redirectUri: 'com.vladiusftw.jumantestpatience:/main/home',
        };
    
        const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest(Googleconfig);

        useEffect(() => {
            const fetchData = async () => {
                if (googleResponse?.type === 'success') {
                    try {
                        //const responseData = await addGmailToken(JSON.stringify(googleResponse), sessionId);
                        console.log(googleResponse);
                    } catch (error) {
                        console.error('Error fetching priority email data:', error);
                    } finally {
                        setLoading(false);
                    }
                }
            };
            fetchData(); 
        }, [googleResponse, sessionId]);

        // Call googlePromptAsync where you want to trigger Google authentication
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.goBackButton} onPress={() => router.push('/main/Settings')}>
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
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

export default ConnectInboxScreen;

const styles = StyleSheet.create({
    goBackButton: {
        position: 'absolute',
        top: 35,
        left: 20,
        zIndex: 1,
    },
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
});
