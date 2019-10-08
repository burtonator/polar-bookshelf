/**
 * Simple array queue with easier operations.
 */
export class ArrayQueue<T> {

    private backing: T[] = [];

    public push(value: T): void {
        this.backing.push(value);
    }

    public pop(): T | undefined {
        return this.backing.pop();
    }

    public peek(): T | undefined {

        if (this.backing.length > 0) {
            return this.backing[0];
        }

        return undefined;

    }

    public delete(value: T) {
        const idx = this.backing.indexOf(value);
        this.backing.splice(idx, 1);
    }

    public size(): number {
        return this.backing.length;
    }

}
