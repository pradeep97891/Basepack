/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { useInitialAuthService, useLogoutService } from "@/services/user/User";
import { useAppSelector } from "./App.hook";
import { useDispatch } from "react-redux";
import { delUser } from "@/stores/User.store";
import { useLocalStorage } from "./BrowserStorage.hook";

// listens user and maintains auth state
const useAuth = () => {
  const { isAuthenticated } = useAppSelector((state) => state.user);
  const [service] = useInitialAuthService();
  const [logoutService] = useLogoutService();
  const dispatch = useDispatch();
  /* Localstorage values & handlers */
  const [, , LremoveLayout] = useLocalStorage("layout");
  const [, , LremoveActiveMenu] = useLocalStorage("ActiveMenu");
  const [, , LremoveMenu] = useLocalStorage("deeplink");

  // initial load, check user
  useEffect(() => {
    if (isAuthenticated === null) service();
  }, [isAuthenticated, service]);

  const logout = async () => {    
    await logoutService();
    LremoveLayout();
    LremoveActiveMenu();
    LremoveMenu();
    dispatch(delUser());
  };

  return { isAuthenticated, logout };
};

export { useAuth };
