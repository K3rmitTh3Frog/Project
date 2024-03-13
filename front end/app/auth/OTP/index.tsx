import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { OtpInput } from 'react-native-otp-entry'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import { verifyOTP } from '../../../utils/routes'
import { useAppDispatch, useAppSelector } from '../../../store'
import { setSessionId } from '../../../store/reducers/MasterReducer'

const OTPScreen = () => {
    const router = useRouter();
    const { phone } = useAppSelector((state) => state.normal.credentials);
    const { sessionId } = useAppSelector((state) => state.saved.master);
    const dispatch = useAppDispatch();

    const onVerifyOTP = async (OTP: string) => {
        try {
            const data = await verifyOTP(OTP, sessionId);
            router.push('/main/home');
        } catch (e: any) {
            const message = e?.response?.data?.message ?? 'An error has occurred';
            Alert.alert(message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.otpMessage}>
                Enter the OTP sent to your number
            </Text>
            <OtpInput
                numberOfDigits={6}
                onFilled={onVerifyOTP}
                onTextChange={(text) => console.log(text)}
                theme={{
                    inputsContainerStyle: styles.otpInputContainer,
                    pinCodeTextStyle: styles.otpInput,
                }}
            />
            <TouchableOpacity style={styles.continueButton} onPress={() => {}}>
                <Text style={styles.continueText}>Verify OTP</Text>
            </TouchableOpacity>
        </View>
    );
};


export default OTPScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#001C30',
        alignItems: 'center',
        justifyContent: 'center',
    },
    otpMessage: {
        fontSize: hp(2.5),
        color: '#E6F7FD',
        textAlign: 'center',
        marginBottom: hp(5),
    },
    otpInputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '80%',
        height: hp(8),
        marginVertical: hp(2),
    },
    otpInput: {
        width: wp(11),
        height: hp(6.9),
        borderColor: '#85CCE6',
        borderWidth: 2,
        borderRadius: 10,
        color: '#85CCE6', // Text color for the input
        fontSize: hp(2.5), // Increase font size for better readability
        padding: wp(3), // Padding to ensure text is centered, adjust as needed
        textAlign: 'center', // Ensure text is centered
    },
    continueButton: {
        backgroundColor: '#85CCE6',
        borderRadius: 20,
        paddingVertical: hp(2),
        paddingHorizontal: wp(10),
        marginTop: hp(4),
    },
    continueText: {
        color: '#FFFFFF',
        fontSize: hp(2),
    },
})
