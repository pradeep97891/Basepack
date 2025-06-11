import { useState, useEffect, useCallback } from "react";
import { encryptData, decryptData } from "./EncryptDecrypt.hook";

/* Type of local storage and session storage */
interface Storage {
  readonly length: number;
  clear(): void;
  getItem(key: string): string | null;
  key(index: number): string | null;
  removeItem(key: string): void;
  setItem(key: string, value: string): void;
}

/**
 * Custom hook to manage state synchronized with local / session storage.
 * @param key The key to store the value under in local / session storage.
 * @param defaultValue The initial value to use if no value is found in local / session storage.
 * @param serialize Function to serialize the value before storing.
 * @param deserialize Function to deserialize the value after retrieving.
 * @returns A stateful value, and a function to update & remove it.
 */
function useLocalStorage<T>(
  key: string,
  defaultValue?: T,
  serialize?: (value: T) => string,
  deserialize?: (value: string) => T
) {
  return useStorage(
    key,
    defaultValue,
    window.localStorage,
    serialize,
    deserialize
  );
}

function useSessionStorage<T>(
  key: string,
  defaultValue?: T,
  serialize?: (value: T) => string,
  deserialize?: (value: string) => T
) {
  return useStorage(
    key,
    defaultValue,
    window.sessionStorage,
    serialize,
    deserialize
  );
}

// 'T' is going to be a type declared at run-time instead of compile time.
function useStorage<T>(
  key: string,
  defaultValue: T | undefined,
  storageObject: Storage,
  serialize: (value: T) => string = JSON.stringify,
  deserialize: (value: string) => T = JSON.parse
) {
  const ENABLE_ENCRYPTION: boolean = true;
  const KEY_PREFIX: string = process.env.REACT_APP_STORAGE_PREFIX as string;
  /* JSON verification handler */
  const isJSON = (value: string): boolean => {
    try {
      deserialize(value);
      return true;
    } catch {
      return false;
    }
  };

  /* Storage state value */
  const [value, setValue] = useState<T | undefined>(() => {
    const storedValue = storageObject.getItem(KEY_PREFIX + key);
    if (storedValue) {
      try {
        const decryptedValue = ENABLE_ENCRYPTION
          ? decryptData(storedValue)
          : storedValue;
        return isJSON(decryptedValue)
          ? deserialize(decryptedValue)
          : (decryptedValue as unknown as T);
      } catch (error) {
        console.error(
          "Error decrypting storage value : " +
            KEY_PREFIX +
            key +
            " error : " +
            error
        );
      }
    }

    return defaultValue;
  });

  /* Updates state value in the storage */
  useEffect(() => {
    const isValuePresent = storageObject.getItem(KEY_PREFIX + key);
    if (value === undefined && isValuePresent) {
      storageObject.removeItem(KEY_PREFIX + key);
    } else if(value !== undefined) {
      const serializedValue =
        typeof value === "string" ? value : serialize(value as T);
      try {
        const storedValue = ENABLE_ENCRYPTION
          ? encryptData(serializedValue)
          : serializedValue;
        storageObject.setItem(KEY_PREFIX + key, storedValue);
      } catch (error) {
        console.error(
          "Error encrypting storage value: " +
            KEY_PREFIX +
            key +
            " error: " +
            error
        );
      }
    }
  }, [KEY_PREFIX, key, value, storageObject, ENABLE_ENCRYPTION, serialize]);

  /* Set new value to the state */
  const setStoredValue = useCallback((val: T) => {
    setValue((prevValue: T | undefined) => {
      if (prevValue !== val) {
        return val;
      }
      return prevValue;
    });
  }, []);

  /* Handler to remove storage value */
  const remove = useCallback(() => setValue(undefined), []);

  return [value, setStoredValue, remove] as const;
}

export { useLocalStorage, useSessionStorage };

/* USAGE
   const [Lvalue, LsetValue, LremoveValue] = useLocalStorage("name");

   # remove on mount
   useEffect(()=>{
     LsetValue('Batman')
   },[])
  
   # remove in event handler
   const handleRemove = () => {
     LremoveValue();
   };
  
- Always use 'L' or 'S'(session storage) before the variables to highlight the localstorage variables
- Handlers can be called only inside hooks or callbacks to prevent multiple re-rendering.
 */

/* ADVANTAGES
  - Encapsulates the logic for handling local storage/session storage, reducing boilerplate code.
  - Automatically handles JSON serialization and deserialization, allowing for storing complex data structures (arrays, objects) without additional code.
  - Automatic synchronization between the stored data and the component’s state.
  - Similarly, when the component’s state changes, the hook automatically persists the new value to the storage.
 */
