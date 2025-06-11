import { Suspense } from 'react';
import { render } from '@testing-library/react';
import App from './App';
import { AppStoreProvider } from './stores/Store';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { LanguageProvider } from './languages/Language.context';

test('renders app without error', async () => {
  const history = createMemoryHistory();
  history.push('/');
  render(
    <Suspense fallback={'loading'}>
      <LanguageProvider>
        <Router location={history.location} navigator={history}>
          <AppStoreProvider>
            <App />
          </AppStoreProvider>
        </Router>
      </LanguageProvider>
    </Suspense>
  );
});
