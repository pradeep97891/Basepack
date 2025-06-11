import { screen, render, waitFor } from "@testing-library/react";
import Testwrapper from "../CommonTestWrapper/CommonTestWrapper";
import { SideBar } from "./Menu";
describe("Menu Testing", () => {
  test("renders Menu", async () => {
    render(
      <Testwrapper>
        <SideBar position={"inline"} placement={undefined} />
      </Testwrapper>
    );
    const getMenuData = await screen.findAllByRole("menu");
    expect(getMenuData).not.toHaveLength(0);
    // await waitFor(() => expect(screen.getByText(/Dashboard/i)).toBeInTheDocument());
  });
});
