import promptSync from "prompt-sync";
import BaseScreen from "./ui/base-screen.js";

export default class App {
  #homeScreen;
  #productScreen;
  #articleScreen;
  #prompt;

  constructor(homeScreen, productScreen, articleScreen) {
    this.#homeScreen = homeScreen;
    this.#productScreen = productScreen;
    this.#articleScreen = articleScreen;
    this.#prompt = promptSync();
  }

  async run() {
    while (true) {
      const managementChoice = this.#homeScreen.openHomeUI();

      if (managementChoice === 1) {
        while (true) {
          // 물품 관리
          const choice = this.#productScreen.openProductUI();
          if (choice === 1) {
            // 물품 등록
            await this.#productScreen.openCreateProductUI();
          } else if (choice === 2) {
            // 물품 목록
            await this.#productScreen.openLoadProductsUI();
          } else if (choice === 3) {
            // 전자제품 물품 목록
            await this.#productScreen.openLoadElectronicProductsUI();
          } else if (choice === 4) {
            // 특정 물품 보기, 찜 누르기
            await this.#productScreen.openGetProductUI();
          } else if (choice === 5) {
            // 물품 수정
            await this.#productScreen.openUpdateProductUI();
          } else if (choice === 6) {
            // 물품 삭제
            await this.#productScreen.openProductDeleteUI();
          } else if (choice === 7) {
            // 관리 목록으로 나가기
            break;
          } else if (choice === 8) {
            // 종료
            process.exit(0);
          } else {
            // 잘못된 번호 시
            this.#productScreen.openInvalidInputUI();
          }
        }
      } else if (managementChoice === 2) {
        while (true) {
          // 기사 관리
          const choice = this.#articleScreen.openArticleUI();

          if (choice === 1) {
            // 기사 등록
            await this.#articleScreen.openCreateArticleUI();
          } else if (choice === 2) {
            // 기사 확인
            await this.#articleScreen.openLoadArticlesUI();
          } else if (choice === 3) {
            // 특정 기사 확인
            await this.#articleScreen.openLoadArticleUI();
          } else if (choice === 4) {
            // 기사 수정
            await this.#articleScreen.openUpdateArticleUI();
          } else if (choice === 5) {
            // 기사 삭제
            await this.#articleScreen.openArticleDeleteUI();
          } else if (choice === 6) {
            // 관리 목록으로 나가기
            break;
          } else if (choice === 7) {
            // 종료
            process.exit(0);
          } else {
            // 잘못된 번호 시
            await this.#articleScreen.openInvalidInputUI();
          }
        }
      } else if (managementChoice === 3) {
        process.exit(0);
      } else {
        this.#articleScreen.openInvalidInputUI();
      }
    }
  }
}
