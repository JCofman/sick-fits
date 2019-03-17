import { mount } from "enzyme";
import toJSON from "enzyme-to-json";
import wait from "waait";
import Pagination, { PAGINATION_QUERY } from "../components/Pagination";
import { CURRENT_USER_QUERY } from "../components/User";
import { MockedProvider } from "react-apollo/test-utils";
import { fakeUser } from "../lib/testUtils";
import { resetIdCounter } from "downshift";

resetIdCounter.router= {
    push()
}

function makeMocksFor(length) {
  return [
    {
      request: { query: PAGINATION_QUERY },
      result: {
        data: {
          itemsConnection: {
            __typename: "aggregate",
            aggregate: {
              count: length,
              __typename: "count"
            }
          }
        }
      }
    }
  ];
}
describe("<Pagination/>", () => {
  it("displays a loading message", async () => {
    const wrapper = mount(
      <MockedProvider mocks={makeMocksFor(1)}>
        <Pagination page={1} />
      </MockedProvider>
    );
    const pagination = wrapper.find('[data-test="pagination"]');
    expect(wrapper.text()).toContain("Loading...");
  });
  it("renders pagination for 18 items", async () => {
    const wrapper = mount(
      <MockedProvider mocks={makeMocksFor(18)}>
        <Pagination page={1} />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    const pagination = wrapper.find('[data-test="pagination"]');
    expect(wrapper.text()).toContain("Loading...");
  });
});
