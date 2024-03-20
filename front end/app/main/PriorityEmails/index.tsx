import React, { useState, useEffect } from 'react'
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../../../constants'
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen'
import { fetchPriorityEmails,deletePriorityEmail } from '../../../utils/routes';
import { useAppSelector } from '../../../store';

interface Email {
    PriorityID: number;
    EmailAddress: string;
    UserID:number;
}

const PriorityEmailScreen = () => {
    const [emails, setEmails] = useState<Email[]>([]);
    const [loading, setLoading] = useState(false);
    const { sessionId } = useAppSelector((state) => state.saved.master);

    useEffect(() => {
        fetchInitialEmails(sessionId);
    }, [sessionId]);

    const fetchInitialEmails = async (sessionId: string) => {
        setLoading(true);
        try {
            const response = await fetchPriorityEmails(sessionId);
            setEmails(response);
        } catch (error) {
            console.error('Error fetching priority email data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteEmail = async (emailId: number) => {
        setLoading(true);
        try {
            await deletePriorityEmail(emailId, sessionId);
        } catch (error) {
            console.error('Error deleting the priority email:', error);
        } finally {
            setLoading(false);
        }
        console.log(emailId);
    };
    

    const handleAddMore = async () => {
        console.log('add');
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>
                        Priority Email Addresses
                    </Text>
                </View>
                {loading && <ActivityIndicator size="large" color={colors['brand-100']} />}
                {emails.map((email) => (
                    <View key={email.PriorityID} style={styles.emailItem}>
                        <Text style={[styles.sender, { flex: 0 }]}>
                            {email.EmailAddress}
                        </Text>
                        <TouchableOpacity
                            onPress={() => handleDeleteEmail(email.PriorityID)}
                        >
                            <Ionicons
                                name="remove-circle"
                                size={hp(2.5)}
                                color={colors['brand-100']}
                            />
                        </TouchableOpacity>
                    </View>
                ))}
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={handleAddMore}
                >
                    <Text style={styles.addButtonText}>Add More</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    )
}

export default PriorityEmailScreen

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
        marginVertical: hp(6),
    },
    headerText: {
        fontFamily: 'Poppins_700Bold',
        fontSize: hp(2.6),
        color: colors['brand-100'],
    },
    emailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors['brand-200'],
        borderRadius: 10,
        padding: hp(2),
        marginBottom: hp(1),
        marginTop: hp(1),
    },
    sender: {
        fontFamily: 'Poppins_400Regular',
        fontSize: hp(2),
        color: 'white',

        textAlign: 'left',
        flex: 1, //icon
    },
    addButton: {
        backgroundColor: colors['brand-100'],
        padding: hp(2),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginTop: hp(2),
    },
    addButtonText: {
        fontFamily: 'Poppins_700Bold',
        fontSize: hp(1.8),
        color: 'white',
    },
})
