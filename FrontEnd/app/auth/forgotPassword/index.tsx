import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { resetPassword } from '../../../utils/routes';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { colors } from '../../../constants'; // Ensure this path matches your project structure

const ForgotPassword: React.FC = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');

    const handleResetPassword = async () => {
        try {
            const response = await resetPassword(email);
            if (response.success) {
                Alert.alert('Reset Link Sent', 'Please check your email for the reset link.');
            } else {
                Alert.alert('Error', response.message || 'An error occurred while sending the reset link.');
            }
        } catch (error) {
            console.error('Error sending reset link:', error);
            Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.subtitle}>
                Enter your email to reset your password
            </Text>

            <View style={styles.inputSection}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <Ionicons
                        name="mail-outline"
                        color="#001C30"
                        size={hp(3)}
                    />
                </View>
            </View>

            <TouchableOpacity
                style={styles.button}
                onPress={handleResetPassword}
            >
                <Text style={styles.buttonText}>Send Reset Link</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.backToLoginButton}
                onPress={() => router.navigate('/auth/login')}
            >
                <Text style={styles.backToLoginText}>Back to Login</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ForgotPassword;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#001C30',
        alignItems: 'center',
        justifyContent: 'center',
        padding: wp(4),
    },
    title: {
        color: 'white',
        fontFamily: 'Poppins_700Bold',
        fontSize: hp(3),
        marginBottom: hp(2),
    },
    subtitle: {
        color: '#85CCE6',
        fontFamily: 'Poppins_400Regular',
        fontSize: hp(2),
        marginBottom: hp(4),
        textAlign: 'center',
    },
    inputSection: {
        width: '100%',
        paddingHorizontal: wp(14),
    },
    label: {
        color: 'white',
        fontFamily: 'Poppins_700Bold',
        fontSize: hp(1.4),
        marginBottom: hp(1),
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: wp(4),
        borderRadius: 12,
        height: hp(6),
    },
    input: {
        flex: 1,
        height: '100%',
    },
    button: {
        backgroundColor: '#85CCE6',
        borderRadius: 100,
        width: wp(70),
        height: hp(6),
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: hp(4),
        shadowColor: '#95adfe',
        shadowOffset: { width: 0, height: 18 },
        shadowOpacity: 0.25,
        shadowRadius: 20.0,
        elevation: 24,
    },
    buttonText: {
        color: '#E6F7FD',
        fontFamily: 'Poppins_700Bold',
        fontSize: hp(2),
    },
    backToLoginButton: {
        marginTop: hp(3),
    },
    backToLoginText: {
        color: '#85CCE6',
        fontFamily: 'Poppins_400Regular',
        fontSize: hp(2),
    },
})
