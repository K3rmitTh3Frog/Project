import {
    Keyboard,
    KeyboardEventListener,
    Linking,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from '../../../constants'
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen'
import {
    GoogleSignin,
    statusCodes,
} from '@react-native-google-signin/google-signin'
import { Ionicons } from '@expo/vector-icons'
import BottomNavBar from '../../../components/layout/BottomNavBar'
import Inbox from '../../../components/main/inbox/Inbox'
import { useAppDispatch, useAppSelector } from '../../../store'
import { setLoading } from '../../../store/reducers/LoadingReducer'
import { usePathname } from 'expo-router'
import {
    exchangeCodeAsync,
    makeRedirectUri,
    useAuthRequest,
    useAutoDiscovery,
} from 'expo-auth-session'
import { setOutlookAccessToken } from '../../../store/reducers/MasterReducer'
type Props = {}

const index = (props: Props) => {
    const dispatch = useAppDispatch()
    const [footerShown, setFooterShown] = useState(true)
    const { outlookAccessToken } = useAppSelector((state) => state.saved.master)

    const discovery = useAutoDiscovery(
        'https://login.microsoftonline.com/36d7d46d-cb4c-4f31-8596-784215fd88d6/v2.0'
    )
    const redirectUri = makeRedirectUri({
        path: 'main/inbox',
    })

    const clientId = 'f167588e-779c-4604-894e-dc7afafd0955'

    // Request
    const [request, , promptAsync] = useAuthRequest(
        {
            clientId,
            scopes: ['openid', 'profile', 'email', 'offline_access'],
            redirectUri,
        },
        discovery
    )

    const initial = async () => {
        dispatch(setLoading(true))
        if (outlookAccessToken === '' || !outlookAccessToken) {
            try {
                const codeResponse = await promptAsync()
                if (request && codeResponse?.type === 'success' && discovery) {
                    const res = await exchangeCodeAsync(
                        {
                            clientId,
                            code: codeResponse.params.code,
                            extraParams: request.codeVerifier
                                ? { code_verifier: request.codeVerifier }
                                : undefined,
                            redirectUri,
                        },
                        discovery
                    )
                    console.log("test2",res);
                    
                    dispatch(setOutlookAccessToken(res.accessToken))
                }
            } catch (e) {
                console.log(e)
            }
        }
        dispatch(setLoading(false))
    }

    const pathname = usePathname()

    useEffect(() => {
        if (pathname == '/main/inbox' && request) initial()
    }, [pathname, request])

    useEffect(() => {
        const showKeyboard: KeyboardEventListener = () => {
            setFooterShown(true)
        }
        const hideKeyboard: KeyboardEventListener = () => {
            setFooterShown(false)
        }
        const showListener = Keyboard.addListener(
            'keyboardDidHide',
            showKeyboard
        )
        const hideListener = Keyboard.addListener(
            'keyboardDidShow',
            hideKeyboard
        )

        return () => {
            showListener.remove()
            hideListener.remove()
        }
    }, [])

    useEffect(() => {
        console.log('outlook token', outlookAccessToken)
      dispatch(setOutlookAccessToken(""))
        
    }, [outlookAccessToken,request])

    return (
        <View style={styles.container}>
            <View>
                <View style={styles.header}>
                    <TextInput
                        placeholder="Search in mail"
                        placeholderTextColor={colors['brand-100']}
                        style={styles.searchInput}
                    />
                    <Ionicons
                        name={'person'}
                        size={hp(4)}
                        color={colors['brand-100']}
                        style={{ marginRight: wp(2) }}
                    />
                </View>
                <View style={styles.emailList}>
                    {/* {outlookAccessToken != '' && (
                        <Inbox gmailAccessToken={outlookAccessToken} />
                    )} */}
                </View>
            </View>

            {/* Email List */}

            {/* Bottom Navigation Bar */}
            {footerShown && <BottomNavBar />}
        </View>
    )
}

export default index

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bg,
        justifyContent: 'space-between',
    },
    img: {
        width: hp(20),
        height: hp(20),
    },
    title: {
        fontFamily: 'Poppins_700Bold',
        fontSize: hp(2.6),
        color: colors['brand-100'],
        marginTop: hp(6),
    },
    button: {
        width: wp(44),
        height: hp(5.4),
        backgroundColor: colors['brand-100'],
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: hp(2),
        borderRadius: 25,
    },
    buttonText: {
        color: 'white',
        fontFamily: 'Poppins_600SemiBold',
        fontSize: hp(1.8),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors['brand-200'],
        paddingTop: hp(8),
        paddingBottom: hp(3),
    },
    searchInput: {
        flex: 1,
        height: hp(5),
        marginHorizontal: wp(4),
        backgroundColor: colors['brand-300'],
        color: colors['brand-100'],
        borderRadius: hp(4),
        paddingHorizontal: wp(3),
        fontFamily: 'Poppins_400Regular',
        fontSize: hp(2),
    },
    emailList: {
        width: '100%',
        height: hp(70),
    },
    emailItem: {
        flexDirection: 'row',
        padding: hp(2),
        borderBottomWidth: 1,
        borderBottomColor: colors['brand-200'],
        gap: wp(4),
    },
    initialCircle: {
        width: hp(6),
        height: hp(6),
        borderRadius: hp(6),
        backgroundColor: colors['brand-100'],
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: hp(0.5),
    },
    initial: {
        color: 'white',
        fontFamily: 'Poppins_700Bold',
        fontSize: hp(2.5),
    },
    emailContent: {
        flex: 1,
    },
    subject: {
        color: 'white',
        fontFamily: 'Poppins_700Bold',
        fontSize: hp(2),
    },
    preview: {
        color: 'white',
        fontFamily: 'Poppins_400Regular',
        fontSize: hp(1.8),
    },
    time: {
        color: 'white',
        fontFamily: 'Poppins_400Regular',
        fontSize: hp(1.8),
    },
})
