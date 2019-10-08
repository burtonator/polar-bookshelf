import {assert} from 'chai';
import {Either} from './Either';
import {assertJSON} from '../test/Assertions';

describe('Either', function() {

    it("basic", function() {

        const values: any[] = [];

        const myFunction = (either: Either<string, number>) => {

            either.handle((left) => values.push(left),
                          (right) => values.push(right));

        };

        myFunction(Either.ofLeft("left"));
        myFunction(Either.ofRight(101));

        assertJSON(values, [
            "left",
            101
        ]);

    });

    it("convertLeftToRight", function() {

        const either0: Either<string, number> = Either.ofLeft('123');
        const either1: Either<string, number> = Either.ofRight(123);

        assert.equal(either0.convertLeftToRight(value => Number.parseInt(value)), 123);
        assert.equal(either1.convertLeftToRight(value => Number.parseInt(value)), 123);

    });

});
