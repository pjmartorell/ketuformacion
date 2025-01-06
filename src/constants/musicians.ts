import { Musician } from '../types/types';

export const MASTER_MUSICIAN: Musician = {
    id: 1,
    name: 'Alex',
    instrument: 'R'
};

export const isSpecialMusician = (musicianId: number): boolean => {
    return musicianId === MASTER_MUSICIAN.id;
};
    