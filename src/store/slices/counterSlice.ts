import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CounterState {
  value: number;
}

const initialState: CounterState = {
  value: 0,
};

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
      AsyncStorage.setItem('counter', state.value.toString());
    },
    decrement: (state) => {
      state.value -= 1;
      AsyncStorage.setItem('counter', state.value.toString());
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
      AsyncStorage.setItem('counter', state.value.toString());
    },
    setCounter: (state, action: PayloadAction<number>) => {
      state.value = action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount, setCounter } = counterSlice.actions;
export default counterSlice.reducer;
