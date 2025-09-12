export default class BaseScreen {
  prompt;

  constructor(promptUtil) {
    this.prompt = promptUtil;
  }

  openInvalidInputUI() {
    return console.log("\t입력이 잘못되었습니다.");
  }
}
