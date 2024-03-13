import { StyleSheet } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { useRootNavigationState, useRouter } from 'expo-router'
import { useAppSelector } from '../store'

type Props = {}

const index = (props: Props) => {
    const rootNavigationState = useRootNavigationState()
    const router = useRouter()
    const { sessionId } = useAppSelector((state) => state.saved.master)
    const onStart = async () => {
        if (rootNavigationState?.key) {
            if (sessionId !== '') router.replace('/main/home')
            else router.replace('/onboarding')
        }
    }
    useLayoutEffect(() => {
        onStart()
    }, [rootNavigationState])

    return <></>
}

export default index

const styles = StyleSheet.create({})
