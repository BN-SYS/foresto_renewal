/* =============================================
   app.js | 전역 App 객체 / 공통 유틸
   ============================================= */
'use strict';

const App = {

  /* ── 사용자 상태 (실제 구현 시 서버 세션으로 교체) */
  user: {
    isLoggedIn: false,
    name: '',
    role: 'guest',   // guest | member | fullMember | admin
    grade: '',
  },

  /* ── 로그인 처리 */
  login(userData) {
    this.user = {
      isLoggedIn: true,
      name: userData.name || '',
      role: userData.role || 'member',
      grade: userData.grade || '준회원',
    };
    /* 로컬스토리지에 세션 저장 */
    localStorage.setItem('appUser', JSON.stringify(this.user));
  },

  /* ── 로그아웃 처리 */
  logout() {
    localStorage.removeItem('appUser');
    this.user = {
      isLoggedIn: false,
      name: '',
      role: 'guest',
      grade: '',
    };
    this.toast('로그아웃 되었습니다.');
    setTimeout(() => {
      /* 현재 경로에서 v2/ 루트의 index.html 로 이동
         pathname 예: /v2/admin/index.html → depth 2 → ../../index.html */
      const parts = location.pathname.split('/').filter(Boolean);
      const v2Idx = parts.lastIndexOf('v2');
      const depth = v2Idx >= 0 ? parts.length - v2Idx - 1 : 0;
      location.href = (depth > 0 ? '../'.repeat(depth) : './') + 'index.html';
    }, 800);
  },

  /* ── 세션 복원 (모든 페이지 진입 시 자동 호출) */
  restoreSession() {
    try {
      const saved = localStorage.getItem('appUser');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.isLoggedIn) this.user = parsed;
      }
    } catch (e) { /* 파싱 오류 무시 */ }
  },

  /* ── 날짜 포맷 */
  fmtDate(str) {
    if (!str) return '';
    const d = new Date(str);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  },

  /* ── 상대 경로 계산 (depth 기준) */
  getRoot(depth = 1) {
    return '../'.repeat(depth);
  },

  /* ── 토스트 알림
       배경색은 CSS 변수 기반 클래스로 제어 (components.css의 .toast-* 참조) */
  toast(msg, type = 'success') {
    let el = document.getElementById('toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'toast';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    /* type 클래스로 색상 제어: toast-success / toast-error / toast-warning / toast-info */
    el.className = `toast-${type}`;
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('show'), 3000);
  },

  /* ── 모달 열기/닫기
       모달 요소에 role="dialog" aria-modal="true" aria-labelledby="..." 권장 */
  openModal(id) {
    const m = document.getElementById(id);
    if (m) {
      m.classList.add('open');
      m.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      /* 포커스 트랩: 모달 내 첫 번째 포커서블 요소로 이동 */
      const focusable = m.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusable) focusable.focus();
    }
  },
  closeModal(id) {
    const m = document.getElementById(id);
    if (m) {
      m.classList.remove('open');
      m.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  },

  /* ── 탭 초기화 */
  initTabs(wrap) {
    const btns = wrap.querySelectorAll('.tab-btn');
    const panels = wrap.querySelectorAll('.tab-panel');
    const activate = i => {
      btns.forEach((b, j) => b.classList.toggle('active', i === j));
      panels.forEach((p, j) => p.style.display = i === j ? 'block' : 'none');
    };
    btns.forEach((b, i) => b.addEventListener('click', () => activate(i)));
    activate(0);
  },

  /* ── 페이지네이션 렌더 */
  renderPagination(containerId, current, total, onPage) {
    const el = document.getElementById(containerId);
    if (!el || total <= 1) {
      if (el) el.innerHTML = '';
      return;
    }
    const G = 10;
    const gs = Math.floor((current - 1) / G) * G + 1;
    const ge = Math.min(gs + G - 1, total);

    let h = `<button class="page-btn arrow"
                     ${current === 1 ? 'disabled' : ''}
                     data-p="${current - 1}">&#8249;</button>`;

    for (let i = gs; i <= ge; i++) {
      h += `<button class="page-btn ${i === current ? 'active' : ''}"
                    data-p="${i}">${i}</button>`;
    }

    h += `<button class="page-btn arrow"
                  ${current === total ? 'disabled' : ''}
                  data-p="${current + 1}">&#8250;</button>`;

    el.innerHTML = h;
    el.querySelectorAll('.page-btn:not([disabled])').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = parseInt(btn.dataset.p);
        if (p >= 1 && p <= total) onPage(p);
      });
    });
  },

  /* ── URL 파라미터 파싱 */
  getParam(key) {
    return new URLSearchParams(location.search).get(key);
  },

  /* ── 글자 크기 조절 */
  fontSize: {
    _step: 0,          // 현재 단계 (-2 ~ +3)
    _min: -2,
    _max: 3,
    _key: 'fontSizeStep',
    _sizes: [12, 14, 16, 18, 20, 22],   // step -2 ~ +3 기준 px
    _base: 16,                          // 기본 root font-size

    init() {
      const saved = parseInt(localStorage.getItem(this._key) || '0');
      this._step = Math.max(this._min, Math.min(this._max, saved));
      this._apply();
    },

    up() {
      if (this._step >= this._max) {
        App.toast('최대 글자 크기입니다.', 'info');
        return;
      }
      this._step++;
      this._apply();
      this._save();
    },

    down() {
      if (this._step <= this._min) {
        App.toast('최소 글자 크기입니다.', 'info');
        return;
      }
      this._step--;
      this._apply();
      this._save();
    },

    reset() {
      this._step = 0;
      this._apply();
      this._save();
      App.toast('글자 크기를 기본으로 되돌렸습니다.', 'info');
    },

    _apply() {
      const size = this._base + this._step * 2;
      const scale = size / this._base;

      /* 1. html font-size → rem 단위 전체 반영 */
      document.documentElement.style.fontSize = size + 'px';

      /* 2. body font-size 직접 적용 */
      document.body.style.fontSize = size + 'px';

      /* 3. CSS 변수 px 값도 scale에 맞게 덮어쓰기
            → variables.css 에서 px로 남아있는 곳까지 커버 */
      const r = document.documentElement;
      r.style.setProperty('--text-xs', Math.round(11 * scale) + 'px');
      r.style.setProperty('--text-sm', Math.round(12 * scale) + 'px');
      r.style.setProperty('--text-md', Math.round(14 * scale) + 'px');
      r.style.setProperty('--text-base', Math.round(15 * scale) + 'px');
      r.style.setProperty('--text-lg', Math.round(18 * scale) + 'px');
      r.style.setProperty('--text-xl', Math.round(22 * scale) + 'px');
      r.style.setProperty('--text-2xl', Math.round(26 * scale) + 'px');

      /* 4. 버튼 활성 상태 업데이트 */
      const upBtn = document.getElementById('fqBtnUp');
      const downBtn = document.getElementById('fqBtnDown');
      const resetBtn = document.getElementById('fqBtnReset');
      if (upBtn) upBtn.disabled = this._step >= this._max;
      if (downBtn) downBtn.disabled = this._step <= this._min;
      if (resetBtn) resetBtn.disabled = this._step === 0;
    },


    _save() {
      localStorage.setItem(this._key, String(this._step));
    },
  },

};




