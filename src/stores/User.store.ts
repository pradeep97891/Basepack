import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authenticateService, initialAuthService, otpAuthencateService } from '@/services/user/User';
import { hydrateUserFromLocalStorage } from '../Utils/user';

export interface User {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  groups: string[];
}

type authenticated = boolean | null;

const initialState: { user: User | null; isAuthenticated: authenticated } = { user: null as unknown as User, isAuthenticated: null };

const handleAuthFulfilled = (state: typeof initialState, { payload, meta } : any) => {
  if (payload.responseCode === 0) {
    const { email_id, user_id, groups, first_name, last_name, token } = payload.response.data;
    let csrf = (meta as unknown as any)?.baseQueryMeta?.response.headers.get('x-csrftoken');
    if (csrf == null) {
      csrf = token;
    }
    const user = {
      email: email_id,
      id: user_id,
      name: email_id,
      firstName: first_name,
      lastName: last_name,
      groups: groups,
      token: csrf
    };
    localStorage.setItem(`${process.env.REACT_APP_STORAGE_PREFIX}user`, btoa(JSON.stringify(user)));
    return { ...state, user: user, isAuthenticated: true };
  }
};

const reducer = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, { payload }: PayloadAction<User>) => {
      return { ...state, user: payload };
    },
    delUser: (state) => {
      localStorage.removeItem(`${process.env.REACT_APP_STORAGE_PREFIX}user`);
      localStorage.removeItem(`${process.env.REACT_APP_STORAGE_PREFIX}sStart`);
      return { ...state, user: null, project: null, isAuthenticated: false };
    }
  },
  extraReducers: (builder) => {
    builder
      // initial auth response
      .addMatcher(initialAuthService.matchFulfilled, (state) => {
        const user = hydrateUserFromLocalStorage();
        if (user && user.id && user.email && user.name && user.groups) { //change user.groups?.length later
          return { ...state, user: user, isAuthenticated: true };
        } else {
          return { ...state, user: null, isAuthenticated: false };
        }
      })
      .addMatcher(initialAuthService.matchRejected, (state) => {
        return { ...state, user: null, isAuthenticated: false };
      })
      .addMatcher(authenticateService.matchFulfilled, handleAuthFulfilled)
      .addMatcher(otpAuthencateService.matchFulfilled, handleAuthFulfilled);
  }
});

export const {
  actions: { setUser, delUser },
  reducer: userReducer
} = reducer;