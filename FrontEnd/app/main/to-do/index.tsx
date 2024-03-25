import {
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import BottomNavBar from '../../../components/layout/BottomNavBar'
import { colors } from '../../../constants'
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen'
import moment from 'moment'
import { Ionicons } from '@expo/vector-icons'
import List from '../../../components/to-do/List'
import * as Calendar from 'expo-calendar'
import { useAppDispatch, useAppSelector } from '../../../store'
import { setCalendarId } from '../../../store/reducers/MasterReducer'

type Props = {}

const index = (props: Props) => {
    const [weekDays, setWeekDays] = useState<Date[]>([])
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())
    const [weekIndex, setWeekIndex] = useState(0)
    const [isGranted, setGranted] = useState(false)

    const { calendarId } = useAppSelector((state) => state.saved.master)
    const dispatch = useAppDispatch()

    const getAccess = async () => {
        const { granted: calendarGranted } =
            await Calendar.requestCalendarPermissionsAsync()
        let granted = true
        if (Platform.OS == 'ios') {
            const { granted: reminderGranted } =
                await Calendar.requestRemindersPermissionsAsync()
            granted = reminderGranted
        }
        setGranted(granted && calendarGranted)
        return granted
    }

    useEffect(() => {
        getAccess()
    }, []) // upon start

    const getCalendarId = async () => {
        const calendars = await Calendar.getCalendarsAsync()
        const calendarExists = calendars.find(
            (calendar) => calendar.id == calendarId
        )
        if (!calendarExists) {
            const defaultCalendarSource =
                Platform.OS === 'ios'
                    ? (await Calendar.getDefaultCalendarAsync()).source
                    : { isLocalAccount: true, name: 'Expo Calendar' }

            const newCalendarId = await Calendar.createCalendarAsync({
                title: 'Saturday',
                color: 'blue',
                entityType: Calendar.EntityTypes.EVENT,
                // sourceId: defaultCalendarSource.id,
                //@ts-ignore
                source: defaultCalendarSource,
                name: 'Saturday',
                ownerAccount: 'personal',
                accessLevel: Calendar.CalendarAccessLevel.OWNER,
            })
            dispatch(setCalendarId(newCalendarId))
        }
    }

    useEffect(() => {
        if (isGranted) {
            getCalendarId()
        }
    }, [isGranted]) // whenever isGranted changes value

    useEffect(() => {
        const days: Date[] = []

        // Get the start of the current week (Sunday)
        const currDay = moment().add(weekIndex, 'weeks')

        const startOfWeek = currDay.subtract(1, 'days').startOf('week')

        // Loop through each day of the week
        for (let i = 1; i <= 7; i++) {
            const currentDay = moment(startOfWeek).add(i, 'days')
            days.push(currentDay.toDate())
        }

        // Set the state with the days of the week
        setWeekDays([...days])
    }, [weekIndex])

    return (
        <View style={styles.container}>
            <View style={{ alignItems: 'center', marginTop: hp(12) }}>
                <Text style={styles.title}>{'To-do List'}</Text>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        paddingHorizontal: wp(4),
                        marginTop: hp(2),
                    }}
                >
                    <Text style={styles.date}>
                        {moment().add(weekIndex, 'weeks').format('YYYY, MMMM')}
                    </Text>

                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: wp(4),
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => setWeekIndex((prev) => prev + -1)}
                        >
                            <Ionicons
                                name="chevron-back"
                                size={24}
                                color={colors['brand-100']}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setWeekIndex((prev) => prev + 1)}
                        >
                            <Ionicons
                                name="chevron-forward"
                                size={24}
                                color={colors['brand-100']}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.list}>
                    {weekDays.map((item, index) => {
                        return (
                            <TouchableOpacity
                                style={[
                                    styles.listItem,
                                    {
                                        borderBottomWidth: hp(0.3),
                                        borderBottomColor:
                                            selectedDate.toLocaleDateString(
                                                'en-Us'
                                            ) ==
                                            item.toLocaleDateString('en-Us')
                                                ? colors['brand-100']
                                                : 'transparent',
                                    },
                                ]}
                                onPress={() => setSelectedDate(item)}
                                key={index}
                            >
                                <Text style={styles.listText}>
                                    {moment(item).format('ddd')}
                                </Text>
                                <Text style={styles.listText}>
                                    {item.getDate()}
                                </Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>
                {isGranted ? (
                    <List currDate={selectedDate} />
                ) : (
                    <TouchableOpacity
                        onPress={getAccess}
                        style={{
                            position: 'absolute',
                            left: wp(26),
                            top: hp(40),
                        }}
                    >
                        <Text style={styles.date}>
                            {'Request Calendar Access'}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
            <BottomNavBar />
        </View>
    )
}

export default index

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: colors.bg,
    },
    title: {
        fontFamily: 'Poppins_700Bold',
        color: 'white',
        fontSize: hp(3),
    },
    date: {
        color: 'white',
        fontFamily: 'Poppins_500Medium',
        fontSize: hp(1.8),
    },
    list: {
        backgroundColor: colors['brand-200'],
        alignItems: 'center',
        flexDirection: 'row',
        width: '100%',
        paddingVertical: hp(1),
        justifyContent: 'space-between',
        marginTop: hp(2),
        paddingHorizontal: wp(4),
    },
    listItem: {
        alignItems: 'center',
        width: wp(10),
    },
    listText: {
        color: 'white',
        fontFamily: 'Poppins_400Regular',
        fontSize: hp(2),
    },
})
