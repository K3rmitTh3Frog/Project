import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Alert } from 'react-native';
import { colors } from '../../../constants';
import BottomNavBar from '../../../components/layout/BottomNavBar';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import TodayProgress from '../../../components/main/home/TodayProgress';
import Categories from '../../../components/main/home/Categories';
import { fetchUserData, StatisticsCalendar, StatisticsToDoList, StatisticsEmail } from '../../../utils/routes';
import { useAppSelector } from '../../../store'; //import for sessionID

type Props = {};

const Index = (props: Props) => {
    const [userName, setUserName] = useState('');
    const [calendarStats, setCalendarStats] = useState({ past_events_today: 0, future_events_today: 0 });
    const [toDoListStats, setToDoListStats] = useState({ complete_count: 0, in_progress_count: 0, not_started_count: 0, total: 0 });
    const [emailStats, setEmailStats] = useState({ unopened_emails_today: 0, opened_emails_today: 0, total: 0 });
    const { sessionId } = useAppSelector((state) => state.saved.master);
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await fetchUserData(sessionId);
                if (userData && userData.name) {
                    setUserName(userData.name);
                } else {
                    setUserName('Guest');
                }
            } catch (error) {
                console.error(error);
                Alert.alert('Error', 'Failed to fetch user data');
                setUserName('Guest');
            }
        };

        const fetchStatistics = async () => {
            try {
                const userData = await fetchUserData(sessionId);
                const calendarData = await StatisticsCalendar(userData);
                setCalendarStats(calendarData);

                const toDoListData = await StatisticsToDoList(userData);
                setToDoListStats(toDoListData);

                const emailData = await StatisticsEmail(userData);
                setEmailStats(emailData);
            } catch (error) {
                console.error(error);
                Alert.alert('Error', 'Failed to fetch statistics');
            }
        };

        fetchUser();
        fetchStatistics();
    }, [sessionId]); 
    
    const totalEventsToday = calendarStats.past_events_today + calendarStats.future_events_today;
    const calendarProgress = totalEventsToday > 0 ? calendarStats.past_events_today / totalEventsToday : 1;
    const totalToDoTasks = toDoListStats.total;
    const toDoListProgress = totalToDoTasks > 0 ? toDoListStats.complete_count / totalToDoTasks : 1;
  
    const totalEmailsToday = emailStats.total;
    const mailInboxProgress = totalEmailsToday > 0 ? (totalEmailsToday - emailStats.unopened_emails_today) / totalEmailsToday : 1;
    const totalProgress = (calendarProgress + toDoListProgress + mailInboxProgress) / 3;
    return (
        <View style={styles.container}>
            <View style={{ paddingHorizontal: wp(4) }}>
                <Text style={styles.title}>
                    {'Welcome back '}
                    <Text style={{ color: colors['brand-100'] }}>
                        {userName || 'User'}
                    </Text>
                    <Text>{"!\nLet's get you started"}</Text>
                </Text>
                <TodayProgress totalProgress={totalProgress} />
                <Categories
                    calendarProgress={calendarProgress}
                    toDoListProgress={toDoListProgress}
                    mailInboxProgress={mailInboxProgress}
                    FutureEvents={calendarStats.future_events_today} 
                    UnreadEmails={emailStats.unopened_emails_today} 
                    RemainingTODoList={totalToDoTasks-toDoListStats.complete_count}
                />
            </View>
            <BottomNavBar />
        </View>
    );
};

export default Index;

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.bg,
        flex: 1,
        justifyContent: 'space-between',
    },
    title: {
        fontFamily: 'Poppins_700Bold',
        fontSize: hp(2.6),
        color: 'white',
        marginTop: hp(10),
    },
});
