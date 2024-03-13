import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import moment from 'moment'
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen'
import { FlashList } from '@shopify/flash-list'
import { colors } from '../../constants'
import { Ionicons } from '@expo/vector-icons'
import * as Calendar from 'expo-calendar'
import { useAppDispatch, useAppSelector } from '../../store'
import { toggleEventId } from '../../store/reducers/ToDoReducer'

type Props = {
    currDate: Date
}

const List = ({ currDate }: Props) => {
    const [events, setEvents] = useState<Calendar.Event[]>([])
    const { calendarId } = useAppSelector((state) => state.saved.master)
    const { completedEventIds } = useAppSelector((state) => state.saved.todo)
    const dispatch = useAppDispatch()

    const getEvents = async () => {
        const startDate = moment(currDate).startOf('day').toDate()
        const endDate = moment(currDate).endOf('day').toDate()

        const newEvents = await Calendar.getEventsAsync(
            [calendarId],
            startDate,
            endDate
        )
        setEvents([...newEvents])
    }

    useEffect(() => {
        if (calendarId) {
            getEvents()
        }
    }, [currDate])

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.date}>
                    {moment(currDate).format('dddd, MMMM, DD')}
                </Text>
            </View>
            <View
                style={{
                    width: '100%',
                    height: hp(45),
                    marginTop: hp(2),
                }}
            >
                <FlashList
                    data={events}
                    extraData={[completedEventIds]}
                    ItemSeparatorComponent={() => (
                        <View style={{ width: '100%', height: hp(2) }} />
                    )}
                    renderItem={({ item }) => {
                        const completed = completedEventIds.includes(item.id)
                        return (
                            <TouchableOpacity
                                style={styles.listItem}
                                key={item.id}
                                onPress={() => dispatch(toggleEventId(item.id))}
                            >
                                <View style={styles.listItemDateContainer}>
                                    <Text style={styles.listItemDate}>
                                        {moment(item.startDate).format('DD')}
                                        {'\n'}
                                        {moment(item.startDate).format('MMM')}
                                    </Text>
                                </View>
                                <View style={{ gap: hp(0.4) }}>
                                    <Text
                                        style={styles.listItemTitle}
                                        numberOfLines={1}
                                    >
                                        {item.title}
                                    </Text>
                                    <Text
                                        style={styles.listItemDesc}
                                        numberOfLines={2}
                                    >
                                        {item.notes}
                                    </Text>
                                    <Text
                                        style={styles.listItemLoc}
                                        numberOfLines={1}
                                    >
                                        {item.location}
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        position: 'absolute',
                                        top: hp(1),
                                        right: wp(3),
                                        backgroundColor: completed
                                            ? colors['brand-100']
                                            : 'transparent',
                                        borderRadius: 3,
                                        transform: [{ rotate: '45deg' }],
                                        borderColor: colors['brand-100'],
                                        borderWidth: 2,
                                        width: hp(2.5),
                                        height: hp(2.5),
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {completed && (
                                        <Ionicons
                                            name="checkmark"
                                            color={colors.bg}
                                            size={hp(2.4)}
                                            style={{
                                                transform: [
                                                    { rotate: '-45deg' },
                                                ],
                                            }}
                                        />
                                    )}
                                </View>
                            </TouchableOpacity>
                        )
                    }}
                    estimatedItemSize={200}
                />
            </View>
        </View>
    )
}

export default List

const styles = StyleSheet.create({
    container: {
        marginTop: hp(6),
        width: '100%',
        paddingHorizontal: wp(4),
    },
    date: {
        color: 'white',
        fontSize: hp(1.8),
        fontFamily: 'Poppins_700Bold',
    },
    listItem: {
        borderRadius: hp(1.5),
        backgroundColor: colors['brand-200'],
        paddingHorizontal: wp(3),
        paddingVertical: hp(2),
        flexDirection: 'row',
        gap: wp(2),
        alignItems: 'center',
    },
    listItemDateContainer: {
        backgroundColor: colors['brand-100'],
        width: hp(6),
        alignItems: 'center',
        justifyContent: 'center',
        height: hp(6),
        borderRadius: hp(1.5),
    },
    listItemDate: {
        color: 'white',
        fontFamily: 'Poppins_700Bold',
        fontSize: hp(1.8),
        textAlign: 'center',
        lineHeight: 18,
    },
    listItemTitle: {
        fontFamily: 'Poppins_700Bold',
        fontSize: hp(1.7),
        color: 'white',
    },
    listItemDesc: {
        fontFamily: 'Poppins_500Medium',
        fontSize: hp(1.4),
        color: 'white',
        width: wp(68),
    },
    listItemLoc: {
        fontFamily: 'Poppins_500Medium',
        fontSize: hp(1.4),
        color: colors.grey,
    },
})
