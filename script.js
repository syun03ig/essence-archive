document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. CUSTOM CURSOR & MAGNETIC EFFECT (カスタムカーソル & 吸着演出)
     ========================================================================== */
  const cursor = document.querySelector('.custom-cursor');
  const follower = document.querySelector('.cursor-follower');
  const hoverTargets = document.querySelectorAll('.hover-target');

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  // マウス移動検知
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // メインの小さい点は遅延なしで追従
    cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  // フォロワー（外側の円）を滑らかに遅れて追従させるアニメーションループ
  function renderCursor() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;

    follower.style.transform = `translate(${followerX}px, ${followerY}px) translate(-50%, -50%)`;
    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  // ホバーターゲットに対するインタラクティブ反応
  hoverTargets.forEach(target => {
    target.addEventListener('mouseenter', () => {
      document.body.classList.add('hovered');
    });

    target.addEventListener('mouseleave', () => {
      document.body.classList.remove('hovered');
      target.style.transform = ''; // ホバー解除時に位置リセット
    });

    // マグネティック効果（マウスに要素がわずかに引き寄せられる）
    target.addEventListener('mousemove', (e) => {
      const rect = target.getBoundingClientRect();
      const customMoveX = (e.clientX - (rect.left + rect.width / 2)) * 0.2;
      const customMoveY = (e.clientY - (rect.top + rect.height / 2)) * 0.2;

      // ボタンやロゴなどの軽い要素のみ磁石効果を適用
      if (target.classList.contains('nav-link') || target.classList.contains('brand-logo')) {
        target.style.transform = `translate(${customMoveX}px, ${customMoveY}px)`;
      }
    });
  });

  /* ==========================================================================
     2. 3D TILT EFFECT FOR CARDS (作品カードの3D立体傾斜)
     ========================================================================== */
  const cards = document.querySelectorAll('[data-tilt]');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // 傾き角度の計算（最大 ±10度）
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      card.style.transition = 'transform 0.1s ease-out';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    });
  });

  /* ==========================================================================
     3. SCROLL REVEAL (スクロール連動のフェードイン演出)
     ========================================================================== */
  const observerOptions = {
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // フェードインさせる対象の要素を設定
  const revealElements = document.querySelectorAll('.concept-statement, .concept-text, .work-card, .about-lead');
  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    el.style.transition = 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(el);
  });

/* ==========================================================================
     4. LIKE FUNCTIONALITY (お気に入り保存・LocalStorage)
     ========================================================================== */
  const likeBtns = document.querySelectorAll('.like-btn');

  // 保存されているお気に入りIDの配列を取得（無ければ空配列）
  let favorites = JSON.parse(localStorage.getItem('essence_favorites')) || [];

  // 初期化：保存されているアイテムのハートを赤くしておく
  cards.forEach(card => {
    const cardId = card.getAttribute('data-id');
    const btn = card.querySelector('.like-btn');
    if (favorites.includes(cardId) && btn) {
      btn.classList.add('is-active');
    }
  });

  // クリックイベントの登録
  likeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // カードクリックのモーダル発火などを防ぐ

      const parentCard = btn.closest('.work-card');
      const cardId = parentCard.getAttribute('data-id');

      if (btn.classList.contains('is-active')) {
        // お気に入り解除
        btn.classList.remove('is-active');
        favorites = favorites.filter(id => id !== cardId);
      } else {
        // お気に入り追加
        btn.classList.add('is-active');
        favorites.push(cardId);
      }

      // LocalStorageに最新状態を保存
      localStorage.setItem('essence_favorites', JSON.stringify(favorites));
    });
  });

});
