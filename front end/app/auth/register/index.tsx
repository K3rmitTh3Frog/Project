import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
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
import { useAppDispatch, useAppSelector } from '../../../store'
import { registerUser } from '../../../utils/routes'
import { setSessionId } from '../../../store/reducers/MasterReducer'

type Props = {}

const Login = (props: Props) => {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [userName, setUsername] = useState('')
    const [Name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [profession, setProfession] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const dispatch = useAppDispatch()

    const onSubmit = async () => {
        if (confirmPassword !== password) {
            Alert.alert('Password does not match!')
            return
        }
        if (!email.includes('@')) {
            Alert.alert('Provide a valid email!')
            return
        }
        try {
            const data = await registerUser(email, userName, Name, phone, profession, password);
            dispatch(setSessionId(data?.session_id))
            router.push('/auth/OTP')
        } catch (e: any) {
            const message =
                e?.response?.data?.message ?? 'An error has occured!'
            Alert.alert(message)
        }
    }


    return (
        <View style={styles.container}>
            {/* <Text style={styles.time}>19:02</Text> */}

            {/* Replace with an actual image component with your logo */}
{/*
            <Image
                source={require('../../../assets/logo.png')}
                style={styles.logo}
                // transition={1000}
                // placeholder={blurhash}
                contentFit="cover"
            />
*/}
             <View
                style={{
                    width: '100%',
                    paddingHorizontal: wp(14),
                    marginBottom: hp(3),
                }}
            >
                <Text style={styles.label}>Full Name</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Full Name"
                        numberOfLines={1}
                        onChangeText={(newText) => setName(newText)}
                    />
                    <Ionicons name="person" color="black" size={hp(3)} />
                </View>
            </View> 

            <View
                style={{
                    width: '100%',
                    paddingHorizontal: wp(14),
                    marginBottom: hp(3),
                }}
            >
                <Text style={styles.label}>User name</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        numberOfLines={1}
                        onChangeText={(newText) => setUsername(newText)}
                    />
                    <Ionicons name="person" color="black" size={hp(3)} />
                </View>
            </View> 


            <View
                style={{
                    width: '100%',
                    paddingHorizontal: wp(14),
                    marginBottom: hp(3),
                }}
            >
                <Text style={styles.label}>Profession</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Profession"
                        numberOfLines={1}
                        onChangeText={(newText) => setProfession(newText)}
                    />
                    <Ionicons name="person" color="black" size={hp(3)} />
                </View>
            </View> 

            <View
                style={{
                    width: '100%',
                    paddingHorizontal: wp(14),
                    marginBottom: hp(3),
                    marginTop: hp(3),
                }}
            >
                <Text style={styles.label}>Phone Number</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Phone Number"
                        numberOfLines={1}
                        onChangeText={(newText) => setPhone(newText)}
                    />
                    <Ionicons
                        name="phone-portrait"
                        color="black"
                        size={hp(3)}
                    />
                </View>
            </View>

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
                        onChangeText={(newText) => setEmail(newText)}
                    />
                    <Ionicons name="mail" color="black" size={hp(3)} />
                </View>
            </View>

            <View
                style={{
                    width: '100%',
                    paddingHorizontal: wp(14),
                    marginBottom: hp(3),
                }}
            >
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
            </View>

            <View
                style={{
                    width: '100%',
                    paddingHorizontal: wp(14),
                    marginBottom: hp(3),
                }}
            >
                <Text style={styles.label}>Confirm Password</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm Password"
                        numberOfLines={1}
                        secureTextEntry
                        onChangeText={(newText) => setConfirmPassword(newText)}
                    />
                    <Ionicons name="lock-closed" color="black" size={hp(3)} />
                </View>
            </View>

            <View style={{ gap: hp(3), marginTop: hp(0) }}>
                <TouchableOpacity style={styles.button} onPress={onSubmit}>
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Login

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#001C30',
        alignItems: 'center',
    },
    logo: {
        width: hp(20),
        height: hp(20),
        marginTop: hp(7),
    },

    logoText: {
        color: '#fff',
        fontSize: 32,
        fontWeight: 'bold',
    },
    title: {
        color: 'white',
        fontFamily: 'Poppins_700Bold',
        fontSize: hp(2.7),
        textAlign: 'center',
        marginTop: hp(6),
    },
    button: {
        backgroundColor: '#85CCE6',
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
        marginTop: hp(6),
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
        marginBottom: hp(0.5),
        fontFamily: 'Poppins_700Bold',
        fontSize: hp(1.7),
        marginLeft: wp(1),
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        height: hp(5),
        backgroundColor: 'white',
        alignItems: 'center',
        paddingHorizontal: wp(4),
        marginTop: hp(1), //chnages
        borderRadius: 12,
        marginBottom: hp(-1.1),
    },
    smallLabel: {
        color: 'white',
        fontSize: hp(1.9),
        fontFamily: 'Poppins_400Regular',
        textAlign: 'right',
    },
    line: {
        width: wp(40),
        height: hp(0.2),
        backgroundColor: 'white',
    },
})
