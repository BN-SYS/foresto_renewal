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
            class="btn btn-outline btn-sm">마이페이지</a>
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
    <img src="${root}image/logo.png"
         alt="한국숲해설가협회">
  </div>
</a>
        <nav class="main-nav" id="mainNav">${navHtml}</nav>
        <div class="header-actions">
          <div id="authArea">${authHtml}</div>
          <button class="hamburger" id="hamburger"
                  onclick="Header.toggleMobileMenu()"
                  aria-label="메뉴">
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

  toggleMobileMenu() {
    const nav = document.getElementById('mobileNav');
    const btn = document.getElementById('hamburger');
    const open = nav.classList.toggle('open');
    btn.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
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
      <div class="footer-inner">
        <div class="footer-info">
          <p><strong>사단법인 한국숲해설가협회</strong></p>
          <p>주소: 06753 서울시 서초구 바우뫼로 158(양재동 유창빌딩 4층)</p>
             <p>대표전화: 02-747-6518&nbsp;|&nbsp;
             FAX: 02-747-6519</p>
          <p>이메일: foresto123@hanmail.net</p>
        </div>
        <div class="footer-links">
          <a href="${root}privacy.html">개인정보처리방침</a>
          <a href="${root}terms.html">이용약관</a>
          <a href="#"
             onclick="App.toast('이메일 무단수집을 거부합니다.')">
            이메일 무단수집 거부
          </a>
          <a href="#"
             onclick="App.toast('구 홈페이지로 이동합니다.')">
            구 홈페이지
          </a>
        </div>
      </div>
      <div class="footer-copy">
        Copyright © 2026 한국숲해설가협회. All rights reserved.
      </div>
    </footer>
    <div id="toast"></div>`;
  },
};
