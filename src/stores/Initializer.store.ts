import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MenuInterface, RouterResponse } from '@/services/initializer/InitializerTypes';

const initialState: { Menus: MenuInterface; Routes: RouterResponse[]; LandingRoutes: RouterResponse[]} = {
  Menus: null as unknown as MenuInterface,
  Routes: null as unknown as RouterResponse[],
  LandingRoutes: null as unknown as RouterResponse[]
};

const reducer = createSlice({
  name: 'initializer',
  initialState,
  reducers: {
    setMenu: (state, { payload }: PayloadAction<MenuInterface>) => {
      return { ...state, Menus: payload };
    },
    setRoute: (state, { payload }: PayloadAction<RouterResponse[]>) => {
      return { ...state, Routes: payload };
    },
    setLandingRoute: (state, {payload}: PayloadAction<RouterResponse[]>) => {
      return {...state, LandingRoutes: payload};
    }
  },
  // extraReducers: (builder) => {
  //   builder
  //     // initial Menu and Route response
  //     .addMatcher(getMenusRoute.matchFulfilled, (state) => {
  //       // return { ...state.Menus, ...state.Routes };
  //     });
  // }
});

export const {
  actions: { setMenu, setRoute, setLandingRoute },
  reducer: initializerReducer
} = reducer;