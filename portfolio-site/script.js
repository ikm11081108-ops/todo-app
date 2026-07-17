// ==========================================================
// ポートフォリオサイト用 JavaScript
// ・スマホ用メニューの開閉
// ・メニュー内リンクをタップしたら自動で閉じる
// ・ヘッダーの背景をスクロールに応じて切り替え（透明→白）
// ・「トップへ戻る」ボタンの表示切り替えとクリック処理
// ==========================================================

// HTMLの読み込みが完了してから処理を実行する
document.addEventListener("DOMContentLoaded", () => {

  // ---------- スマホ用メニューの開閉 ----------

  // ヘッダー本体、メニューボタン、ナビゲーション（メニュー本体）を取得
  const header = document.getElementById("header");
  const menuToggle = document.getElementById("menuToggle");
  const headerNav = document.getElementById("headerNav");

  // メニューボタンをクリックしたときの処理
  menuToggle.addEventListener("click", () => {
    // is-open クラスの有無で開閉を切り替える（CSS側で見た目を制御）
    const isOpen = headerNav.classList.toggle("is-open");

    // 開閉状態をボタンにも伝える（アクセシビリティ対応）
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  // メニュー内のリンクをタップしたら、メニューを自動で閉じる
  const navLinks = headerNav.querySelectorAll("a");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      headerNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  // ---------- スクロール連動処理（ヘッダーの背景／トップへ戻るボタン） ----------

  const pageTopBtn = document.getElementById("pageTopBtn");

  window.addEventListener("scroll", () => {
    // 少しでもスクロールしたら、ヘッダーを透明の状態から白背景へ切り替える
    if (window.scrollY > 40) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }

    // 一定量スクロールしたら「トップへ戻る」ボタンを表示する
    if (window.scrollY > 400) {
      pageTopBtn.classList.add("is-visible");
    } else {
      pageTopBtn.classList.remove("is-visible");
    }
  });

  // ボタンをクリックしたらページの一番上へスムーズにスクロール
  pageTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

});
