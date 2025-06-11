import { render } from "@testing-library/react";
import { AppRoute } from "./index.route";
import { ConfigProvider } from "antd";
import { DocumentHead } from "../components/DocumentHead/DocumentHead";
import CommonTestWrapper from "../components/CommonTestWrapper/CommonTestWrapper";
import enUS from "antd/lib/locale/en_US";

it("renders Language menu", () => {
  render(
    <CommonTestWrapper>
      <ConfigProvider locale={enUS}>
        <DocumentHead />
        <AppRoute />
      </ConfigProvider>
    </CommonTestWrapper>
  );
  expect(document.title).toBe("");
});
