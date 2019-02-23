import formatMoney from "../lib/formatMoney";

describe("FormatMoney", () => {
  it("works with fractional dollars", () => {
    expect(formatMoney(1)).toEqual("$0.01");
    expect(formatMoney(10)).toEqual("$0.10");
    expect(formatMoney(50)).toEqual("$0.50");
  });
  it("works with cents of  dollars", () => {
    expect(formatMoney(100)).toEqual("$1");
    expect(formatMoney(500)).toEqual("$5");
  });
});
