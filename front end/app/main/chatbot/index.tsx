import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import React, { useRef, useState } from 'react'
import { colors } from '../../../constants'
import CustomToggleButton from '../../../components/drawer/CustomToggleButton'
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen'
import { Image } from 'expo-image'
import { FlashList } from '@shopify/flash-list'

type Props = {}

const index = (props: Props) => {
    const [messages, setMessages] = useState([
        {
            message: "Hey there, Let's get you started!",
            user_id: 1,
        },
        {
            message: 'Could you check my calendar for Firday please?',
            user_id: 2,
        },
        {
            message:
                "Of course! On Friday, January 26th, you have:\n10:00 - Doctor's appointment\n18:00 - Driving exam",
            user_id: 1,
        },
        {
            message: "Hey there, Let's get you started!",
            user_id: 1,
        },
        {
            message: 'Could you check my calendar for Firday please?',
            user_id: 2,
        },
        {
            message:
                "Of course! On Friday, January 26th, you have:\n10:00 - Doctor's appointment\n18:00 - Driving exam",
            user_id: 1,
        },
        {
            message: "Hey there, Let's get you started!",
            user_id: 1,
        },
        {
            message: 'Could you check my calendar for Firday please?',
            user_id: 2,
        },
        {
            message:
                "Of course! On Friday, January 26th, you have:\n10:00 - Doctor's appointment\n18:00 - Driving exam",
            user_id: 1,
        },
    ])

    const [isLoaded, setLoaded] = useState(false)

    const ref = useRef<FlashList<{ message: string; user_id: number }>>(null!)

    const [currInput, setInput] = useState('')

    const onSubmit = () => {
        setMessages((prev) => [...prev, { message: currInput, user_id: 2 }])
        setInput('')
    }

    const scrollToBottom = () => {
        ref.current.scrollToEnd({ animated: true })
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
                    ref={ref}
                    data={messages}
                    ItemSeparatorComponent={() => (
                        <View style={{ width: '100%', height: hp(3) }} />
                    )}
                    onLoad={() => setLoaded(true)}
                    estimatedItemSize={hp(9)}
                    onContentSizeChange={scrollToBottom}
                    renderItem={({ item, index }) => {
                        const { message, user_id } = item
                        return (
                            <View
                                style={{
                                    flexDirection:
                                        user_id == 1 ? 'row' : 'row-reverse',
                                    gap: wp(3),
                                    alignItems: 'center',
                                }}
                                key={index}
                            >
                                <Image
                                    source={
                                        user_id == 1
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
