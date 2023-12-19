import { describe, it, expect } from 'vitest'
import { Circumcircle } from './Circumcircle';

describe('Circumecircle', () => {
    it('constructor correctly assigns circumcentre and circumradius', () => {
        const circumcentreArgument = {x: 1, y: 1};
        const cicumradiusArgument = 3;
        const circumcircle = new Circumcircle(circumcentreArgument, cicumradiusArgument);

        const { circumradius, circumcentre } = circumcircle;
        const { x, y } = circumcentre;
        expect(x).toEqual(1);
        expect(y).toEqual(1);
        expect(circumradius).toEqual(3)
    })

    describe('isVertexWithinCircumcircle', () => {
        it('returns true if vertex within circumcircle', () => {
            const circumcentreArgument = {x: 0, y: 0};
            const cicumradiusArgument = 3;
            const circumcircle = new Circumcircle(circumcentreArgument, cicumradiusArgument);
            const vertex = { x: 0, y: 0 }
            expect(circumcircle.isVertexWithinCircumcircle(vertex)).toEqual(true)
        })

        it('returns false if vertex not within circumcircle', () => {
            const circumcentreArgument = {x: 0, y: 0};
            const cicumradiusArgument = 3;
            const circumcircle = new Circumcircle(circumcentreArgument, cicumradiusArgument);
            const vertex = { x: 4, y: 4 }
            expect(circumcircle.isVertexWithinCircumcircle(vertex)).toEqual(false)
        })
    })
})