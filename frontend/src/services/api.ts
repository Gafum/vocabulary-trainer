import type { Word, CreateWordPayload, PagedResponse } from '../../../shared/types';

// Mock data for development
let MOCK_WORDS: Word[] = [
  {
    id: '1',
    term: 'Hello',
    translation: 'Hallo',
    lastReviewed: new Date().toISOString(),
    difficulty: 1,
    learned: false
  },
  {
    id: '2',
    term: 'World',
    translation: 'Welt',
    lastReviewed: new Date().toISOString(),
    difficulty: 2,
    learned: false
  },
  {
    id: '3',
    term: 'Cat',
    translation: 'Katze',
    lastReviewed: new Date().toISOString(),
    difficulty: 3,
    learned: true
  },
  {
    id: '4',
    term: 'Dog',
    translation: 'Hund',
    lastReviewed: new Date().toISOString(),
    difficulty: 4,
    learned: false
  },
  {
    id: '5',
    term: 'House',
    translation: 'Haus',
    lastReviewed: new Date().toISOString(),
    difficulty: 5,
    learned: false
  },
  {
    id: '6',
    term: 'Tree',
    translation: 'Baum',
    lastReviewed: new Date().toISOString(),
    difficulty: 1,
    learned: false
  },
  {
    id: '7',
    term: 'Sun',
    translation: 'Sonne',
    lastReviewed: new Date().toISOString(),
    difficulty: 2,
    learned: true
  },
  {
    id: '8',
    term: 'Moon',
    translation: 'Mond',
    lastReviewed: new Date().toISOString(),
    difficulty: 3,
    learned: false
  },
  {
    id: '9',
    term: 'Star',
    translation: 'Stern',
    lastReviewed: new Date().toISOString(),
    difficulty: 4,
    learned: false
  },
  {
    id: '10',
    term: 'Water',
    translation: 'Wasser',
    lastReviewed: new Date().toISOString(),
    difficulty: 5,
    learned: true
  },
];

const API_DELAY = 500;

export const fetchWords = async (
  page: number,
  limit: number,
  searchTerm: string,
  sortBy: keyof Word,
  sortOrder: 'asc' | 'desc'
): Promise<PagedResponse<Word>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredWords = MOCK_WORDS.filter(
        (word) =>
          word.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
          word.translation.toLowerCase().includes(searchTerm.toLowerCase())
      );

      filteredWords.sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortOrder === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
        }
        return 0;
      });

      const totalPages = Math.ceil(filteredWords.length / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const data = filteredWords.slice(startIndex, endIndex);

      resolve({
        data,
        page,
        totalPages,
      });
    }, API_DELAY);
  });
};

export const addWord = async (payload: CreateWordPayload): Promise<Word> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newWord: Word = {
        id: String(MOCK_WORDS.length + 1),
        ...payload,
        lastReviewed: new Date().toISOString(),
        learned: false
      };
      MOCK_WORDS.push(newWord);
      resolve(newWord);
    }, API_DELAY);
  });
};

export const updateWord = async (word: Word): Promise<Word> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = MOCK_WORDS.findIndex((w) => w.id === word.id);
      if (index !== -1) {
        MOCK_WORDS[index] = word;
        resolve(word);
      } else {
        reject(new Error('Word not found'));
      }
    }, API_DELAY);
  });
};

export const deleteWord = async (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const initialLength = MOCK_WORDS.length;
      MOCK_WORDS = MOCK_WORDS.filter((word) => word.id !== id);
      if (MOCK_WORDS.length < initialLength) {
        resolve();
      } else {
        reject(new Error('Word not found'));
      }
    }, API_DELAY);
  });
};
