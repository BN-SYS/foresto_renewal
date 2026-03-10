/* =============================================
   admin.js | 관리자 공통 로직 (레이아웃 + 권한)
   ============================================= */
'use strict';

const AdminLayout = {
  toggleSidebar() {
    const sb = document.getElementById('adminSidebar');
    if (!sb) return;
    if (window.innerWidth <= 900) {
      sb.classList.toggle('mobile-open');
    } else {
      sb.classList.toggle('collapsed');
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
