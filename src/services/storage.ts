import { Musician } from '../types/types';
import { MASTER_MUSICIAN, isSpecialMusician } from '../constants/musicians';

const STORAGE_KEYS = {
  MUSICIANS: 'ketu-musicians',
  AVATARS: 'ketu-avatars',
  INITIALIZED: 'ketu-initialized'
};

const initialMusicians: Musician[] = [
    { id: 2, name: 'Leti', instrument: 'F1' },
    { id: 3, name: 'Joanna', instrument: 'C' },
    { id: 4, name: 'Aitor', instrument: 'C' },
    { id: 5, name: 'Manu', instrument: 'C' },
    { id: 6, name: 'Leo', instrument: 'C' },
    { id: 7, name: 'Snez', instrument: 'C' },
    { id: 8, name: 'Pere', instrument: 'C' },
    { id: 9, name: 'Wally', instrument: 'C' },
    { id: 10, name: 'Adeline', instrument: 'D1' },
    { id: 11, name: 'Maria', instrument: 'D1' },
    { id: 12, name: 'Emiliana', instrument: 'D1' },
    { id: 13, name: 'Nicole', instrument: 'D1' },
    { id: 14, name: 'Maya', instrument: 'D1' },
    { id: 15, name: 'Elena', instrument: 'D2' },
    { id: 16, name: 'Sara', instrument: 'D2' },
    { id: 17, name: 'Lucia', instrument: 'D2' },
    { id: 18, name: 'Tania', instrument: 'F2' },
    { id: 19, name: 'Lara', instrument: 'F2' },
    { id: 20, name: 'Sab', instrument: 'M' },
    { id: 21, name: 'Moni', instrument: 'M' },
];

export const storageService = {
  initializeIfNeeded: () => {
    if (!localStorage.getItem(STORAGE_KEYS.INITIALIZED)) {
      localStorage.setItem(STORAGE_KEYS.MUSICIANS, JSON.stringify(initialMusicians));
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    }
  },

  getMusicians: (): Musician[] => {
    const data = localStorage.getItem(STORAGE_KEYS.MUSICIANS);
    const storedMusicians = data ? JSON.parse(data) : [];
    // Always ensure MASTER_MUSICIAN is present
    if (!storedMusicians.some(m => m.id === MASTER_MUSICIAN.id)) {
      return [MASTER_MUSICIAN, ...storedMusicians];
    }
    return storedMusicians;
  },

  saveMusicians: (musicians: Musician[]) => {
    // Ensure MASTER_MUSICIAN cannot be removed
    const masterExists = musicians.some(m => m.id === MASTER_MUSICIAN.id);
    const musiciansToSave = masterExists ? musicians : [MASTER_MUSICIAN, ...musicians];
    localStorage.setItem(STORAGE_KEYS.MUSICIANS, JSON.stringify(musiciansToSave));
  },

  getAvatar: (name: string): string | null => {
    const avatars = JSON.parse(localStorage.getItem(STORAGE_KEYS.AVATARS) || '{}');
    return avatars[name] || null;
  },

  saveAvatar: (name: string, dataUrl: string) => {
    const avatars = JSON.parse(localStorage.getItem(STORAGE_KEYS.AVATARS) || '{}');
    avatars[name] = dataUrl;
    localStorage.setItem(STORAGE_KEYS.AVATARS, JSON.stringify(avatars));
  },

  deleteAvatar: (name: string) => {
    const avatars = JSON.parse(localStorage.getItem(STORAGE_KEYS.AVATARS) || '{}');
    delete avatars[name];
    localStorage.setItem(STORAGE_KEYS.AVATARS, JSON.stringify(avatars));
  }
};
