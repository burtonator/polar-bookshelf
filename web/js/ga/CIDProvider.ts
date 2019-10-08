
export class CIDProvider {

    private value: string | undefined;

    constructor(value: string | undefined) {
        this.value = value;
    }

    public get(): string | undefined {
        return this.value;
    }

}
