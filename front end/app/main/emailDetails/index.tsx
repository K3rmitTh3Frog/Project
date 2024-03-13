import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../../constants';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

// Assuming EmailDetails is the type containing all necessary email information
type EmailDetails = {
    sender: string;
    date: string;
    subject: string;
    body: string;
};

// Props type if you're passing the email details as a prop
type Props = {
    email: EmailDetails;
};

// Function to generate a random email
const generateRandomEmail = (): EmailDetails => {
    const senderList = ['example1@example.com', 'example2@example.com', 'example3@example.com'];
    const subjectList = ['Meeting Reminder', 'Important Announcement', 'Your Order Confirmation'];
    const bodyList = ['This is the body of the email.', 'Please find attached the document.', 'Let us know if you have any questions.'];

    const randomIndex = (array: any[]) => Math.floor(Math.random() * array.length);

    return {
        sender: senderList[randomIndex(senderList)],
        date: new Date().toLocaleDateString(),
        subject: subjectList[randomIndex(subjectList)],
        body: bodyList[randomIndex(bodyList)],
    };
};

const EmailDetailsScreen = ({ email }: Props) => {
    // Generate a random email
    const randomEmail = generateRandomEmail();

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Email Details</Text>
                </View>
                <Text style={styles.label}>From:</Text>
                <Text style={styles.content}>{randomEmail.sender}</Text>

                <Text style={styles.label}>Date:</Text>
                <Text style={styles.content}>{randomEmail.date}</Text>

                <Text style={styles.label}>Subject:</Text>
                <Text style={styles.content}>{randomEmail.subject}</Text>

                <Text style={styles.label}>Body:</Text>
                <Text style={styles.content}>{randomEmail.body}</Text>
            </ScrollView>
        </SafeAreaView>
    );
};

export default EmailDetailsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bg,
    },
    scrollView: {
        paddingHorizontal: wp(4),
    },
    header: {
        alignItems: 'center',
        marginVertical: hp(2),
        marginTop:50,
    },
    headerText: {
        fontFamily: 'Poppins_700Bold',
        fontSize: hp(2.6),
        color: 'white',
    },
    label: {
        fontFamily: 'Poppins_700Bold',
        fontSize: hp(2),
        color: colors['brand-100'],
        marginTop: hp(2),
    },
    content: {
        fontFamily: 'Poppins_400Regular',
        fontSize: hp(1.8),
        color: 'white',
        marginBottom: hp(1),
    },
});
