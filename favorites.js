document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. CUSTOM CURSOR & MAGNETIC EFFECT
     ========================================================================== */
  const cursor = document.querySelector('.custom-cursor');
  const follower = document.querySelector('.cursor-follower');
  const hoverTargets = document.querySelectorAll('.hover-target');

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  function renderCursor() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    follower.style.transform = `translate(${followerX}px, ${followerY}px) translate(-50%, -50%)`;
    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  hoverTargets.forEach(target => {
    target.addEventListener('mouseenter', () => document.body.classList.add('hovered'));
    target.addEventListener('mouseleave', () => document.body.classList.remove('hovered'));
  });

  /* ==========================================================================
     2. DISPLAY FAVORITES (お気に入りデータの展開)
     ========================================================================== */
  // 全作品データ定義（実務ではAPIやデータベースから取得するイメージです）
  const allWorks = {
    'work-01': {
      num: '01',
      title: 'MONOLITH CHAIR',
      cat: 'PRODUCT / 2026',
      imgClass: 'img-1'
    },
    'work-02': {
      num: '02',
      title: 'SHADOW & LIGHT',
      cat: 'ARCHITECTURE / 2025',
      imgClass: 'img-2'
    },
    'work-03': {
      num: '03',
      title: 'VOID SPACE',
      cat: 'INTERIOR / 2025',
      imgClass: 'img-3'
    },
    'work-04': {
      num: '04',
      title: 'RAW SILENCE',
      cat: 'EXHIBITION / 2026',
      imgClass: 'img-4'
    }
  };

  const gridContainer = document.getElementById('favorites-grid');
  const emptyMessage = document.getElementById('empty-message');
  
  // LocalStorageから取得
  let favorites = JSON.parse(localStorage.getItem('essence_favorites')) || [];

  function renderFavorites() {
    gridContainer.innerHTML = '';

    if (favorites.length === 0) {
      emptyMessage.style.display = 'block';
      return;
    }

    emptyMessage.style.display = 'none';

    favorites.forEach(id => {
      const item = allWorks[id];
      if (!item) return;

      const card = document.createElement('article');
      card.className = 'work-card hover-target';
      card.setAttribute('data-id', id);

      card.innerHTML = `
        <div class="card-img-wrap">
          <div class="dummy-img ${item.imgClass}"></div>
          <div class="card-overlay"><span>VIEW PROJECT</span></div>
          <button class="like-btn is-active hover-target" aria-label="お気に入りから削除">
            <svg class="heart-icon" viewBox="0 0 24 24" width="20" height="20">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </button>
        </div>
        <div class="card-info">
          <span class="card-num font-mono">${item.num}</span>
          <h3 class="card-title">${item.title}</h3>
          <p class="card-cat font-mono">${item.cat}</p>
        </div>
      `;

      // 削除イベントの登録
      const likeBtn = card.querySelector('.like-btn');
      likeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        favorites = favorites.filter(favId => favId !== id);
        localStorage.setItem('essence_favorites', JSON.stringify(favorites));
        renderFavorites(); // 再描画
      });

      gridContainer.appendChild(card);
    });
  }

  renderFavorites();

});
