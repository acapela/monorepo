/**
 * Will open browser file picker and return promise of picked files or null if cancelled.
 *
 * Note: Must be called during trusted event (eg. inside sync handler of onClick etc.)
 */
export async function pickUserFiles(): Promise<File[] | null> {
  return new Promise<File[] | null>((resolve) => {
    const input = document.createElement("input");
    input.type = "file";

    input.addEventListener(
      "change",
      () => {
        if (!input.files) {
          return resolve(null);
        }
        const files = Array.from(input.files);

        resolve(files);

        input.remove();
      },
      { once: true }
    );

    input.click();
  });
}
