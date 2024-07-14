import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const LOCAL_STORAGE_KEY = 'formState';

type FormState = {
  isSubmitDisabled: boolean;
  buttonWithSpinner: 'call' | 'put' | undefined;
  expiration: number | undefined;
};

const initialState: FormState = {
  isSubmitDisabled: false,
  buttonWithSpinner: undefined,
  expiration: undefined
};

function setInitialState(set: (value: FormState) => void) {
  set(initialState);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialState));
}

export function createFormState() {
  const state = writable(initialState, (set) => {
    if (browser) {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);

      if (stored) {
        const parsed = JSON.parse(stored) as FormState;

        if (parsed.expiration && parsed.expiration < Date.now()) {
          console.log('formState | expiration | expired');
          setInitialState(set);
        } else {
          console.log('formState | get', parsed);
          set(parsed);

          setTimeout(
            () => {
              console.log('formState | expiration');
              setInitialState(set);
            },
            parsed.expiration ? parsed.expiration - Date.now() : 0
          );
        }
      }
    }

    return () => {};
  });

  const set = (newState: FormState) => {
    state.set(newState);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState));
    console.log('formState | set', newState);
  };

  return {
    subscribe: state.subscribe,
    set
  };
}

export const formState = createFormState();
