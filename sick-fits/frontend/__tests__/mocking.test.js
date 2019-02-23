import { reject } from "any-promise";

function Person(name, food) {
  this.name = name;
  this.food = food;
}

Person.prototype.fetchFood = function() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(this.food);
    }, 2000);
  });
};

describe("Mock some data", () => {
  it("should mock a reg function", () => {
    const fetchDogs = jest.fn();
    fetchDogs();
    expect(fetchDogs).toHaveBeenCalled();
  });
  it("should can create a Person ", () => {
    const me = new Person("Jay", ["Döner"]);
    expect(me.name).toBe("Jay");
  });
  it("should fetch food ", async () => {
    const me = new Person("Jay", ["Döner"]);
    me.fetchFood = jest.fn().mockResolvedValue(["Döner"]);
    const food = await me.fetchFood();

    expect(food).toContain("Döner");
  });
});
