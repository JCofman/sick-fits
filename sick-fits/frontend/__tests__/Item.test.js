import ItemComponent from "../components/Item";
import { shallow } from "enzyme";
import toJSON from "enzyme-to-json";
const fakeItem = {
  id: "ABCD",
  title: "A cool Item",
  price: 5000,
  description: "This is a nice item",
  image: "cool.jpg",
  largeImage: "largeCool.jpg"
};

describe("<Item>", () => {
  it("renders and displays propery", () => {
    const wrapper = shallow(<ItemComponent item={fakeItem} />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
