/* =============================================
   common.js | 공통 유틸·헤더·푸터 모듈
   ============================================= */

const App = {

  /* ── 현재 로그인 상태 (프로토타입 고정값) */
  user: {
    isLoggedIn : true,
    name       : '김숲해설',
    role       : 'fullMember',   // guest | member | fullMember | admin
    grade      : '정회원',
  },

  /* ── 날짜 포맷 */
  fmtDate(str) {
    const d = new Date(str);
    return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;
  },

  /* ── 토스트 */
  toast(msg, type = 'success') {
    const colors = { success:'#40916c', error:'#e74c3c', warning:'#f9a825', info:'#1976d2' };
    const el = Object.assign(document.createElement('div'), { textContent: msg });
    Object.assign(el.style, {
      position:'fixed', bottom:'24px', right:'24px',
      background: colors[type] || colors.success,
      color:'#fff', padding:'12px 20px', borderRadius:'8px',
      fontSize:'14px', fontWeight:'600',
      boxShadow:'0 4px 20px rgba(0,0,0,.2)',
      zIndex:'9999', opacity:'0', transform:'translateY(10px)',
      transition:'all .3s ease', maxWidth:'320px', lineHeight:'1.5',
    });
    document.body.appendChild(el);
    requestAnimationFrame(() => { el.style.opacity='1'; el.style.transform='translateY(0)'; });
    setTimeout(() => { el.style.opacity='0'; setTimeout(() => el.remove(), 300); }, 3000);
  },

  /* ── 모달 열기/닫기 */
  openModal(id)  { const m=document.getElementById(id); if(m){ m.classList.add('open');    document.body.style.overflow='hidden'; } },
  closeModal(id) { const m=document.getElementById(id); if(m){ m.classList.remove('open'); document.body.style.overflow='';       } },

  /* ── 탭 초기화 */
  initTabs(wrap) {
    const btns   = wrap.querySelectorAll('.tab-btn');
    const panels = wrap.querySelectorAll('.tab-panel');
    const activate = i => {
      btns.forEach((b,j)   => b.classList.toggle('active', i===j));
      panels.forEach((p,j) => p.style.display = i===j ? 'block' : 'none');
    };
    btns.forEach((b,i) => b.addEventListener('click', () => activate(i)));
    activate(0);
  },

  /* ── 공통 헤더 렌더 */
  renderHeader(activePage = '') {
    const NAV = [
      {
        label: '협회소개', href: '#',
        children: [
          { label: '인사말',          href: 'about.html' },
          { label: '미션 & 비전',     href: 'about-vision.html' },
          { label: '주요사업',        href: 'about-project.html' },
          { label: '연혁',            href: 'about-history.html' },
          { label: '조직도 & 임원진', href: 'about-members.html' },
          { label: '전국 지역협회',   href: 'about-regions.html' },
          { label: '정관',            href: 'about-constitution.html' },
          { label: '오시는 길',       href: 'about-contact.html' },
        ]
      },
      {
        label: '숲해설가교육', href: 'course-list.html',
        children: [
          { label: '숲해설가란',      href: '#' },
          { label: '자주 묻는 질문',  href: '#' },
          { label: '전문과정 안내',   href: '#' },
          { label: '전문과정 신청',   href: 'course-list.html' },
          { label: '시민아카데미',    href: '#' },
          { label: '직무교육',        href: '#' },
        ]
      },
      {
        label: '회원활동', href: '#',
        children: [
          { label: '역량강화 교육강좌',  href: '#' },
          { label: '멘토링 숲학교',      href: '#' },
          { label: '수시숲해설 모집',    href: '#' },
          { label: '숲해설 강사 신청',   href: '#' },
          { label: '사공단 소식',        href: '#' },
          { label: '동아리 소식',        href: '#' },
        ]
      },
      {
        label: '커뮤니티', href: 'calendar.html',
        children: [
          { label: '공지사항',           href: 'notice-list.html' },
          { label: '협회일정',           href: 'calendar.html' },
          { label: '자유게시판',         href: '#' },
          { label: '언론보도',           href: '#' },
          { label: '일자리 및 교육정보', href: '#' },
          { label: '갤러리',             href: '#' },
          { label: '협회소식지',         href: '#' },
          { label: '자료실',             href: '#' },
        ]
      },
      {
        label: '참여', href: '#',
        children: [
          { label: '정회원 가입안내',  href: '#' },
          { label: '후원안내',         href: '#' },
          { label: '후원하기',         href: '#' },
        ]
      },
    ];

    const navHtml = NAV.map(n => {
      if (!n.children) {
        return `<a href="${n.href}" class="nav-item ${activePage === n.label ? 'active' : ''}">${n.label}</a>`;
      }
      const subHtml = n.children.map(c =>
        `<a href="${c.href}" class="sub-item">${c.label}</a>`
      ).join('');
      return `
        <div class="nav-item has-dropdown ${activePage === n.label ? 'active' : ''}">
          <a href="${n.href}">${n.label}<span class="arrow"></span></a>
          <div class="dropdown">${subHtml}</div>
        </div>`;
    }).join('');

    const actHtml = this.user.isLoggedIn
      ? `<span class="header-username">${this.user.name} (${this.user.grade})</span>
         <a href="mypage.html" class="btn btn-outline btn-sm">마이페이지</a>
         <a href="admin.html"  class="btn btn-gray btn-sm">관리자</a>
         <button class="btn btn-gray btn-sm" onclick="App.toast('로그아웃 되었습니다.')">로그아웃</button>`
      : `<button class="btn btn-outline btn-sm">로그인</button>
         <button class="btn btn-primary btn-sm">회원가입</button>`;

    return `
    <header class="site-header">
      <div class="header-inner">
        <a href="index.html" class="logo">
          <div class="logo-text">
            <strong>한국숲해설가협회</strong>
            <span>Korea Forest Interpreter Association</span>
          </div>
        </a>
        <nav class="main-nav">${navHtml}</nav>
        <div class="header-actions">${actHtml}</div>
      </div>
    </header>`;
  },

  /* ── 공통 푸터 렌더 */
  renderFooter() {
    return `
    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-info">
          <p><strong>사단법인 한국숲해설가협회</strong></p>
          <p>주소: 서울특별시 OO구 OO로 OOO &nbsp;|&nbsp; 대표전화: 02-000-0000</p>
          <p>이메일: info@forest-guide.or.kr &nbsp;|&nbsp; 사업자등록번호: 000-00-00000</p>
        </div>
        <div class="footer-links">
          <a href="#">이용약관</a>
          <a href="#"><strong>개인정보취급방침</strong></a>
          <a href="#">이메일 무단수집 거부</a>
          <a href="#" onclick="App.toast('구 홈페이지로 이동합니다.')">구 홈페이지</a>
        </div>
      </div>
      <div class="footer-copy">Copyright © 2026 한국숲해설가협회. All rights reserved.</div>
    </footer>`;
  },
};

/* ── 모달 외부 클릭 닫기 */
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) App.closeModal(e.target.id);
});
