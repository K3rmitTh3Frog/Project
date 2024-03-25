import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

type MasterState = {
    calendarId: string
    gmailAccessToken: string
    outlookAccessToken: string
   sessionId:string
}

const initialState: MasterState = {
    calendarId: '',
    gmailAccessToken: '',
    sessionId:"",
    outlookAccessToken: '',
}

export const masterSlice = createSlice({
    name: 'masterData',
    initialState,
    reducers: {
        // this is like setState
        setCalendarId: (state, action: PayloadAction<string>) => {
            state.calendarId = action.payload
        },

        setSessionId: (state, action: PayloadAction<string>) => {
            state.sessionId = action.payload
        },

        setOutlookAccessToken: (state, action: PayloadAction<string>) => {
            state.outlookAccessToken = action.payload
        },
    },
})

export const { setCalendarId, setSessionId, setOutlookAccessToken } =
    masterSlice.actions

export default masterSlice.reducer
