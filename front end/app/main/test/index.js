import React, { useState, useEffect } from "react";
import { Button, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as AuthSession from 'expo-auth-session';
import { useRouter } from 'expo-router'

//const redirectUri = AuthSession.makeRedirectUri();
WebBrowser.maybeCompleteAuthSession();

export default function GoogleSignInScreen() {
  const [userInfo, setUserInfo] = useState(null);

  const config = {
    androidClientId: "930798779589-l65vsh7jejl8tg1ik67fj016135tu9in.apps.googleusercontent.com",
    iosClientId: "930798779589-o5m2lilqo991ue5o1taioi9fuh6dadd3.apps.googleusercontent.com",
    webClientId: "930798779589-ddknh2qo0mqvmins0kr94re4g25t7bav.apps.googleusercontent.com",
    scopes: ["profile", "email",'https://www.googleapis.com/auth/gmail.readonly','https://www.googleapis.com/auth/gmail.modify'],
  };

  const [request, response, promptAsync] = Google.useAuthRequest(config);
  const getUserInfo = async (token) => {
    if (!token) return;
    try {
      const response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await response.json();
      await AsyncStorage.setItem("user", JSON.stringify(user));
      setUserInfo(user);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const userJSON = await AsyncStorage.getItem("user");
      if (userJSON) {
        console.log('response.authentication.accessToken',response.authentication.accessToken)
        setUserInfo(JSON.parse(userJSON));
        
      } else if (response?.type === "success") {
        console.log('response.authentication.accessToken',response.authentication.accessToken)
        getUserInfo(response.authentication.accessToken);
      }
    } catch (error) {
      console.error("Error retrieving user data from AsyncStorage:", error);
    }
  };

  useEffect(() => {
    signInWithGoogle();
  }, [response]);
  const router = useRouter()


  console.log(JSON.stringify(userInfo));
  router.push('/main/home')

  return (
    <View>
      <Button title="Sign in with Google" onPress={() => { promptAsync(); }} />
    </View>
  );
}
