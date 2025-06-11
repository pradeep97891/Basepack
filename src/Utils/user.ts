import { AppState } from '../stores/Store';

const hydrateUserFromLocalStorage = () => {
  let cache = localStorage.getItem(process.env.REACT_APP_STORAGE_PREFIX + 'user');
  if (cache) {
    const user: null | AppState['user']['user'] = JSON.parse(atob(cache));
    if (user && user.id && user.name && user.email) {
      return user;
    } else {
      console.log('api returned success, but user not found in storage,');
    }
  }
};

export { hydrateUserFromLocalStorage };
