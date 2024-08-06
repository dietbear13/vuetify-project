// plugins/tg-app.js

export default function({ app }, inject) {
    inject('tg', () => {
      const [miniApp] = initMiniApp();
      return miniApp;
    });
  }
  