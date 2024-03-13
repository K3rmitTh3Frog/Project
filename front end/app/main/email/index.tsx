import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Image } from 'expo-image';
import { FlashList } from '@shopify/flash-list';
import { fetchEmailsNoRefresh } from '../../../utils/routes';
import { colors } from '../../../constants';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { useAppSelector } from '../../../store';


type Email = {
    Sender: string;
    Subject: string;
};

const Index = () => {
    const [emails, setEmails] = useState<Email[]>([]);
    const { sessionId } = useAppSelector((state) => state.saved.master);

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
    }, [sessionId]); // Add sessionId as a dependency

    return (
        <View style={styles.container}>
            <View style={{ alignItems: 'center', marginTop: hp(12) }}>
                <Text style={styles.title}>{'Email Highlights'}</Text>
                <Image
                    source={require('../../../assets/email.png')}
                    style={styles.image}
                />

                <View
                    style={{
                        width: '100%',
                        height: '86%',
                        paddingHorizontal: wp(2),
                        paddingTop: hp(5),
                    }}
                >
                    <FlashList
                        data={emails}
                        ItemSeparatorComponent={() => (
                            <View style={{ width: '100%', height: hp(2.1) }} />
                        )}
                        estimatedItemSize={hp(9.2)}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity style={styles.item} key={index}>
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
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </View>
        </View>
    );
};

export default Index;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: colors.bg,
        marginBottom: 0, 
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
