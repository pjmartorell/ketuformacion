import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Musician } from '../types/types';

interface State {
    musicians: Musician[];
    selectedMusicians: Musician[];
}

type Action =
    | { type: 'ADD_MUSICIAN'; payload: Musician }
    | { type: 'REMOVE_MUSICIAN'; payload: number }
    | { type: 'UPDATE_MUSICIAN'; payload: Musician }
    | { type: 'SET_SELECTED_MUSICIANS'; payload: Musician[] };

const initialState: State = {
    musicians: [],
    selectedMusicians: []
};

const MusicianContext = createContext<{
    state: State;
    dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

export const musicianReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'ADD_MUSICIAN':
            return {
                ...state,
                musicians: [...state.musicians, action.payload]
            };
        case 'REMOVE_MUSICIAN':
            return {
                ...state,
                musicians: state.musicians.filter(m => m.id !== action.payload)
            };
        case 'UPDATE_MUSICIAN':
            return {
                ...state,
                musicians: state.musicians.map(m =>
                    m.id === action.payload.id ? action.payload : m
                )
            };
        case 'SET_SELECTED_MUSICIANS':
            return {
                ...state,
                selectedMusicians: action.payload
            };
        default:
            return state;
    }
};

export const MusicianProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(musicianReducer, initialState);

    return (
        <MusicianContext.Provider value={{ state, dispatch }}>
            {children}
        </MusicianContext.Provider>
    );
};

export const useMusician = () => {
    const context = useContext(MusicianContext);
    if (context === undefined) {
        throw new Error('useMusician must be used within a MusicianProvider');
    }
    return context;
};