'use client';
import { IndexDB_Storage } from '@constants/storage.constant';
import { InitialSurveyState } from '@constants/survey.data.constant';
import { getIndexedDBValue, setIndexedDBValue } from '@utils/indexDB';
import React, {
  useReducer,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import SurveyContext from 'state/context/SurveyContext';
import { SurveyReducer } from 'state/reducer/SurveyReducer';

const SurveyProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(SurveyReducer, InitialSurveyState);
  const [isStateLoaded, setIsStateLoaded] = useState(false); // Tracks if the state is initialized

  // Load persisted state from IndexedDB only once
  useEffect(() => {
    const loadPersistedState = async () => {
      try {
        const persistedState = await getIndexedDBValue(
          IndexDB_Storage.surveyDB,
          'surveyData'
        );
        if (persistedState && !isStateLoaded) {
          dispatch({
            type: 'SET_SURVEY_DATA',
            payload: persistedState,
          });
        }
      } catch (error) {
        console.error('Failed to load persisted survey state:', error);
      } finally {
        setIsStateLoaded(true);
      }
    };

    loadPersistedState();
  }, [isStateLoaded]); // Runs only once during initialization

  // Save state to IndexedDB whenever it changes
  useEffect(() => {
    if (isStateLoaded) {
      // Prevent saving the uninitialized state
      const persistState = async () => {
        try {
          await setIndexedDBValue(
            IndexDB_Storage.surveyDB,
            'surveyData',
            state
          );
        } catch (error) {
          console.error('Failed to save survey state:', error);
        }
      };
      persistState();
    }
  }, [state, isStateLoaded]);

  return (
    <SurveyContext.Provider value={{ state, dispatch }}>
      {children}
    </SurveyContext.Provider>
  );
};

const useSurveyContext = () => {
  const context = useContext(SurveyContext);
  if (!context) {
    throw new Error('useSurveyContext must be used within a SurveyProvider');
  }
  return context;
};

export { SurveyProvider, useSurveyContext };
