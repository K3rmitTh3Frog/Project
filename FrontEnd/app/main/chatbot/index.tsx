import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { colors } from '../../../constants'
import CustomToggleButton from '../../../components/drawer/CustomToggleButton'
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen'
import { Image } from 'expo-image'
import { FlashList } from '@shopify/flash-list'
import { fetchChatBotMessages,chatWithChatBot } from '../../../utils/routes';
import { useAppSelector } from '../../../store';


type Message = {
    ChatID: number;
    Date: string;
    UserID: string;
    isUser: boolean;
    message: string;
}

const index = () => {
    const { sessionId } = useAppSelector((state) => state.saved.master);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoaded, setLoaded] = useState(false);
    const [currInput, setInput] = useState('');

    useEffect(() => {
        
        const fetchMessages = async () => {
            try {
                const fetchedMessages = await fetchChatBotMessages(sessionId);
                
                // Update the messages state
                setMessages(prevMessages => [...prevMessages, ...fetchedMessages]);
                
                
                setLoaded(true); // Set loaded to true after updating messages
            } catch (error) {
                console.error('Error fetching chat messages:', error);
            }
        };
        fetchMessages()
    }, [sessionId]);


    

    const onSubmit = () => {
        const sendMessages = async () => {
            try {
                await chatWithChatBot(currInput, sessionId);
                const fetchedMessages = await fetchChatBotMessages(sessionId);
        
                setMessages(fetchedMessages);
                setInput('');
            } catch (error) {
                console.error('Error fetching chat messages:', error);
            }
        };
        sendMessages()
    }

    const scrollToBottom = () => {
        // Do whatever you need to do to scroll to the bottom
    }

    return (
        <View style={styles.container}>
            <View style={{ paddingHorizontal: wp(4) }}>
                <CustomToggleButton color={'white'} size={hp(4)} />
                <Image
                    source={require('../../../assets/logo.png')}
                    style={styles.logo}
                />
            </View>
            <View style={styles.containertwo}>
                <FlashList
                    data={messages.map(msg => ({ ...msg, isUser: Boolean(msg.isUser) }))}
                    ItemSeparatorComponent={() => (
                        <View style={{ width: '100%', height: hp(3) }} />
                    )}
                    onLoad={() => setLoaded(true)}
                    estimatedItemSize={hp(9)}
                    onContentSizeChange={scrollToBottom}
                    renderItem={({ item, index }) => {
                        const { message, isUser } = item
                        return (
                            <View
                                style={{
                                    flexDirection: isUser === true ? 'row' : 'row-reverse',
                                    gap: wp(3),
                                    alignItems: 'center',
                                }}
                                key={index}
                            >
                                <Image
                                    source={
                                        isUser == false
                                            ? require('../../../assets/logo.png')
                                            : require('../../../assets/avatar.svg')
                                    }
                                    style={styles.icon}
                                />
                                <View style={styles.textContainer}>
                                    <Text style={styles.text}>{message}</Text>
                                </View>
                            </View>
                        )
                    }}
                />

                <View
                    style={{
                        width: '100%',
                        height: hp(6),
                        backgroundColor: '#00000040',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingHorizontal: wp(4),
                        paddingVertical: hp(1),
                        borderRadius: 40,
                    }}
                >
                    <TextInput
                        style={styles.input}
                        placeholder="Click here to type..."
                        placeholderTextColor={'white'}
                        onSubmitEditing={onSubmit}
                        onChangeText={(newText) => setInput(newText)}
                        value={currInput}
                    />
                    <TouchableOpacity style={styles.button} onPress={onSubmit}>
                        <Image
                            source={require('../../../assets/send.svg')}
                            style={{ width: '100%', height: '100%' }}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default index

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bg,
        paddingTop: hp(6),
    },
    logo: {
        width: hp(20),
        height: hp(20),
        alignSelf: 'center',
    },
    icon: {
        width: hp(5),
        height: hp(5),
        borderRadius: 10,
    },
    text: {
        fontFamily: 'Poppins_400Regular',
        fontSize: hp(1.8),
        color: 'white',
    },
    textContainer: {
        borderRadius: 20,
        maxWidth: wp(75),
        paddingHorizontal: wp(2),
        paddingVertical: hp(1),
        backgroundColor: colors['brand-300'],
    },
    input: {
        width: wp(70),
        height: '100%',
        color: 'white',
    },
    button: {
        width: hp(3),
        height: hp(3),
    },
    containertwo: {
        width: '100%',
        height: hp(70),
        backgroundColor: colors['brand-200'],
        justifyContent: 'space-between',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: wp(4),
        paddingTop: hp(2),
        paddingBottom: hp(4),
        gap: hp(2),
    },
})
