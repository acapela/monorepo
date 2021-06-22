export function makePromiseVoidable(input: Promise<unknown>): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    input.then(() => resolve()).catch(reject);
  });
}
