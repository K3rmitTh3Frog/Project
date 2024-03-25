import { StyleSheet, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { colors } from '../../constants'
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen'
import CustomToggleButton from '../drawer/CustomToggleButton'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

type Props = {}

const BottomNavBar = (props: Props) => {
    const router = useRouter()
    return (
        <View style={styles.container}>
            <View style={{ paddingVertical: hp(3.5) }}>
                <CustomToggleButton color={'white'} size={hp(4)} />
            </View>

            <View
                style={{
                    backgroundColor: 'white',
                    borderRadius: 9999999,
                    height: hp(7),
                    width: hp(7),
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: hp(1),
                }}
            >
                <TouchableOpacity onPress={() => router.push('/main/chatbot')}>
                    <Ionicons 
                        name="mic"
                        size={hp(4)}
                        color={colors['brand-100']}
                        style={{}}
                    />
                </TouchableOpacity>
                
            </View>
            <TouchableOpacity style={{ paddingVertical: hp(3.5) }} onPress={() => router.push('/main/home')}>
                <Ionicons name="home" size={hp(4)} color={'white'} style={{}} />
            </TouchableOpacity >
        </View>
    )
}

export default BottomNavBar

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors['brand-100'],
        borderTopRightRadius: hp(4),
        borderTopLeftRadius: hp(4),
        height: hp(12),
        paddingHorizontal: wp(8),
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
})
