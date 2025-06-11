import { render, screen } from "@testing-library/react";
import { LanguageProvider } from "./Language.context";
import CommonTestWrapper from "../components/CommonTestWrapper/CommonTestWrapper";
import Language from "../components/Language/Language";

it("renders Languge Context", () => {
  render(
    <CommonTestWrapper>
      <LanguageProvider children/>
      <Language />
    </CommonTestWrapper>
  );
  expect(screen.getByTestId("lang")).toBeInTheDocument();
});
