const combination = require('../combination');

describe("COMBINATION Algo test", () => {
  it("Should resolve provided case", async () => {
    const input = {
      x: 1,
      l: {
        x:2,
        l: {
          x:4
        },
        r: {
          x: 5,
          l: {
            x: 7
          },
          r: {
            x:8
          }
        }
      },
      r: {
        x:3,
        r: {
          x:6,
          l: {
            x: 9
          }
        }
      }
    };

    const expectation = [
      '1.2.4',
      '1.2.5.7',
      '1.2.5.8',
      '1.3.6.9'
    ];

    const result = await combination(input);
    expect(result).toEqual(expectation);
  });
});