/* ── 페이지 진입 시 세션 자동 복원 */
App.restoreSession();
App.fontSize.init();   // ← 추가




/* ── 모달 외부 클릭 닫기 */
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) {
    App.closeModal(e.target.id);
  }
});

/* ── ESC 닫기 */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open')
      .forEach(m => App.closeModal(m.id));
  }
});


/* ══════════════════════════════════════════════
   글자 크기 퀵메뉴 — DOM 준비 후 자동 삽입
══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. 퀵메뉴 HTML 삽입 (스타일은 components.css에서 관리) */
  if (!document.getElementById('fontQuickWrap')) {
    document.body.insertAdjacentHTML('beforeend', `
      <div class="font-quick-wrap" id="fontQuickWrap">

        <div class="fq-panel" id="fqPanel">
          <div class="fq-label">글자 크기</div>
          <button class="fq-btn" id="fqBtnUp"
                  onclick="App.fontSize.up()" title="글자 크게" aria-label="글자 크게">
            <span class="fq-ico-lg">가</span>
            <span class="fq-ico-acc">+</span>
          </button>
          <button class="fq-btn fq-btn-reset" id="fqBtnReset"
                  onclick="App.fontSize.reset()" title="기본 크기로" aria-label="글자 크기 기본으로">
            기본
          </button>
          <button class="fq-btn" id="fqBtnDown"
                  onclick="App.fontSize.down()" title="글자 작게" aria-label="글자 작게">
            <span class="fq-ico-sm">가</span>
            <span class="fq-ico-acc">−</span>
          </button>
        </div>

        <button class="fq-toggle" id="fqToggle"
                title="글자 크기 조절" aria-label="글자 크기 조절 패널 열기">가</button>

      </div>
    `);
  }

  /* ── 2. 토글 이벤트 바인딩 */
  const toggleBtn = document.getElementById('fqToggle');
  const panel = document.getElementById('fqPanel');

  if (toggleBtn && panel) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = panel.classList.toggle('open');
      toggleBtn.classList.toggle('open', isOpen);
    });
  }

  /* ── 3. 패널 외부 클릭 시 닫기 */
  document.addEventListener('click', (e) => {
    const wrap = document.getElementById('fontQuickWrap');
    if (wrap && !wrap.contains(e.target)) {
      panel?.classList.remove('open');
      toggleBtn?.classList.remove('open');
    }
  });

  /* ── 4. 현재 단계에 맞게 버튼 상태 초기화 */
  App.fontSize._apply();
});
