/* =============================================
   admin.js | 관리자 공통 로직 (레이아웃 + 권한 + 사이드바)
   ============================================= */
'use strict';

/* ── 관리자 사이드바 네비게이션 데이터 */
const ADMIN_NAV = [
  { key: 'dashboard',    href: 'index.html',        ico: '📊', label: '대시보드' },
  { key: 'members',      href: 'members.html',      ico: '👥', label: '회원관리' },
  { key: 'courses',      href: 'courses.html',      ico: '📚', label: '강좌관리' },
  { key: 'calendar',     href: 'calendar.html',     ico: '📅', label: '일정관리' },
  { key: 'history',      href: 'history.html',      ico: '🕐', label: '연혁관리' },
  { key: 'organization', href: 'organization.html', ico: '🏛', label: '조직도/임원진' },
  { key: 'content',      href: 'content.html',      ico: '📝', label: '콘텐츠관리' },
];

/* ── AdminSidebar: 마운트 포인트(#adminNavMount)에 nav 항목을 주입 */
const AdminSidebar = {

  /**
   * @param {string} activeKey - ADMIN_NAV의 key 값
   */
  mount(activeKey) {
    const mountEl = document.getElementById('adminNavMount');
    if (!mountEl) return;

    mountEl.innerHTML = ADMIN_NAV.map(item => `
      <a href="${item.href}"
         class="admin-nav-item ${item.key === activeKey ? 'active' : ''}"
         aria-current="${item.key === activeKey ? 'page' : 'false'}">

        <span class="nav-ico" aria-hidden="true">${item.ico}</span>
        <span class="nav-txt">${item.label}</span>

      </a>
    `).join('');
  },
};


/* ── 관리자 레이아웃 */
const AdminLayout = {

  toggleSidebar() {
    const sb = document.getElementById('adminSidebar');
    const layout = document.querySelector('.admin-layout');

    if (!sb) return;

    if (window.innerWidth <= 900) {
      sb.classList.toggle('mobile-open');
    } else {
      sb.classList.toggle('collapsed');

      /* 레이아웃도 같이 변경 */
      if (layout) {
        layout.classList.toggle('sidebar-collapsed');
      }
    }
  },

};


/* ── 관리자 권한 체크 */
// (function checkAdminAuth() {
//   if (typeof App !== 'undefined' && App.user.role !== 'admin') {
//     alert('관리자만 접근 가능합니다.');
//     location.href = '../index.html';
//   }
// })();