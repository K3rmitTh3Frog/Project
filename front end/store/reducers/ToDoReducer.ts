import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

type ToDoState = {
    completedEventIds: string[]
}

const initialState: ToDoState = {
    completedEventIds: [],
}

export const todoSlice = createSlice({
    name: 'todoData',
    initialState,
    reducers: {
        // this is like setState
        setEventIds: (state, action: PayloadAction<string[]>) => {
            state.completedEventIds = action.payload
        },
        toggleEventId: (state, action: PayloadAction<string>) => {
            let currEvents = state.completedEventIds ?? []
            let currEvent = currEvents.find((event) => event == action.payload)
            if (currEvent)
                // if event already exists -> remove it
                currEvents = currEvents.filter(
                    (event) => event != action.payload
                )
            // if event doesn't exist add it
            else currEvents = [...currEvents, action.payload]

            state.completedEventIds = [...currEvents]
        },
    },
})

export const { setEventIds, toggleEventId } = todoSlice.actions

export default todoSlice.reducer
