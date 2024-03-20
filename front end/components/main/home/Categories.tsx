import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen'
import { Ionicons  } from '@expo/vector-icons'
import { colors } from '../../../constants'
import * as Progress from 'react-native-progress'
import { useRouter } from 'expo-router'
interface CategoryProps {
    progress: number;
    label: string | React.ReactNode; // Allow React.ReactNode for label
    iconName: "calendar" | "mail" | "list-sharp" | "notifications";
    title: string;
    onPress: () => void; // Add onPress prop for touch event
}

const Category = ({ progress, label, iconName, title, onPress }: CategoryProps) => {
    
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.box}>
                <View style={styles.row}>
                    <Text style={styles.text}>{title}</Text>
                    <Ionicons name={iconName} size={24} color={'white'} />
                </View>
                <View style={{ gap: hp(0.5) }}>
                    <Progress.Bar
                        width={wp(36)}
                        color={colors['brand-100']}
                        unfilledColor={colors.bg}
                        borderWidth={0}
                        progress={progress}
                        height={hp(1.5)}
                        borderRadius={hp(2)}
                    />
                    {typeof label === 'string' ? (
                        <Text style={styles.label}>{label}</Text>
                    ) : (
                        label // Render as is if label is not a string
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

type Props = {
    calendarProgress: number;
    toDoListProgress: number;
    mailInboxProgress: number;

    FutureEvents: number;
    UnreadEmails: number;
    RemainingTODoList: number;
    
};

const Categories = ({ calendarProgress, toDoListProgress, mailInboxProgress,FutureEvents,UnreadEmails,RemainingTODoList }: Props) => {
    const router = useRouter()
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Categories</Text>
            <View
                style={{
                    flexWrap: 'wrap',
                    flexDirection: 'row',
                    rowGap: wp(4),
                    columnGap: wp(4),
                }}
            >
                <Category
                    progress={calendarProgress}
                    label={`${FutureEvents} Events remaining`}
                    iconName="calendar"
                    title="Calendar"
                    onPress={() => router.push('/main/Calendar')}
                />
                <Category
                    progress={mailInboxProgress}
                    label={`${UnreadEmails} new emails`}
                    iconName="mail"
                    title="Mailbox"
                    onPress={() => router.push('/main/email')}
                />
                <Category
                    progress={toDoListProgress}
                    label={`${RemainingTODoList} Tasks remaining`}
                    iconName="list-sharp"
                    title="To-do List"
                    onPress={() => router.push('main/to-do')}
                />
                <Category
                    progress={1}
                    label="3 Tasks generated"
                    iconName="notifications"
                    title="AI To-do List"
                    onPress={() => router.push('main/Settings')}
                />
            </View>
        </View>
    );
};

export default Categories;

const styles = StyleSheet.create({
    container: {
        marginTop: hp(4),
        gap: hp(1),
    },
    title: {
        fontFamily: 'Poppins_700Bold',
        fontSize: hp(2.2),
        color: 'white',
    },
    text: {
        color: 'white',
        fontFamily: 'Poppins_700Bold',
        fontSize: hp(2),
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    box: {
        width: wp(42),
        backgroundColor: colors['brand-200'],
        paddingVertical: hp(2),
        paddingHorizontal: wp(4),
        borderRadius: hp(2),
        gap: hp(2),
    },
    label: {
        color: colors.grey,
        fontSize: hp(1.4),
        fontFamily: 'Poppins_500Medium',
    },
});
