import { FC, Suspense } from "react";
import { MemoryRouter } from "react-router-dom";
import { LanguageProvider } from "@/languages/Language.context";
import { AppStoreProvider } from "@/stores/Store";
import { Loader } from "../Loader/Loader";

const CommonTestWrapper: FC<ChildInterface> = (props) => {
  // https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
  // In your test file or setup:
  window.ResizeObserver = jest.fn(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
  // https://react.i18next.com/misc/testing
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  jest.mock("react-i18next", () => ({
    useTranslation: () => {
      return {
        t: (str: any) => str,
        i18n: {
          changeLanguage: () => new Promise(() => {}),
        },
      };
    },
  }));
  return (
    <Suspense fallback={<Loader fallback={true} />}>
      <MemoryRouter>
        <AppStoreProvider>
          <LanguageProvider>{props.children}</LanguageProvider>
        </AppStoreProvider>
      </MemoryRouter>
    </Suspense>
  );
};

export default CommonTestWrapper;
