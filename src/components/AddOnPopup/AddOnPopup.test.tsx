import { render, screen, fireEvent } from "@testing-library/react";
import AddOnPopup, { AddOnPopupProps } from "./AddOnPopup";
import Testwrapper from '@/components/CommonTestWrapper/CommonTestWrapper';

describe("AddOnPopup Component", () => {
  test('it should mount', () => {
    render(
      <Testwrapper>
        <AddOnPopup currentTab={""}  />
      </Testwrapper>
    );
    
    const addOnPopup = screen.getByTestId('AddOnPopup');
    expect(addOnPopup).toBeInTheDocument();
  });

  // it("handles button clicks", () => {
  //   const props: AddOnPopupProps = {
  //     currentTab: "modify",
  //     selectedFlights: []
  //   };

  //   render(
  //     <Testwrapper>
  //       <AddOnPopup {...props} />
  //     </Testwrapper>
  //   );
  //   const nextButton = screen.getByText("next");
  //   fireEvent.click(nextButton);


  // });
});
