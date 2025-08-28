import promptSync from "prompt-sync";
import readline from "readline";

export default class PromptUtil {
  #prompt;

  constructor() {
    this.#prompt = promptSync();
  }

  // 동기
  askSync(message) {
    return this.#prompt(message);
  }

  // 비동기
  async askAsync(message) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve) => {
      rl.question(message, (answer) => {
        resolve(answer);
        rl.close();
      });
    });
  }
}
