import BaseScreen from "./base-screen.js";

export default class ProductScreen extends BaseScreen {
  #productService;

  constructor(productService, prompt) {
    super(prompt);
    this.#productService = productService;
  }

  openProductUI() {
    console.log("========== Product ==========");

    console.log(
      "[1].물품 등록 [2].물품들 확인 [3].전자제품 물품들 확인 [4].특정 물품 확인(찜)",
    );
    return Number(
      this.prompt.askSync(
        "[5].물품 수정 [6].물품 삭제 [7].이전으로... [8].종료 -> ",
      ),
    );
  }

  async openCreateProductUI() {
    const newProductName =
      await this.prompt.askAsync("새 물품의 이름을 입력하세요: ");
    const newProductDescription = await this.prompt.askAsync(
      "새 물품의 상세 설명을 입력하세요: ",
    );
    const newProductPrice =
      await this.prompt.askAsync("새 물품의 가격을 입력하세요: ");
    const newProductImages = await this.prompt.askAsync(
      "새 물품의 이미지 주소를 입력하세요(2개 이상일 시 콤마(,)를 사용해주세요, (https:// 생략가능)): ",
    );
    const newProductTags = await this.prompt.askAsync(
      "새 물품의 해시태크를 입력하세요(2개 이상일 시 콤마(,)를 사용해주세요): ",
    );

    const imagesArr = newProductImages.split(",").map((img) => {
      const trimmed = img.trim();
      return trimmed.startsWith("https://") ? trimmed : "https://" + trimmed;
    });

    const surveyData = {
      images: imagesArr,
      tags: newProductTags.split(",").map((str) => str.trim()),
      price: Number(newProductPrice),
      description: newProductDescription.trim(),
      name: newProductName.trim(),
    };

    const resNewProduct = await this.#productService.createProduct(surveyData);

    if (!resNewProduct) {
      return false;
    }
    const tags =
      resNewProduct.tags && resNewProduct.tags.length > 0
        ? resNewProduct.tags.join(", ")
        : "없음";

    const images =
      resNewProduct.images && resNewProduct.images.length > 0
        ? resNewProduct.images.join(", ")
        : "없음";

    console.log(
      `id: ${resNewProduct.id}\n` +
        `상품명: ${resNewProduct.name}\n` +
        `상품 설명: ${resNewProduct.description}\n` +
        `판매 가격: ${resNewProduct.price}\n` +
        `찜하기 수: ${resNewProduct.favoriteCount}\n` +
        `해시태그: ${tags}\n` +
        `이미지: ${images}\n` +
        `생성된 시간: ${resNewProduct.createdAt}\n` +
        `수정된 시간: ${resNewProduct.updatedAt}\n`,
    );
  }

