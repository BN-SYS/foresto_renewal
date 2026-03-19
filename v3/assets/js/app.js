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

  /* ── 게시물 수정·삭제 권한 체크 (CLAUDE.md 2026-03-19 정책)
   *    관리자: 전체 게시판 모든 글
   *    작성자 본인: 자신이 작성한 글만
   *    실제 서버 환경에서는 item.authorId === App.user.id 로 비교
   */
  canModify(item) {
    if (!App.user?.isLoggedIn) return false;
    if (App.user.role === 'admin') return true;
    return App.user.name === (item.author || '');
  },

  /* ── 게시물 소프트 삭제
   *    @param {string|number} id       - 삭제할 게시물 id
   *    @param {Array|Array[]} arrays   - 탐색할 데이터 배열 (단일 또는 배열의 배열)
   *    @param {string}        listUrl  - 삭제 후 이동할 목록 URL
   */
  deletePost(id, arrays, listUrl) {
    if (!confirm('게시물을 삭제하시겠습니까?\n삭제된 게시물은 복구되지 않습니다.')) return;
    const targets = (Array.isArray(arrays[0]) ? arrays : [arrays]);
    for (const arr of targets) {
      const idx = arr.findIndex(d => String(d.id) === String(id));
      if (idx !== -1) {
        arr[idx].deleted_at = new Date().toISOString(); /* 소프트 삭제 */
        break;
      }
    }
    App.toast('게시물이 삭제되었습니다.', 'success');
    setTimeout(() => { location.href = listUrl; }, 700);
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
            기준(step=0): md=18px(목록/본문), lg=22px(타이틀 = md+4px) */
      const r = document.documentElement;
      r.style.setProperty('--text-xs',   Math.round(13 * scale) + 'px'); /* 13px */
      r.style.setProperty('--text-sm',   Math.round(15 * scale) + 'px'); /* 15px */
      r.style.setProperty('--text-md',   Math.round(18 * scale) + 'px'); /* 18px — 목록·본문 기준 */
      r.style.setProperty('--text-base', Math.round(20 * scale) + 'px'); /* 20px */
      r.style.setProperty('--text-lg',   Math.round(22 * scale) + 'px'); /* 22px — 타이틀 */
      r.style.setProperty('--text-xl',   Math.round(24 * scale) + 'px'); /* 24px */
      r.style.setProperty('--text-2xl',  Math.round(30 * scale) + 'px'); /* 30px */
      r.style.setProperty('--text-3xl',  Math.round(36 * scale) + 'px'); /* 36px */
      r.style.setProperty('--text-4xl',  Math.round(44 * scale) + 'px'); /* 44px */

      /* 4. 헤더 글자크기 버튼 active 상태 동기화 */
      document.querySelectorAll('.font-btn').forEach(btn => {
        btn.classList.remove('active');
        const sz = btn.dataset.size;
        if ((sz === 'sm' && this._step < 0) ||
            (sz === 'md' && this._step === 0) ||
            (sz === 'lg' && this._step > 0)) {
          btn.classList.add('active');
        }
      });
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
   DOM 준비 후 공통 초기화
══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  /* ── 글자크기 버튼 active 상태 초기화 */
  App.fontSize._apply();

  /* ── 모바일 가로 스크롤 탭: active 탭이 뷰포트 안에 들어오도록 스크롤 조정 */
  const pageTabs = document.querySelector('.page-tabs');
  if (pageTabs) {
    const activeTab = pageTabs.querySelector('.page-tab.active');
    if (activeTab) {
      /* active 탭을 컨테이너 중앙에 배치 (페이지 전체 스크롤 방지) */
      const tabLeft    = activeTab.offsetLeft;
      const tabWidth   = activeTab.offsetWidth;
      const containerW = pageTabs.offsetWidth;
      pageTabs.scrollLeft = tabLeft - (containerW / 2) + (tabWidth / 2);
    }
  }
});
