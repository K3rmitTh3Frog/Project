import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TouchableWithoutFeedback } from 'react-native';
import { Image } from 'expo-image';
import { FlashList } from '@shopify/flash-list';
import { fetchEmailsNoRefresh } from '../../../utils/routes';
import { colors } from '../../../constants';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useAppSelector } from '../../../store';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router'; // Import useRouter if not already imported
import { StackNavigationProp } from '@react-navigation/stack';
import BottomNavBar from '../../../components/layout/BottomNavBar'

import { Ionicons } from '@expo/vector-icons';


type RootStackParamList = {
    EmailDetails: { EmailID: string };
};


type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EmailDetails'>;


type Email = {
    EmailID: string;
    Sender: string;
    Subject: string;
    isOpen: boolean;
};




const Index = () => {
    const [emails, setEmails] = useState<Email[]>([]);
    const { sessionId } = useAppSelector((state) => state.saved.master);
    const navigation = useNavigation<ProfileScreenNavigationProp>(); // Moved inside component body
    const router = useRouter();
    const itemBackgroundColorDefault =  '#21394B';
    const itemBackgroundColorOpen = '#556d80';
    useEffect(() => {
        const fetchEmailsData = async () => {
            try {
                const response = await fetchEmailsNoRefresh(sessionId);
                setEmails(response);
            } catch (error) {
                console.error('Error fetching email data:', error);
            }
        };

        fetchEmailsData();
    }, [sessionId]);
    const handleEmailPress = (EmailID: string) => {
        router.push({ pathname: `main/emailDetails`, params: { EmailID } });
    };   
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.goBackButton} onPress={() => router.push('/main/home')}>
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <View style={{ alignItems: 'center', marginTop: hp(12) }}>
                <Text style={styles.title}>{'Email Highlights'}</Text>
                <Image
                    source={require('../../../assets/email.png')}
                    style={styles.image}
                />
                <View
                    style={{
                        width: '100%',
                        height: '72%',
                        paddingHorizontal: wp(2),
                        paddingTop: hp(5),
                        paddingBottom:-100,
                        
                    }}
                >
                    <FlashList
                        data={emails}
                        ItemSeparatorComponent={() => (
                            <View style={{ width: '100%', height: hp(2.1) }} />
                        )}
                        estimatedItemSize={hp(9.2)}
                        renderItem={({ item, index }) => (
                            <TouchableWithoutFeedback onPress={() => handleEmailPress(item.EmailID)}>
                                <View style={[styles.item, {backgroundColor: item.isOpen ? itemBackgroundColorOpen : itemBackgroundColorDefault}]} key={index}>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            gap: wp(4.2),
                                        }}
                                    >
                                        <Image
                                            source={require('../../../assets/uowd.svg')}
                                            style={styles.itemImage}
                                        />
                                        <View>
                                            <Text
                                                style={styles.itemSender}
                                                numberOfLines={1}
                                            >{`from: ${item.Sender}`}</Text>
                                            <Text
                                                numberOfLines={1}
                                                style={styles.itemSubject}
                                            >{`subject: ${item.Subject}`}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.itemButton}>
                                        <Image
                                            source={require('../../../assets/chevron-right.svg')}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                            }}
                                        />
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        )}
                    />
                </View>
                
            </View>
            <BottomNavBar />
        </View>
        
    );
};

export default Index;

const styles = StyleSheet.create({
    goBackButton: {
        position: 'absolute',
        top: 35,
        left: 20,
        zIndex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: colors.bg,
        paddingBottom: 0,
    },
    title: {
        fontFamily: 'Poppins_700Bold',
        color: 'white',
        fontSize: hp(3),
    },
    image: {
        width: hp(7),
        height: hp(5),
        marginTop: hp(2),
    },
    item: {
        backgroundColor: colors['brand-200'],
        borderRadius: 35,
        width: '100%',
        paddingHorizontal: wp(9),
        paddingVertical: hp(2),
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(2),
        justifyContent: 'space-between',
    },
    itemImage: {
        width: hp(5),
        height: hp(5),
    },
    itemSender: {
        fontFamily: 'Poppins_700Bold',
        fontSize: hp(1.8),
        color: 'white',
        maxWidth: wp(52),
    },
    itemSubject: {
        fontFamily: 'Poppins_400Regular',
        fontSize: hp(1.6),
        color: colors.grey,
        maxWidth: wp(52),
    },
    itemButton: {
        width: hp(3.8),
        height: hp(3.8),
    },
});
