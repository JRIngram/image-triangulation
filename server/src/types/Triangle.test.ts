import { describe, it, expect } from "vitest";
import { Triangle } from "./Triangle";
import { Vertex } from "./types";
import { Circumcircle } from "./Circumcircle";
import { Edge } from "./Edge";

describe("Triangle", () => {
  describe("Constructor", () => {
    it("assigns the correct verticies and circumcircle fields", () => {
      const a: Vertex = { x: -3, y: 0 };
      const b: Vertex = { x: 0, y: 3 };
      const c: Vertex = { x: 3, y: 0 };
      const triangle = new Triangle(a, b, c);

      const expectedCircumcircle: Circumcircle = new Circumcircle(
        {
          x: -0,
          y: -0,
        },
        3
      );

      expect(triangle.a).toEqual(a);
      expect(triangle.b).toEqual(b);
      expect(triangle.c).toEqual(c);
      expect(triangle.circumcircle).toEqual(expectedCircumcircle);
    });

    it("sorts the verticies", () => {
      const c: Vertex = { x: -3, y: 0 };
      const b: Vertex = { x: 0, y: 3 };
      const a: Vertex = { x: 3, y: 0 };
      const triangle = new Triangle(a, b, c);

      const expectedCircumcircle: Circumcircle = new Circumcircle(
        {
          x: -0,
          y: -0,
        },
        3
      );

      expect(triangle.a).toEqual(c);
      expect(triangle.b).toEqual(b);
      expect(triangle.c).toEqual(a);
      expect(triangle.circumcircle).toEqual(expectedCircumcircle);
    });
  });

  describe("areTrianglesEqual", () => {
    it("returns true if triangles are equal", () => {
      const a: Vertex = { x: -3, y: 0 };
      const b: Vertex = { x: 0, y: 3 };
      const c: Vertex = { x: 3, y: 0 };
      const triangleOne = new Triangle(a, b, c);
      const triangleTwo = new Triangle(a, b, c);
      expect(triangleOne.areTrianglesEqual(triangleTwo)).toEqual(true);
    });

    it("returns false if triangles are not equal", () => {
      const a: Vertex = { x: -3, y: 0 };
      const b: Vertex = { x: 0, y: 3 };
      const c: Vertex = { x: 3, y: 0 };
      const d: Vertex = { x: 0, y: 0 };
      const triangleOne = new Triangle(a, b, c);
      const triangleTwo = new Triangle(a, b, d);
      expect(triangleOne.areTrianglesEqual(triangleTwo)).toEqual(false);
    });
  });

  describe("pointLiesWithinTriangle", () => {
    it("returns true if point lies within triangle", () => {
      const a: Vertex = { x: -3, y: 0 };
      const b: Vertex = { x: 0, y: 3 };
      const c: Vertex = { x: 3, y: 0 };
      const d: Vertex = { x: 0, y: 0 };
      const triangle = new Triangle(a, b, c);
      const expected = true;

      const actual = triangle.pointLiesWithinTriangle(d);

      expect(actual).toEqual(expected);
    });

    it("returns false if point lies within triangle", () => {
      const a: Vertex = { x: -3, y: 0 };
      const b: Vertex = { x: 0, y: 3 };
      const c: Vertex = { x: 3, y: 0 };
      const d: Vertex = { x: 10, y: 10 };
      const triangle = new Triangle(a, b, c);
      const expected = false;

      const actual = triangle.pointLiesWithinTriangle(d);

      expect(actual).toEqual(expected);
    });
  });

  it("get triangle edges", () => {
    const a: Vertex = { x: -3, y: 0 };
    const b: Vertex = { x: 0, y: 3 };
    const c: Vertex = { x: 3, y: 0 };
    const triangle = new Triangle(a, b, c);
    const ab = new Edge(a, b);
    const bc = new Edge(b, c);
    const ca = new Edge(c, a);
    const expectedEdges = [ab, bc, ca];

    const edges = triangle.getTriangleEdges();
    expect(edges).toEqual(expectedEdges);
  });

  it("getTriangleArea", () => {
    const a: Vertex = { x: -3, y: 0 };
    const b: Vertex = { x: 0, y: 3 };
    const c: Vertex = { x: 3, y: 0 };
    const triangle = new Triangle(a, b, c);
    const expected = 9;
    const actual = triangle.getTriangleArea();
    expect(actual).toEqual(expected);
  });
});
