export const AsyncFunction: () => Promise<void> = async function () { }
export const AsyncGeneratorFunction: () => AsyncGenerator<void, void, unknown> = async function* () { }
export const AsyncGeneratorPrototype: object | null = Object.getPrototypeOf(AsyncGeneratorFunction)
