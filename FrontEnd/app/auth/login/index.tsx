import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    Alert,
} from 'react-native'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import { colors } from '../../../constants'
import { loginUser } from '../../../utils/routes'
import { useAppDispatch } from '../../../store'
import { setPhone } from '../../../store/reducers/CredentialReducer'
import { setLoading } from '../../../store/reducers/LoadingReducer'
import { setSessionId } from '../../../store/reducers/MasterReducer'

type Props = {}

const Login = (props: Props) => {
    const router = useRouter()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const dispatch = useAppDispatch()

    const onSubmit = async () => {
        dispatch(setLoading(true))
        try {
            const data = await loginUser(username, password)
            dispatch(setSessionId(data?.sessionid))
            router.push('/main/home')
        } catch (e: any) {
            const message = e?.response?.data?.message ?? 'An error has occured'
            Alert.alert(message)
        }
        dispatch(setLoading(false))
    }

    return (
        <View style={styles.container}>
            {/* <Text style={styles.time}>19:02</Text> */}

            {/* Replace with an actual image component with your logo */}

            <Image
                source={require('../../../assets/logo.png')}
                style={styles.logo}
                // transition={1000}
                // placeholder={blurhash}
                contentFit="cover"
            />

            <Text style={styles.title}>{'Login to your\nprofile'}</Text>

            <View
                style={{
                    width: '100%',
                    paddingHorizontal: wp(14),
                    marginBottom: hp(3),
                }}
            >
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        numberOfLines={1}
                        onChangeText={(newText) => setUsername(newText)}
                    />
                    <Ionicons name="mail" color="black" size={hp(3)} />
                </View>
            </View>

            <View style={{ width: '100%', paddingHorizontal: wp(14) }}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        numberOfLines={1}
                        secureTextEntry
                        onChangeText={(newText) => setPassword(newText)}
                    />
                    <Ionicons name="lock-closed" color="black" size={hp(3)} />
                </View>

                <TouchableOpacity
                    onPress={() => router.navigate('/auth/forgotPassword')}
                >
                    <Text style={[styles.smallLabel, { marginTop: hp(1) }]}>
                        {'Forgot password?'}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={{ gap: hp(3), marginTop: hp(8) }}>
                <TouchableOpacity style={styles.button} onPress={onSubmit}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
            </View>

            <View
                style={{
                    width: '100%',
                    paddingHorizontal: wp(4),
                    marginTop: hp(6),
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: wp(4),
                }}
            >
                <View style={styles.line} />
                <Text style={[styles.smallLabel, { textAlign: 'center' }]}>
                    Or
                </Text>
                <View style={styles.line} />
            </View>

            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: wp(2),
                    marginTop: hp(2),
                }}
            >
                <Text style={styles.smallLabel}>
                    {"Don't have an account yet?"}
                </Text>
                <TouchableOpacity
                    onPress={() => router.navigate('/auth/register')}
                >
                    <Text style={{ color: colors['brand-100'] }}>
                        {'Register'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Login

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#001C30', // Replace with your background color
        alignItems: 'center',
    },
    // time: {
    //     position: 'absolute',
    //     top: 50, // Adjust as needed
    //     right: 20, // Adjust as needed
    //     color: '#fff',
    //     fontSize: 18,
    // },
    logo: {
        width: hp(20),
        height: hp(20),
        marginTop: hp(12),
    },

    logoText: {
        color: '#fff',
        fontSize: 32,
        fontWeight: 'bold',
        // Add styles for your logo text if needed
    },
    title: {
        color: 'white',
        fontFamily: 'Poppins_700Bold',
        fontSize: hp(2.7),
        textAlign: 'center',
        marginTop: hp(4),
    },
    button: {
        backgroundColor: '#85CCE6', //button background color
        borderRadius: 100,
        width: wp(50),
        height: hp(6),
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#95adfe',
        shadowOffset: {
            width: 0,
            height: 18,
        },
        shadowOpacity: 0.25,
        shadowRadius: 20.0,
        elevation: 24,
    },
    buttonText: {
        color: '#E6F7FD', //button text color
        fontFamily: 'Poppins_700Bold',
        fontSize: hp(1.8),
    },
    input: {
        width: wp(60),
        height: '100%',
    },
    label: {
        color: 'white',
        marginBottom: hp(1),
        fontFamily: 'Poppins_700Bold',
        fontSize: hp(1.4),
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        height: hp(5),
        backgroundColor: 'white',
        alignItems: 'center',
        paddingHorizontal: wp(4),
        borderRadius: 12,
    },
    smallLabel: {
        color: 'white',
        fontSize: hp(1.3),
        fontFamily: 'Poppins_400Regular',
        textAlign: 'right',
    },
    line: {
        width: wp(40),
        height: hp(0.2),
        backgroundColor: 'white',
    },
})
