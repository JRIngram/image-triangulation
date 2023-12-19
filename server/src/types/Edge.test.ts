import { describe, it, expect } from 'vitest'
import { Edge } from "./Edge";
import { Vertex } from "./types";

describe('Edge', () => {
    describe('constructor', () => {
        it('assigns a to the vertex with the lower x value', () => {
            const v1: Vertex = {x: 0, y: 0 };
            const v2: Vertex = {x: -1, y: 0};

            const t = new Edge(v1, v2);
            expect(t.a.x).toEqual(-1);
            expect(t.b.x).toEqual(0)
        })

        it('assigns a to the vertex with the lower y value if x values are ewqual', () => {
            const v1: Vertex = {x: 0, y: -1 };
            const v2: Vertex = {x: 0, y: 0}

            const t = new Edge(v1, v2);
            expect(t.a.y).toEqual(-1);
            expect(t.b.y).toEqual(0)
        })
    });
    
    describe('isEdgeEqual', () => {
        it('returns true if edges are equal', () => {
            const edgeOne = new Edge({x:3, y:3}, {x:3, y:3})
            const edgeTwo = new Edge({x:3, y:3}, {x:3, y:3})
            const result = edgeOne.isEdgeEqual(edgeTwo);
            expect(result).toEqual(true)
        });

        it('returns false if edges are not equal', () => {
            const edgeOne = new Edge({x:3, y:3}, {x:3, y:3})
            const edgeTwo = new Edge({x:0, y:0}, {x:0, y:0})
            const result = edgeOne.isEdgeEqual(edgeTwo);
            expect(result).toEqual(false)
        })
    })

    describe('getEdgeLength', () => {
        it('returns 0 if the edge has no length', () => {
            const edge = new Edge({x:3, y:3}, {x:3, y:3})
            const result = edge.getEdgeLength()
            expect(result).toEqual(0);
        })

        it('returns 10 if edge length is 10 and non-diagonal', () => {
            const edge = new Edge({x:0, y:0}, {x: 0, y:10})
            const result = edge.getEdgeLength()
            expect(result).toEqual(10);
        })

        
        it('pythagoras: returns the square root of a diagonal edge that goes from (0,0) -> (1,1) ', () => {
            const edge = new Edge({x:0, y:0}, {x: 1, y:1})
            const expected = Math.sqrt(1 + 1);
            const result = edge.getEdgeLength()
            expect(result).toEqual(expected);
        })

    })
})