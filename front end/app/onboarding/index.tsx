import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen'

type Props = {}

const Saturday = (props: Props) => {
    const router = useRouter()
    return (
        <View style={styles.container}>
            <Image
                source={require('../../assets/logo.png')}
                style={styles.logo}
                contentFit="cover"
            />

            <Text style={styles.title}>
                {'Your Personalized\nAI Assistant'}
            </Text>
            <View style={{ gap: hp(3), marginTop: hp(12) }}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.push('/auth/login')}
                >
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.push('/auth/register')}
                >
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Saturday

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
        width: hp(30),
        height: hp(30),
        marginTop: hp(16),
    },

    logoText: {
        color: '#fff',
        fontSize: 32,
        fontWeight: 'bold',
        // Add styles for your logo text if needed
    },
    title: {
        color: '#97E4FF',
        fontFamily: 'Poppins_700Bold',
        fontSize: hp(3.5),
        textAlign: 'center',
        marginTop: hp(6),
    },
    button: {
        backgroundColor: '#85CCE6', //button background color
        borderRadius: 100,
        width: wp(40),
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
})
