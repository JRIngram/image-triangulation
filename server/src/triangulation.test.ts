import { describe, it, expect } from "vitest";
import { Vertex } from "./types/types";
import { bowyerWatson } from "./triangulation";
import { Triangle } from "./types/Triangle";

describe("Bowyer-Watson algorithm", () => {
  it("triangulates 3 points successfully", () => {
    const a: Vertex = { x: -3, y: 0 };
    const b: Vertex = { x: 0, y: 3 };
    const c: Vertex = { x: 3, y: 0 };
    const pointList = [a, b, c];
    const expected = [new Triangle(a, b, c)];

    const actual = bowyerWatson(pointList);

    expect(actual).toEqual(expected);
  });

  it("triangulates 6 points successfully", () => {
    const pointList = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ];

    const expected = [
      new Triangle(pointList[0], pointList[3], pointList[4]),
      new Triangle(pointList[0], pointList[1], pointList[4]),
      new Triangle(pointList[1], pointList[4], pointList[5]),
      new Triangle(pointList[1], pointList[2], pointList[5]),
    ];

    const actual = bowyerWatson(pointList);

    expect(actual).toEqual(expected);
  });
});
