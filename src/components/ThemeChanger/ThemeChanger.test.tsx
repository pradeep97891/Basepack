import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import {ThemeChanger} from './ThemeChanger';
import Testwrapper from '@/components/CommonTestWrapper/CommonTestWrapper';
// import { useTranslation } from 'react-i18next';

describe('It tests Theme Changer mount', () => {
    
  test('it should mount', () => {
    render(
        <Testwrapper>
          <ThemeChanger />
        </Testwrapper>
      );
    expect(screen.getByTestId('ThemeChanger')).toBeInTheDocument();
  });
  
//   it("opens the drawer when the theme icon is clicked", async () => {
//     render(<ThemeChanger />);
//     fireEvent.click(screen.getByTestId('ThemeButton'));
//     await expect(screen.getByText(/theme settings/i)).toBeInTheDocument();
//   });

//   it("closes the drawer when the close button is clicked", async () => {
//     render(<ThemeChanger />);
//     fireEvent.click(screen.getByTestId('ThemeButton'));
//     await waitFor(() => {
//       expect(screen.queryByText(/theme_settings/i)).not.toBeInTheDocument();
//     });
//   });

//   it("closes the drawer when the close button is clicked", async () => {
//     render(<ThemeChanger />);
//     fireEvent.click(screen.getByTestId('ThemeButton'));
    
//     fireEvent.click(screen.getByRole('button', { name: /close/i }));
//     await waitFor(() => {
//       expect(screen.queryByText(/theme_settings/i)).not.toBeInTheDocument();
//     });
//   });

//   it("changes the layout when a new layout is selected", () => {
//     const mockSetLayout = jest.fn();
//     const mockRemoveLayout = jest.fn();
    
//     jest.mock("@/hooks/BrowserStorage.hook", () => ({
//       useLocalStorage: () => ["HomeLayout", mockSetLayout, mockRemoveLayout],
//     }));
    
//     render(<ThemeChanger />);
    
//     fireEvent.click(screen.getByText(/Horizontal layout/i));  // Selecting horizontal layout
//     expect(mockSetLayout).toHaveBeenCalledWith("HomeHorizontalLayout");
//   });

//   it("resets the layout when 'Reset' is selected", () => {
//     const mockRemoveLayout = jest.fn();
    
//     jest.mock("@/hooks/BrowserStorage.hook", () => ({
//       useLocalStorage: () => ["HomeLayout", jest.fn(), mockRemoveLayout],
//     }));
    
//     render(<ThemeChanger />);
    
//     fireEvent.click(screen.getByText(/logout/i));
//     expect(mockRemoveLayout).toHaveBeenCalled();
//   });

//   it("shows the correct tooltip for the theme icon", () => {
//     const { t } = useTranslation();
    
//     render(<ThemeChanger />);
//     const themeButton = screen.getByTestId('ThemeButton');
//     fireEvent.mouseOver(themeButton);
    
//     expect(screen.getByText(t("theme_selector"))).toBeInTheDocument();
//   });

//   it("closes the drawer with a delay after clicking the close icon", async () => {
//     jest.useFakeTimers();
    
//     render(<ThemeChanger />);
//     fireEvent.click(screen.getByTestId('ThemeButton'));
    
//     fireEvent.click(screen.getByLabelText(/close/i));
    
//     expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000);
//     jest.runAllTimers();
    
//     await waitFor(() => {
//       expect(screen.queryByText(/theme_settings/i)).not.toBeInTheDocument();
//     });
    
//     jest.useRealTimers();
//   });
  
});