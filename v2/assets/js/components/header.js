/* =============================================
   header.js | 헤더 / 푸터 렌더링
   ============================================= */
'use strict';

const NAV_DATA = [
  {
    label: '협회소개', href: 'about/index.html',
    children: [
      { label: '인사말', href: 'about/index.html' },
      { label: '미션 & 비전', href: 'about/vision.html' },
      { label: '주요사업', href: 'about/project.html' },
      { label: '연혁', href: 'about/history.html' },
      { label: '조직도·임원진', href: 'about/members.html' },
      { label: '전국 지역협회', href: 'about/regions.html' },
      { label: '정관', href: 'about/constitution.html' },
      { label: '오시는 길', href: 'about/contact.html' },
    ]
  },
  {
    label: '숲해설가교육', href: 'education/forester.html',
    children: [
      { label: '숲해설가란', href: 'education/forester.html' },
      { label: '자주 묻는 질문', href: 'education/faq.html' },
      { label: '전문과정 안내', href: 'education/course-intro.html' },
      { label: '전문과정 신청', href: 'education/course-list.html' },
      { label: '시민아카데미', href: 'education/academy.html' },
      { label: '직무교육', href: 'education/job-training.html' },
    ]
  },
  {
    label: '회원활동', href: 'member/competency.html',
    children: [
      { label: '역량강화 교육강좌', href: 'member/competency.html' },
      { label: '멘토링 숲학교', href: 'member/mentoring.html' },
      { label: '수시숲해설 모집', href: 'member/recruit.html' },
      { label: '숲해설 강사 신청', href: 'member/instructor.html' },
      { label: '사공단 소식', href: 'member/sagongdan.html' },
      { label: '동아리 소식', href: 'member/club.html' },
      { label: '이게뭐예요', href: 'member/qna.html' },
    ]
  },
  {
    label: '커뮤니티', href: 'community/notice-list.html',
    children: [
      { label: '공지사항', href: 'community/notice-list.html' },
      { label: '협회일정', href: 'community/calendar.html' },
      { label: '자유게시판', href: 'community/free.html' },
      { label: '언론보도', href: 'community/press.html' },
      { label: '일자리 및 교육정보', href: 'community/job.html' },
      { label: '갤러리', href: 'community/gallery.html' },
      { label: '협회소식지', href: 'community/newsletter.html' },
      { label: '자료실', href: 'community/archive.html' },
    ]
  },
  {
    label: '참여', href: 'participate/membership.html',
    children: [
      { label: '정회원 가입안내', href: 'participate/membership.html' },
      { label: '후원안내', href: 'participate/donate-info.html' },
      { label: '후원하기', href: 'participate/donate.html' },
    ]
  },
];

