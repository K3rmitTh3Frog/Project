import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import { useInfiniteQuery } from 'react-query'
import { getEmailRawById, getEmails } from '../../../utils/routes'
import { FlashList } from '@shopify/flash-list'
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen'
import he from 'he'
import { colors } from '../../../constants'
import { useAppDispatch } from '../../../store'
import { setLoading } from '../../../store/reducers/LoadingReducer'
import {
    getBodyText,
    getDateFromPayload,
    getSubjectFromPayload,
} from '../../../utils/utils'
import { decode } from 'base-64'

type Props = {
    gmailAccessToken: string
}

const Inbox = ({ gmailAccessToken }: Props) => {
    const dispatch = useAppDispatch()
    const {
        data,
        isLoading,
        hasNextPage,
        fetchNextPage,
        error,
        isFetchingNextPage,
    } = useInfiniteQuery(
        ['emails', gmailAccessToken],
        ({ pageParam = '' }) => getEmails(gmailAccessToken, pageParam),
        {
            getNextPageParam: (lastPage) => {
                if (
                    lastPage.nextPageToken !== null &&
                    lastPage.nextPageToken != ''
                ) {
                    return lastPage.nextPageToken
                }
                return lastPage
            },
        }
    )

    useEffect(() => {
        if (isLoading || isFetchingNextPage) dispatch(setLoading(true))
        else dispatch(setLoading(false))
        console.log('loading', isFetchingNextPage)
    }, [isLoading, isFetchingNextPage])

    const loadMore = () => {
        if (hasNextPage) {
            fetchNextPage()
        }
    }
    return (
        <FlashList
            onEndReachedThreshold={0.2}
            data={data?.pages?.map((page) => page?.messages)?.flat() ?? []}
            onEndReached={loadMore}
            renderItem={({ item, index }) => {
                // console.log(data?.snippet)
                const body = he.decode(item?.snippet)
                const subject = getSubjectFromPayload(item?.payload)
                const date = getDateFromPayload(item?.payload)

                return (
                    <TouchableOpacity style={styles.emailItem} key={index}>
                        <View style={styles.initialCircle}>
                            <Text style={styles.initial}>
                                {item?.senderInitial}
                            </Text>
                        </View>
                        <View style={styles.emailContent}>
                            <Text style={styles.subject} numberOfLines={2}>
                                {subject}
                            </Text>
                            <Text style={styles.preview} numberOfLines={2}>
                                {body}
                            </Text>
                        </View>
                        <Text style={styles.time}>
                            {date.getDate() == new Date().getDate()
                                ? date.toLocaleTimeString('en-Us', {
                                      hour12: true,
                                      hour: 'numeric',
                                      minute: '2-digit',
                                  })
                                : date?.toLocaleString('en-Us', {
                                      day: '2-digit',
                                      month: 'short',
                                  })}
                        </Text>
                    </TouchableOpacity>
                )
            }}
            estimatedItemSize={hp(10)}
        />
    )
}

export default Inbox

const styles = StyleSheet.create({
    emailItem: {
        flexDirection: 'row',
        padding: hp(2),
        borderBottomWidth: 1,
        borderBottomColor: colors['brand-200'],
        gap: wp(4),
    },
    initialCircle: {
        width: hp(6),
        height: hp(6),
        borderRadius: hp(6),
        backgroundColor: colors['brand-100'],
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: hp(0.5),
    },
    initial: {
        color: 'white',
        fontFamily: 'Poppins_700Bold',
        fontSize: hp(2.5),
    },
    emailContent: {
        flex: 1,
        gap: hp(0.2),
    },
    subject: {
        color: 'white',
        fontFamily: 'Poppins_700Bold',
        fontSize: hp(1.8),
    },
    preview: {
        color: 'white',
        fontFamily: 'Poppins_400Regular',
        fontSize: hp(1.4),
    },
    time: {
        color: 'white',
        fontFamily: 'Poppins_400Regular',
        fontSize: hp(1.8),
    },
})
