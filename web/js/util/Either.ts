import {isPresent} from 'polar-shared/src/Preconditions';

/**
 * A simple either implementation similar to Optional that works for either
 * left or right but requires exactly one option.
 *
 * Includes map functions to handle consuming both at once and a mapLeft and
 * mapRight functions to either type.
 *
 * This is useful in most situations as values can be interfaces which do not
 * work with instanceof and could be deserialized json objects which don't work
 * with instanceof either.
 *
 * Essentially instanceof isn't really reliable.
 */
export class Either<L, R> {

    public readonly hasLeft: boolean;
    public readonly hasRight: boolean;

    private constructor(public readonly left: L,
                        public readonly right: R) {

        this.hasLeft = isPresent(left);
        this.hasRight = isPresent(right);

    }

    /**
     * Handle either the left or the right.
     */
    public handle(left: (left: L) => void,
                  right: (right: R) => void) {

        if (this.hasLeft) {
            left(this.left);
        } else {
            right(this.right);
        }

    }

    public convertLeftToRight(converter: (left: L) => R): R {

        if (this.hasRight) {
            return this.right;
        }

        return converter(this.left);

    }

    public convertRightToLeft(converter: (right: R) => L): L {

        if (this.hasLeft) {
            return this.left;
        }

        return converter(this.right);

    }

    public static ofLeft<L, R>(value: LeftEither<L, R>): Either<L, R> {

        if (value instanceof Either) {
            return value;
        }

        return new Either(value, undefined!);

    }

    public static ofRight<L, R>(value: RightEither<L, R>): Either<L, R> {

        if (value instanceof Either) {
            return value;
        }

        return new Either(undefined!, value);

    }

}

/**
 * An Either but with a primary type of L so we can just use an L literal if we
 * want and have a simpler syntax.
 */
export type LeftEither<L, R> = L | Either<L, R>;

export type RightEither<L, R> = R | Either<L, R>;
