import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Provider } from 'react-redux'
import store, { persistor } from '../store'
import InitialLoad from './InitialLoad'
type Props = {
    children: React.ReactNode
}
import { PersistGate } from 'redux-persist/integration/react'
import { QueryClientProvider, QueryClient } from 'react-query'

const client = new QueryClient({
    defaultOptions: {
        queries: {
            cacheTime: 35 * (60 * 1000), // 30 minutes,
            staleTime: 30 * (60 * 1000),
            refetchOnWindowFocus: false,
        },
    },
})

const Providers = ({ children }: Props) => {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <QueryClientProvider client={client}>
                    <InitialLoad>{children}</InitialLoad>
                </QueryClientProvider>
            </PersistGate>
        </Provider>
    )
}

export default Providers

const styles = StyleSheet.create({})
