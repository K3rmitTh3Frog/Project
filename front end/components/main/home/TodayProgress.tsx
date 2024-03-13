import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from '../../../constants'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import * as Progress from 'react-native-progress'

type Props = {
    totalProgress: number; // Define totalProgress as a prop
}

const TodayProgress = ({ totalProgress }: Props) => { // Destructure totalProgress from props
    return (
        <View style={styles.container}>
            <View
                style={{
                    flexDirection: 'row',
                    gap: wp(4),
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Text style={styles.title}>{"Today's progress"}</Text>
                <Progress.Circle
                    progress={totalProgress} 
                    color="white"
                    size={hp(2.5)}
                    borderWidth={0}
                    unfilledColor={colors.bg}
                    style={{
                        transform: [{ rotate: '90deg' }],
                    }}
                />
            </View>
            <Progress.Bar
                progress={totalProgress} // Use totalProgress here as well
                width={wp(80)}
                color={colors['brand-100']}
                borderWidth={0}
                unfilledColor={colors.bg}
                height={hp(1)}
            />
        </View>
    )
}

export default TodayProgress

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors['brand-200'],
        borderRadius: hp(2),
        alignItems: 'center',
        paddingTop: hp(1.5),
        paddingBottom: hp(3),
        gap: hp(2),
        marginTop: hp(3),
    },
    title: {
        color: 'white',
        fontFamily: 'Poppins_700Bold',
    },
})