const Header = {

  render(activePage = '', root = '../') {
    const navHtml = NAV_DATA.map(n => {
      const isActive = n.label === activePage
        || n.children?.some(c => c.href === activePage);
      const subHtml = n.children
        ? n.children.map(c =>
          `<a href="${root}${c.href}" class="sub-item">${c.label}</a>`
        ).join('')
        : '';

      if (!n.children) {
        return `<a href="${root}${n.href}"
                   class="nav-item ${isActive ? 'active' : ''}">
                  ${n.label}
                </a>`;
      }
      return `
        <div class="nav-item has-dropdown ${isActive ? 'active' : ''}">
          <a href="${root}${n.href}">
            ${n.label}<span class="arrow"></span>
          </a>
          <div class="dropdown">${subHtml}</div>
        </div>`;
    }).join('');

    /* ── 로그인 여부에 따른 우측 버튼 분기 */
    const authHtml = App.user.isLoggedIn
      ? `<span class="header-username">
           ${App.user.name} (${App.user.grade})
         </span>
         <a href="${root}mypage/index.html"
            class="btn btn-primary btn-sm">마이페이지</a>
         ${App.user.role === 'admin'
        ? `<a href="${root}admin/index.html"
                 class="btn btn-gray btn-sm">관리자</a>`
        : ''}
         <button class="btn btn-gray btn-sm"
                 onclick="App.logout()">로그아웃</button>`
      : `<a href="${root}auth/login.html"
            class="btn btn-outline btn-sm">로그인</a>
         <a href="${root}auth/register.html"
            class="btn btn-primary btn-sm">회원가입</a>`;

    /* ── 모바일 내비 */
    const mobileNavHtml = NAV_DATA.map((n, i) => {
      const subHtml = n.children
        ? `<div class="mobile-sub-wrap" id="msub${i}">
             ${n.children.map(c =>
          `<a href="${root}${c.href}"
                   class="mobile-sub-item">${c.label}</a>`
        ).join('')}
           </div>`
        : '';
      return `
        <div class="mobile-nav-item ${n.label === activePage ? 'active' : ''}"
             onclick="Header.toggleMobileSub('msub${i}', this)">
          ${n.label}
          ${n.children ? '<span class="arrow"></span>' : ''}
        </div>
        ${subHtml}`;
    }).join('');

    /* ── 모바일 하단 인증 영역 */
    const mobileAuthHtml = App.user.isLoggedIn
      ? `<a href="${root}mypage/index.html"
            class="btn btn-outline btn-sm"
            style="width:100%;margin-bottom:8px;justify-content:center">
           마이페이지
         </a>
         <button class="btn btn-gray btn-sm"
                 style="width:100%;justify-content:center"
                 onclick="App.logout()">로그아웃</button>`
      : `<a href="${root}auth/login.html"
            class="btn btn-outline btn-sm"
            style="width:100%;margin-bottom:8px;justify-content:center">
           로그인
         </a>
         <a href="${root}auth/register.html"
            class="btn btn-primary btn-sm"
            style="width:100%;justify-content:center">
           회원가입
         </a>`;

    return `
    <header class="site-header">
      <div class="header-inner">

        <!-- ── 로고 (이미지 버전) -->
        <a href="${root}index.html" class="logo">
  <div class="logo-img">
    <img src="${root}assets/image//logo.png"
         alt="한국숲해설가협회">
  </div>
</a>
        <nav class="main-nav" id="mainNav">${navHtml}</nav>
        <div class="header-actions">
          <div id="authArea">${authHtml}</div>
          <button class="hamburger" id="hamburger"
                  onclick="Header.toggleMobileMenu()"
                  aria-label="메뉴 열기/닫기"
                  aria-expanded="false"
                  aria-controls="mobileNav">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>

    <div class="mobile-nav" id="mobileNav">
      ${mobileNavHtml}
      <div style="padding:16px 24px;display:flex;
                  flex-direction:column;gap:8px">
        ${mobileAuthHtml}
      </div>
    </div>`;
  },

  _lockScrollY: 0, /* 스크롤 잠금 시 저장 위치 */

  toggleMobileMenu() {
    const nav = document.getElementById('mobileNav');
    const btn = document.getElementById('hamburger');
    const open = nav.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');

    if (open) {
      /* 현재 스크롤 위치 저장 후 body를 fixed로 고정 (iOS Safari 대응) */
      Header._lockScrollY = window.scrollY;
      document.body.style.overflow   = 'hidden';
      document.body.style.position   = 'fixed';
      document.body.style.top        = `-${Header._lockScrollY}px`;
      document.body.style.width      = '100%';
    } else {
      /* 스크롤 잠금 해제 후 위치 복원 */
      document.body.style.overflow  = '';
      document.body.style.position  = '';
      document.body.style.top       = '';
      document.body.style.width     = '';
      window.scrollTo(0, Header._lockScrollY);
    }
  },

  toggleMobileSub(id, el) {
    const sub = document.getElementById(id);
    if (!sub) return;
    const open = sub.classList.toggle('open');
    const arrow = el.querySelector('.arrow');
    if (arrow) arrow.style.transform = open ? 'rotate(180deg)' : '';
  },
};