  async openLoadProductsUI() {
    const pageNumber = await this.prompt.askAsync(
      "보고 싶은 페이지 번호를 입력하세요: ",
    );
    const pageSize = await this.prompt.askAsync(
      "상품 정보를 몇 개 보고 싶으세요?: ",
    );
    const res = await this.#productService.loadProducts({
      page: Number(pageNumber),
      pageSize: Number(pageSize),
      orderBy: "recent", // 최근 등록순
    });

    const products = res.products ?? []; // 비어있으면 []

    if (products.length === 0) {
      console.log("물품이 없습니다.");
      return false;
    }

    for (const product of products) {
      const tags =
        product.tags && product.tags.length > 0
          ? product.tags.join(", ")
          : "없음";

      const images =
        product.images && product.images.length > 0
          ? product.images.join(", ")
          : "없음";

      console.log(
        `ID: ${product.id}\n` +
          `상품명: ${product.name}\n` +
          `상품 설명: ${product.description}\n` +
          `판매 가격: ${product.price}\n` +
          `찜하기 수: ${product.favoriteCount}\n` +
          `해시태그: ${tags}\n` +
          `이미지: ${images}\n` +
          `생성된 시간: ${product.createdAt}\n` +
          `수정된 시간: ${product.updatedAt}\n`,
      );
    }
  }

  async openLoadElectronicProductsUI() {
    const pageNumber = await this.prompt.askAsync(
      "보고 싶은 페이지 번호를 입력하세요: ",
    );
    const pageSize = await this.prompt.askAsync(
      "상품 정보를 몇 개 보고 싶으세요?: ",
    );
    const res = await this.#productService.loadElectronicProducts({
      page: Number(pageNumber),
      pageSize: Number(pageSize),
      orderBy: "recent", // 최근 등록순
    });

    const products = res.products ?? []; // 비어있으면 []

    if (products.length === 0) {
      console.log("전자제품 물품이 없습니다.");
      return false;
    }

    for (const product of products) {
      const tags =
        product.tags && product.tags.length > 0
          ? product.tags.join(", ")
          : "없음";

      const images =
        product.images && product.images.length > 0
          ? product.images.join(", ")
          : "없음";
      console.log(
        `ID: ${product.id}\n` +
          `상품명: ${product.name}\n` +
          `상품 설명: ${product.description}\n` +
          `판매 가격: ${product.price}\n` +
          `찜하기 수: ${product.favoriteCount}\n` +
          `해시태그: ${tags}\n` +
          `이미지: ${images}\n` +
          `생성된 시간: ${product.createdAt}\n` +
          `수정된 시간: ${product.updatedAt}\n`,
      );
    }
  }
  async openGetProductUI() {
    const id = Number(this.prompt.askSync("보고 싶은 물품 id를 입력하세요: "));
    const product = await this.#productService.loadProduct(id);
    if (!product) {
      return false;
    }
    const tags =
      product.tags && product.tags.length > 0
        ? product.tags.join(", ")
        : "없음";

    const images =
      product.images && product.images.length > 0
        ? product.images.join(", ")
        : "없음";

    let favoriteSum = product.favoriteCount;
    let favoriteCheck = false;
    while (true) {
      console.log(`=============<${product.id} 물품>==============`);
      const choice = Number(
        this.prompt.askSync(
          "[1].물품 보기 [2].찜하기 [v] [3].이전으로... [4].종료 -> ",
        ),
      );
      if (choice === 1) {
        console.log(
          `id: ${product.id}\n` +
            `상품명: ${product.name}\n` +
            `상품 설명: ${product.description}\n` +
            `판매 가격: ${product.price}\n` +
            `찜하기 수: ${product.favoriteCount}\n` +
            `해시태그: ${tags}\n` +
            `이미지: ${images}\n` +
            `생성된 시간: ${product.createdAt}\n` +
            `수정된 시간: ${product.updatedAt}\n`,
        );
      } else if (choice === 2) {
        if (!favoriteCheck) {
          favoriteSum = await this.#productService.favoritePush(product);
          console.log("찜 하셨습니다!!!");
          console.log(`현재 ${product.name}의 찜하기 수: ${favoriteSum}`);
          favoriteCheck = true;
        } else {
          console.log("이미 찜 했습니다.");
        }
      } else if (choice === 3) {
        break;
      } else {
        process.exit(0);
      }
    }
  }

  async openUpdateProductUI() {
    const productId =
      await this.prompt.askAsync("수정할 물품 id를 입력하세요: ");
    const updateProductName = await this.prompt.askAsync("이름을 수정하세요: ");
    const updateProductDescription =
      await this.prompt.askAsync("상세 설명을 수정하세요: ");
    const updateProductPrice =
      await this.prompt.askAsync("가격을 수정하세요: ");
    const updateProductImages = await this.prompt.askAsync(
      "이미지 주소를 수정하세요(2개 이상일 시 콤마(,)를 사용, (https:// 생략가능)): ",
    );
    const updateProductTags = await this.prompt.askAsync(
      "해시태크를 수정하세요(2개 이상일 시 콤마(,)를 사용): ",
    );

    const imagesArr = updateProductImages.split(",").map((img) => {
      const trimmed = img.trim();
      return trimmed.startsWith("https://") ? trimmed : "https://" + trimmed;
    });

    const surveyData = {
      images: imagesArr,
      tags: updateProductTags.split(",").map((str) => str.trim()),
      price: Number(updateProductPrice),
      description: updateProductDescription.trim(),
      name: updateProductName.trim(),
    };

    const resUpdatedProduct = await this.#productService.updateProduct(
      Number(productId),
      surveyData,
    );

    if (!resUpdatedProduct) {
      return false;
    }
    const tags =
      resUpdatedProduct.tags && resUpdatedProduct.tags.length > 0
        ? resUpdatedProduct.tags.join(", ")
        : "없음";

    const images =
      resUpdatedProduct.images && resUpdatedProduct.images.length > 0
        ? resUpdatedProduct.images.join(", ")
        : "없음";

    console.log("-----------UPDATED 물품-----------");
    console.log(
      `id: ${resUpdatedProduct.id}\n` +
        `상품명: ${resUpdatedProduct.name}\n` +
        `상품 설명: ${resUpdatedProduct.description}\n` +
        `판매 가격: ${resUpdatedProduct.price}\n` +
        `찜하기 수: ${resUpdatedProduct.favoriteCount}\n` +
        `해시태그: ${tags}\n` +
        `이미지: ${images}\n` +
        `생성된 시간: ${resUpdatedProduct.createdAt}\n` +
        `수정된 시간: ${resUpdatedProduct.updatedAt}\n`,
    );
  }

  async openProductDeleteUI() {
    const deleteId =
      await this.prompt.askAsync("삭제할 물품 id를 입력하세요: ");
    const deletedProduct = await this.#productService.deleteProduct(
      Number(deleteId),
    );
    if (!deletedProduct) {
      return false;
    }
    console.log(`ID [${deleteId}] 물품이 삭제되었습니다.`);
  }
}
