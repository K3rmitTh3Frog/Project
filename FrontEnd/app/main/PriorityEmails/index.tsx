import React, { useState, useEffect } from 'react'
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    ActivityIndicator,
    TextInput
} from 'react-native'
import { colors } from '../../../constants'
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen'
import { fetchPriorityEmails,deletePriorityEmail,addPriorityEmail } from '../../../utils/routes';
import { useAppSelector } from '../../../store';
import BottomNavBar from '../../../components/layout/BottomNavBar'

import { Ionicons } from '@expo/vector-icons'; 
import { useRouter } from 'expo-router'

interface Email {
    PriorityID: number;
    EmailAddress: string;
    UserID:number;
}

const PriorityEmailScreen = () => {
    const [emails, setEmails] = useState<Email[]>([]);
    const [loading, setLoading] = useState(false);
    const { sessionId } = useAppSelector((state) => state.saved.master);
    const [newEmail, setNewEmail] = useState('')
    const router = useRouter();
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
    
    const handleAddEmail = async (Email: string) => {
        console.log(Email)
            try {
                await addPriorityEmail(Email,sessionId);
            } catch (error) {
                console.error('Error deleting the priority email:', error);
            } finally {
                setLoading(false);
            } 
    }

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.goBackButton} onPress={() => router.push('/main/Settings')}>
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
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
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        onChangeText={setNewEmail}
                        value={newEmail}
                        placeholder="Add new email address"
                        placeholderTextColor="#999"
                    />
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => handleAddEmail(newEmail)}
                    >
                        <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <BottomNavBar />
        </SafeAreaView>
    )
}

export default PriorityEmailScreen

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
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp(2),
    },
    input: {
        backgroundColor: 'white',
        borderRadius: 5,
        paddingVertical: hp(1),
        paddingHorizontal: wp(2),
        flex: 1,
        marginRight: wp(2),
        fontFamily: 'Poppins_400Regular',
        fontSize: hp(2),
        borderWidth: 1,
        borderColor: '#ccc',
    },
})