const Footer = {
  render(root = '../') {
    return `
    <footer class="site-footer">
      <div class="footer-inner container">

        <!-- 좌측: 기관정보 + 정책링크 -->
        <div class="footer-info">
          <a href="${root}index.html" class="footer-logo-img-wrap">
            <img src="${root}assets/image/logo.png" alt="한국숲해설가협회" class="footer-logo-img">
          </a>
          <p>주소: 06753 서울시 서초구 바우뫼로 158(양재동 유향빌딩 4층)</p>
          <p>대표전화: 02-747-6518 &nbsp;|&nbsp; FAX: 02-747-6519</p>
          <p>이메일: <a href="mailto:foresto123@hanmail.net">foresto123@hanmail.net</a></p>
          <div class="footer-links">
            <a href="${root}privacy.html">개인정보처리방침</a>
            <a href="${root}terms.html">이용약관</a>
            <a href="${root}email.html">이메일 무단수집 거부</a>
          </div>
        </div>

        <!-- 우측: SNS + 패밀리사이트 -->
        <div class="footer-right">

          <!-- SNS 아이콘 -->
          <div class="footer-sns">
            <a href="#" class="footer-sns-btn footer-sns-naver" title="네이버 블로그"
              aria-label="네이버 블로그 (새 창에서 열림)"
              onclick="App.toast('블로그로 이동합니다.');return false;">
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M16.273 12.845 7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z"/>
              </svg>
            </a>
            <a href="#" class="footer-sns-btn footer-sns-yt" title="유튜브"
              aria-label="유튜브 (새 창에서 열림)"
              onclick="App.toast('유튜브로 이동합니다.');return false;">
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            <a href="#" class="footer-sns-btn footer-sns-insta" title="인스타그램"
              aria-label="인스타그램 (새 창에서 열림)"
              onclick="App.toast('인스타그램으로 이동합니다.');return false;">
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
              </svg>
            </a>
          </div>

          <!-- 패밀리사이트 드롭다운 -->
          <div class="footer-family" id="footerFamily">
            <button class="footer-family-btn" onclick="Footer.toggleFamilySite()">
              패밀리사이트 <span class="footer-family-arrow">▾</span>
            </button>
            <ul class="footer-family-list" id="familyList">
              <li><a href="#" onclick="App.toast('산림청으로 이동합니다.');return false;">산림청</a></li>
              <li><a href="#" onclick="App.toast('국립수목원으로 이동합니다.');return false;">국립수목원</a></li>
              <li><a href="#" onclick="App.toast('산림복지진흥원으로 이동합니다.');return false;">산림복지진흥원</a></li>
              <li><a href="#" onclick="App.toast('숲해설가 자격으로 이동합니다.');return false;">숲해설가 자격</a></li>
              <li><a href="#" onclick="App.toast('녹색연합으로 이동합니다.');return false;">녹색연합</a></li>
            </ul>
          </div>

        </div>
      </div>

      <div class="footer-copy">
        <div class="container">
          Copyrights © 2026 www.foresto.org All right reserved.
        </div>
      </div>
    </footer>`;
  },

  /* 패밀리사이트 드롭다운 토글 */
  toggleFamilySite() {
    const list = document.getElementById('familyList');
    const arrow = document.querySelector('.footer-family-arrow');
    if (!list || !arrow) return;
    const isOpen = list.classList.toggle('open');
    arrow.textContent = isOpen ? '▴' : '▾';
  },

  /* 외부 클릭 시 드롭다운 닫기 — 푸터 렌더 후 한 번만 호출 */
  initFamilyOutsideClick() {
    document.addEventListener('click', function (e) {
      const family = document.getElementById('footerFamily');
      if (family && !family.contains(e.target)) {
        const list = document.getElementById('familyList');
        const arrow = document.querySelector('.footer-family-arrow');
        if (list)  list.classList.remove('open');
        if (arrow) arrow.textContent = '▾';
      }
    });
  },
};

