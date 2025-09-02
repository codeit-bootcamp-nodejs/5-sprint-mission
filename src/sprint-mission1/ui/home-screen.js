import BaseScreen from "./base-screen.js";

export default class HomeScreen extends BaseScreen {
  constructor(prompt) {
    super(prompt);
  }

  openHomeUI() {
    console.log("=============== Home ================");
    return Number(
      this.prompt.askSync("[1].물품 관리 [2].기사 관리 [3].종료 -> "),
    );
  }
}
