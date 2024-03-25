import React, { useState, useEffect } from "react";
import { Button, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useAppSelector } from '../../../store';

WebBrowser.maybeCompleteAuthSession();

interface Google{

}

export default function GoogleSignInScreen() {
  const Googleconfig: Google = {
    androidClientId: "930798779589-l65vsh7jejl8tg1ik67fj016135tu9in.apps.googleusercontent.com",
    iosClientId: "930798779589-o5m2lilqo991ue5o1taioi9fuh6dadd3.apps.googleusercontent.com",
    webClientId: "930798779589-ddknh2qo0mqvmins0kr94re4g25t7bav.apps.googleusercontent.com",
    scopes: ["profile", "email",'https://www.googleapis.com/auth/gmail.readonly','https://www.googleapis.com/auth/gmail.modify'],
    offlineAccess: true,
    redirectUri: 'com.vladiusftw.jumantestpatience:/main/home',
  };

  const [request, response, promptAsync] = Google.useAuthRequest(Googleconfig);
  const { sessionId } = useAppSelector((state) => state.saved.master);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      if (response?.type === 'success') {
        console.log(JSON.stringify(response))
        try {
          //const responseData = await addGmailToken(JSON.stringify(response), sessionId);
          console.log(response);
        } catch (error) {
          console.error('Error fetching priority email data:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData(); 
  }, [response, sessionId]);
  return (
    <View>
      <Button title="Sign in with Google" onPress={() => { promptAsync(); }} />
    </View>
  );
}
