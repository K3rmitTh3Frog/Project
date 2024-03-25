import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView,TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../../constants';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { fetchUniqueEmails } from '../../../utils/routes';
import { useAppSelector } from '../../../store';
import { useRoute } from '@react-navigation/native'; 


import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'

type Email = {
    EmailID: string;
    Sender: string;
    Subject: string;
    ReceivedDate: string;
    IsPriority: number;
    Body: string;
};

const EmailDetailsScreen = () => {
    const { sessionId } = useAppSelector((state) => state.saved.master);
    const [email, setEmail] = useState<Email | null>(null);
    const route = useRoute(); 
    const router = useRouter();
    const { EmailID }: { EmailID?: string } = route.params || {};

    useEffect(() => {
        console.log(EmailID)
        const fetchEmailDetails = async () => {
            try {
                if (EmailID) { 
                    console.log(EmailID)
                    const response = await fetchUniqueEmails(EmailID, sessionId);
                    setEmail(response);
                }
            } catch (error) {
                console.error('Error fetching email details:', error);
            }
        };

        fetchEmailDetails();
    }, [EmailID, sessionId]);

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.goBackButton} onPress={() => router.push('/main/email')}>
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Email Details</Text>
                </View>
                {email && (
                    <>
                        <Text style={styles.label}>From:</Text>
                        <Text style={styles.content}>{email.Sender}</Text>

                        <Text style={styles.label}>Date:</Text>
                        <Text style={styles.content}>{email.ReceivedDate}</Text>

                        <Text style={styles.label}>Subject:</Text>
                        <Text style={styles.content}>{email.Subject}</Text>

                        <Text style={styles.label}>Body:</Text>
                        <Text style={styles.content}>{email.Body}</Text>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default EmailDetailsScreen;

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
    },
    scrollView: {
        paddingHorizontal: wp(4),
    },
    header: {
        alignItems: 'center',
        marginVertical: hp(2),
        marginTop: 50,
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
