class ZenToolsI18n {

  constructor() {

    this.currentLang =
      localStorage.getItem("zentools-lang")
      || "zh";

    this.translations = {};

  }

  async init() {

    await this.loadLanguage(
      this.currentLang
    );

    this.translatePage();

    this.bindSwitcher();

  }

  async loadLanguage(lang) {

    try {

      const response = await fetch(
        `/locales/${lang}/common.json`
      );

      this.translations =
        await response.json();

      this.currentLang = lang;

      localStorage.setItem(
        "zentools-lang",
        lang
      );

    } catch(error) {

      console.error(
        "语言加载失败",
        error
      );

    }

  }

  translatePage() {

    document
      .querySelectorAll("[data-i18n]")
      .forEach(element => {

        const key =
          element.dataset.i18n;

        if(this.translations[key]) {

          element.textContent =
            this.translations[key];

        }

      });

  }

  async switchLanguage(lang) {

    await this.loadLanguage(lang);

    this.translatePage();

  }

  bindSwitcher() {

    const btn =
      document.getElementById(
        "langToggle"
      );

    if(!btn) return;

    btn.addEventListener(
      "click",
      async () => {

        const nextLang =
          this.currentLang === "zh"
          ? "en"
          : this.currentLang === "en"
          ? "ja"
          : "zh";

        await this.switchLanguage(
          nextLang
        );

        btn.textContent =
          nextLang.toUpperCase();

      }
    );

  }

}

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const i18n =
      new ZenToolsI18n();

    i18n.init();

  }
);
