import BaseScreen from "./base-screen.js";

export default class ArticleScreen extends BaseScreen {
  #articleService;

  constructor(articleService, prompt) {
    super(prompt);
    this.#articleService = articleService;
  }
  openArticleUI() {
    console.log("========== Article ==========");

    console.log("[1].기사 등록 [2].기사들 확인 [3].특정 기사 확인(좋아요)");
    return Number(
      this.prompt.askSync(
        "[4].기사 수정 [5].기사 삭제 [6].이전으로... [7]. 종료 -> ",
      ),
    );
  }

  async openCreateArticleUI() {
    const newArticleTitle =
      await this.prompt.askAsync("새 기사의 제목을 입력하세요: ");
    const newArticleContent =
      await this.prompt.askAsync("새 기사의 내용을 입력하세요: ");
    const newImage = await this.prompt.askAsync(
      "이미지 주소를 입력하세요(https:// 생략 가능): ",
    );
    const newWriter = await this.prompt.askAsync("작성자를 입력하세요:");

    const imageAdress = newImage.startsWith("https://")
      ? newImage
      : "https://" + newImage;

    const surveyData = {
      image: imageAdress,
      title: newArticleTitle,
      content: newArticleContent,
    };

    const resNewArticle = await this.#articleService.createArticle(
      surveyData,
      newWriter,
    );

    if (!resNewArticle) {
      return false;
    }

    console.log(
      `id: ${resNewArticle.id}\n` +
        `제목: ${resNewArticle.title}\n` +
        `내용: ${resNewArticle.content}\n` +
        `작성자: ${resNewArticle.writer}\n` +
        `좋아요 수: ${resNewArticle.likeCount}\n` +
        `생성된 시간: ${resNewArticle.createdAt}\n`,
    );
  }

  async openLoadArticlesUI() {
    const pageNumber = await this.prompt.askAsync(
      "보고 싶은 페이지 번호를 입력하세요: ",
    );
    const pageSize = await this.prompt.askAsync(
      "상품 정보를 몇 개 보고 싶으세요?: ",
    );
    const res = await this.#articleService.loadArticles({
      page: Number(pageNumber),
      pageSize: Number(pageSize),
      orderBy: "recent", // 최근 등록순
    });

    const articles = res.articles ?? [];
    //console.log(typeof(articles));
    if (articles.length === 0) {
      console.log("기사가 없습니다.");
      return false;
    }

    for (const article of articles) {
      console.log(
        `id: ${article.id}\n` +
          `제목: ${article.title}\n` +
          `내용: ${article.content}\n` +
          `작성자: ${article.writer}\n` +
          `좋아요 수: ${article.likeCount}\n` +
          `생성된 시간: ${article.createdAt}\n`,
      );
    }
  }

  async openLoadArticleUI() {
    const id = Number(this.prompt.askSync("보고 싶은 기사 id를 입력하세요: "));
    const article = await this.#articleService.loadArticle(id);
    if (!article) {
      return false;
    }

    let likeSum = article.likeCount;
    let likeCheck = false;
    while (true) {
      console.log(`=============<${article.id} 기사>==============`);
      const choice = Number(
        this.prompt.askSync(
          "[1].기사 보기 [2].좋아요 [v] [3].이전으로... [4].종료 -> ",
        ),
      );
      if (choice === 1) {
        console.log(
          `id: ${article.id}\n` +
            `제목: ${article.title}\n` +
            `내용: ${article.content}\n` +
            `작성자: ${article.writer}\n` +
            `좋아요 수: ${article.likeCount}\n` +
            `생성된 시간: ${article.createdAt}\n`,
        );
      } else if (choice === 2) {
        if (!likeCheck) {
          likeSum = await this.#articleService.likePush(article);
          console.log("좋아요 하셨습니다!!!");
          console.log(`현재 ${article.title}의 좋아요 수: ${likeSum}`);
          likeCheck = true;
        } else {
          console.log("이미 좋아요 했습니다.");
        }
      } else if (choice === 3) {
        break;
      } else {
        process.exit(0);
      }
    }
  }

  async openUpdateArticleUI() {
    const articleId =
      await this.prompt.askAsync("수정할 기사 id를 입력하세요: ");
    const updateArticleTile = await this.prompt.askAsync("제목을 수정하세요: ");
    const updateArticleContent =
      await this.prompt.askAsync("내용을 수정하세요: ");
    const updateArticleImages = await this.prompt.askAsync(
      "이미지 주소를 수정하세요(https:// 생략가능)): ",
    );

    const imageAdress = updateArticleImages.startsWith("https://")
      ? updateArticleImages
      : "https://" + updateArticleImages;

    const surveyData = {
      image: imageAdress,
      content: updateArticleContent,
      title: updateArticleTile,
    };

    const resUpdatedArticle = await this.#articleService.updateArticle(
      Number(articleId),
      surveyData,
    );

    if (!resUpdatedArticle) {
      return false;
    }

    console.log("-----------UPDATED 기사-----------");
    console.log(
      `id: ${resUpdatedArticle.id}\n` +
        `제목: ${resUpdatedArticle.title}\n` +
        `내용: ${resUpdatedArticle.content}\n` +
        `작성자: ${resUpdatedArticle.writer}\n` +
        `좋아요 수: ${resUpdatedArticle.likeCount}\n` +
        `생성된 시간: ${resUpdatedArticle.createdAt}\n`,
    );
  }

  async openArticleDeleteUI() {
    const deleteId =
      await this.prompt.askAsync("삭제할 기사 id를 입력하세요: ");
    const deletedArticle = await this.#articleService.deleteArticle(
      Number(deleteId),
    );
    if (!deletedArticle) {
      return false;
    }
    console.log(`ID [${deletedArticle.id}] 기사가 삭제되었습니다.`);
  }
}
