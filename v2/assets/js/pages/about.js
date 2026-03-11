/* =============================================
   about.js | 협회소개 페이지 컨트롤러
   - RegionCtrl: 전국지역협회 목록 + 상세
   ============================================= */
'use strict';

/* ══════════════════════════════════════════════
   1. 전국 지역협회 데이터
══════════════════════════════════════════════ */
const REGIONS_DATA = [
    {
        id: 1, name: '서울협회', area: '서울특별시',
        members: 320, since: 2001, contact: '02-000-1001', rep: '홍길동',
        link: null,
        content: `<p>서울협회는 서울특별시 전역을 활동 권역으로 하며, 320명의 회원이 활동하고 있습니다.</p>
                  <p>서울 소재 공원, 학교, 복지관 등 다양한 기관과 협력하여 숲 해설 활동을 전개하고 있습니다.</p>
                  <ul>
                    <li>설립: 2001년</li>
                    <li>회장: 홍길동</li>
                    <li>연락처: 02-000-1001</li>
                    <li>주요 활동: 북한산, 관악산, 서울숲 등 연간 200회 이상 숲 해설 진행</li>
                  </ul>`,
    },
    {
        id: 2, name: '경기북부협회', area: '경기도 북부권',
        members: 185, since: 2003, contact: '031-000-1002', rep: '이순신',
        link: null,
        content: `<p>경기북부협회는 의정부, 고양, 파주, 양주, 동두천 등 경기 북부 지역을 활동 권역으로 합니다.</p>
                  <p>185명의 회원이 지역 내 자연환경교육시설 및 학교 연계 프로그램을 운영하고 있습니다.</p>
                  <ul>
                    <li>설립: 2003년</li>
                    <li>회장: 이순신</li>
                    <li>연락처: 031-000-1002</li>
                  </ul>`,
    },
    {
        id: 3, name: '경기남부협회', area: '경기도 남부권',
        members: 210, since: 2004, contact: '031-000-1003', rep: '강감찬',
        link: null,
        content: `<p>경기남부협회는 수원, 성남, 안양, 화성 등 경기 남부 지역을 활동 권역으로 합니다.</p>
                  <p>210명의 회원이 활동 중이며, 특히 광교산 일원 생태 해설 프로그램이 활발합니다.</p>
                  <ul>
                    <li>설립: 2004년</li>
                    <li>회장: 강감찬</li>
                    <li>연락처: 031-000-1003</li>
                  </ul>`,
    },
    {
        id: 4, name: '인천협회', area: '인천광역시',
        members: 142, since: 2005, contact: '032-000-1004', rep: '을지문덕',
        link: null,
        content: `<p>인천협회는 인천광역시 전역을 활동 권역으로 하며, 142명의 회원이 활동하고 있습니다.</p>
                  <p>인천대공원, 계양산, 문학산 등 시내 산림 공원을 중심으로 해설 활동을 전개합니다.</p>
                  <ul>
                    <li>설립: 2005년</li>
                    <li>회장: 을지문덕</li>
                    <li>연락처: 032-000-1004</li>
                  </ul>`,
    },
    {
        id: 5, name: '강원협회', area: '강원도',
        members: 98, since: 2006, contact: '033-000-1005', rep: '세종대왕',
        link: null,
        content: `<p>강원협회는 강원도 전역을 활동 권역으로 하며, 국내 최고의 산림 환경을 배경으로 활동합니다.</p>
                  <p>98명의 회원이 설악산, 오대산, 태백산 등 강원도 주요 산림지에서 해설 활동을 전개합니다.</p>
                  <ul>
                    <li>설립: 2006년</li>
                    <li>회장: 세종대왕</li>
                    <li>연락처: 033-000-1005</li>
                  </ul>`,
    },
    {
        id: 6, name: '충북협회', area: '충청북도',
        members: 87, since: 2007, contact: '043-000-1006', rep: '김유신',
        link: null,
        content: `<p>충북협회는 충청북도 전역을 활동 권역으로 하며, 청주, 충주, 제천 등을 중심으로 활동합니다.</p>
                  <p>87명의 회원이 속리산, 월악산 등 국립공원 인근 산림에서 해설 프로그램을 운영합니다.</p>
                  <ul>
                    <li>설립: 2007년</li>
                    <li>회장: 김유신</li>
                    <li>연락처: 043-000-1006</li>
                  </ul>`,
    },
    {
        id: 7, name: '충남협회', area: '충청남도·대전',
        members: 103, since: 2007, contact: '041-000-1007', rep: '장보고',
        link: null,
        content: `<p>충남협회는 충청남도와 대전광역시를 활동 권역으로 합니다.</p>
                  <p>103명의 회원이 계룡산, 태안해안국립공원 등 다양한 산림 환경에서 활동합니다.</p>
                  <ul>
                    <li>설립: 2007년</li>
                    <li>회장: 장보고</li>
                    <li>연락처: 041-000-1007</li>
                  </ul>`,
    },
    {
        id: 8, name: '전북협회', area: '전라북도',
        members: 95, since: 2008, contact: '063-000-1008', rep: '신사임당',
        link: null,
        content: `<p>전북협회는 전라북도 전역을 활동 권역으로 하며, 전주, 군산, 익산 등을 중심으로 활동합니다.</p>
                  <p>95명의 회원이 지리산, 덕유산 등 전북 산림지에서 해설 활동을 전개합니다.</p>
                  <ul>
                    <li>설립: 2008년</li>
                    <li>회장: 신사임당</li>
                    <li>연락처: 063-000-1008</li>
                  </ul>`,
    },
    {
        id: 9, name: '전남협회', area: '전라남도·광주',
        members: 112, since: 2008, contact: '061-000-1009', rep: '이성계',
        link: null,
        content: `<p>전남협회는 전라남도와 광주광역시를 활동 권역으로 합니다.</p>
                  <p>112명의 회원이 무등산, 다도해 해상국립공원 일원에서 해설 활동을 전개합니다.</p>
                  <ul>
                    <li>설립: 2008년</li>
                    <li>회장: 이성계</li>
                    <li>연락처: 061-000-1009</li>
                  </ul>`,
    },
    {
        id: 10, name: '경북협회', area: '경상북도·대구',
        members: 88, since: 2009, contact: '053-000-1010', rep: '박혁거세',
        link: null,
        content: `<p>경북협회는 경상북도와 대구광역시를 활동 권역으로 합니다.</p>
                  <p>88명의 회원이 주왕산, 소백산 등 경북 주요 산림지에서 활동합니다.</p>
                  <ul>
                    <li>설립: 2009년</li>
                    <li>회장: 박혁거세</li>
                    <li>연락처: 053-000-1010</li>
                  </ul>`,
    },
    {
        id: 11, name: '경남협회', area: '경상남도·부산·울산',
        members: 134, since: 2009, contact: '055-000-1011', rep: '허준',
        link: null,
        content: `<p>경남협회는 경상남도, 부산광역시, 울산광역시를 활동 권역으로 합니다.</p>
                  <p>134명의 회원이 지리산, 가야산, 금정산 등 다양한 산림지에서 해설 활동을 전개합니다.</p>
                  <ul>
                    <li>설립: 2009년</li>
                    <li>회장: 허준</li>
                    <li>연락처: 055-000-1011</li>
                  </ul>`,
    },
    {
        id: 12, name: '제주협회', area: '제주특별자치도',
        members: 64, since: 2012, contact: '064-000-1012', rep: '김만덕',
        link: null,
        content: `<p>제주협회는 제주특별자치도를 활동 권역으로 하며, 한라산과 오름 등 제주 고유 생태계를 배경으로 활동합니다.</p>
                  <p>64명의 회원이 한라산국립공원, 곶자왈 등에서 특색 있는 숲 해설 프로그램을 운영합니다.</p>
                  <ul>
                    <li>설립: 2012년</li>
                    <li>회장: 김만덕</li>
                    <li>연락처: 064-000-1012</li>
                  </ul>`,
    },
];


/* ══════════════════════════════════════════════
   2. 전국 지역협회 컨트롤러
══════════════════════════════════════════════ */
const RegionCtrl = {

    DATA: REGIONS_DATA,

    /* ── 본문 첫 번째 <img src> 추출 유틸 */
    _extractThumb(htmlStr) {
        if (!htmlStr) return null;
        const m = htmlStr.match(/<img[^>]+src=["']([^"']+)["']/i);
        return m ? m[1] : null;
    },

    /* ── 목록 렌더 */
    init() {
        const grid = document.getElementById('regionGrid');
        if (!grid) return;

        grid.innerHTML = this.DATA.map(r => {
            const thumbSrc = this._extractThumb(r.content);
            const thumb = thumbSrc
                ? `<div class="gallery-thumb" style="background-image:url('${thumbSrc}')"></div>`
                : `<div class="gallery-thumb-placeholder"></div>`;
            return `
            <div class="gallery-card"
                 onclick="location.href='region-detail.html?id=${r.id}'"
                 style="cursor:pointer">
              ${thumb}
              <div class="gallery-info">
                <div class="gallery-title">${r.name}</div>
                <div class="gallery-meta">
                  <span>${r.area}</span>
                  <span>회원 ${r.members}명</span>
                </div>
                <div class="gallery-meta" style="margin-top:4px">
                  <span>${r.since}년 창설</span>
                  <span>${r.contact}</span>
                </div>
              </div>
            </div>`;
        }).join('');
    },

    /* ── 상세 페이지 렌더 */
    renderDetail() {
        const id   = App.getParam('id');
        const item = this.DATA.find(d => String(d.id) === String(id));
        const el   = document.getElementById('regionDetail');
        if (!el) return;

        if (!item) {
            el.innerHTML = `
                <div style="text-align:center;padding:48px;color:var(--gray-mid)">
                  해당 지역협회를 찾을 수 없습니다.
                </div>`;
            return;
        }

        const idx  = this.DATA.findIndex(d => d.id === item.id);
        const prev = this.DATA[idx - 1];
        const next = this.DATA[idx + 1];
        const linkBtn = item.link
            ? `<a href="${item.link}" target="_blank" rel="noopener noreferrer"
                  class="btn btn-outline">홈페이지 바로가기</a>`
            : '';

        el.innerHTML = `
            <div class="post-wrap">
              <div class="post-head">
                <h2>${item.name}</h2>
                <div class="post-meta">
                  <span>권역 <strong>${item.area}</strong></span>
                  <span>회원 <strong>${item.members}명</strong></span>
                  <span>창설 <strong>${item.since}년</strong></span>
                  <span>연락처 <strong>${item.contact}</strong></span>
                </div>
              </div>
              <div class="post-body">${item.content || ''}</div>
              ${linkBtn ? `<div style="margin-top:16px">${linkBtn}</div>` : ''}
              <div class="post-nav">
                ${next ? `<div class="post-nav-item">
                  <span class="post-nav-label">다음</span>
                  <span class="post-nav-title"
                        onclick="location.href='region-detail.html?id=${next.id}'">${next.name}</span>
                  <span class="post-nav-date">${next.area}</span>
                </div>` : ''}
                ${prev ? `<div class="post-nav-item">
                  <span class="post-nav-label">이전</span>
                  <span class="post-nav-title"
                        onclick="location.href='region-detail.html?id=${prev.id}'">${prev.name}</span>
                  <span class="post-nav-date">${prev.area}</span>
                </div>` : ''}
              </div>
              <div class="post-actions">
                <button class="btn btn-gray" onclick="location.href='regions.html'">목록으로</button>
              </div>
            </div>`;
    },
};


/* ══════════════════════════════════════════════
   2. 후원하기 컨트롤러
   - 일시후원 / 정기후원 탭 전환
   - 금액 프리셋 버튼 + 직접입력
   - 폼 제출 시 완료 화면 + 계좌 안내 표시
   - 계좌 정보: DONATE_CONFIG (하드코딩 금지 원칙)
══════════════════════════════════════════════ */

/* ── 후원 계좌 설정 (실제 운영 시 환경변수 또는 CMS 연동으로 교체) */
const DONATE_CONFIG = {
    bank:    '국민은행',
    account: '000-00-0000-0000',
    holder:  '(사)한국숲해설가협회',
};

const DonateCtrl = {

    _tab: 'once',   /* 'once' | 'regular' */

    init() {
        this._tab = 'once';
        this._showTab('once');
    },

    /* ── 탭 전환 */
    setTab(tab) {
        this._tab = tab;
        this._showTab(tab);
    },

    _showTab(tab) {
        ['once', 'regular'].forEach(t => {
            const form = document.getElementById(`donateForm_${t}`);
            const btn  = document.getElementById(`donateTab_${t}`);
            if (form) form.style.display = t === tab ? '' : 'none';
            if (btn)  btn.classList.toggle('active', t === tab);
        });
        /* 탭 전환 시 완료 화면 숨김 */
        const complete = document.getElementById('donateComplete');
        if (complete) complete.style.display = 'none';
    },

    /* ── 금액 프리셋 선택 */
    selectAmount(tab, amount) {
        const input = document.getElementById(`donateAmount_${tab}`);
        if (!input) return;
        /* 직접입력 선택 시 빈값으로 포커스 */
        if (amount === 'custom') {
            input.value = '';
            input.focus();
        } else {
            input.value = amount.toLocaleString();
        }
        /* 프리셋 버튼 active 처리 */
        document.querySelectorAll(`#donateForm_${tab} .amount-btn`).forEach(btn => {
            btn.classList.toggle('active', btn.dataset.amount === String(amount));
        });
    },

    /* ── 폼 제출 */
    submit(tab) {
        const name   = document.getElementById(`donateName_${tab}`)?.value.trim();
        const amount = document.getElementById(`donateAmount_${tab}`)?.value.replace(/,/g, '').trim();
        const phone  = document.getElementById(`donatePhone_${tab}`)?.value.trim();

        if (!name)   { App.toast('성함을 입력해주세요.', 'warning'); return; }
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            App.toast('후원 금액을 입력해주세요.', 'warning'); return;
        }
        if (!phone)  { App.toast('연락처를 입력해주세요.', 'warning'); return; }

        /* 폼 숨기고 완료 화면 표시 */
        const form = document.getElementById(`donateForm_${tab}`);
        if (form) form.style.display = 'none';

        this._renderComplete(tab, name, amount);
    },

    /* ── 완료 화면 렌더 */
    _renderComplete(tab, name, amount) {
        const el = document.getElementById('donateComplete');
        if (!el) return;

        const typeLabel = tab === 'once' ? '일시후원' : '정기후원';
        const amountFmt = Number(amount).toLocaleString();

        el.innerHTML = `
            <div class="donate-complete">
              <div class="donate-complete-icon">✓</div>
              <h3>${typeLabel} 신청이 완료되었습니다</h3>
              <p>${name}님, 소중한 후원 신청 감사합니다.<br>
                 아래 계좌로 후원금을 입금해 주시면 처리됩니다.</p>
              <div class="donate-account">
                <dl>
                  <dt>은행</dt><dd>${DONATE_CONFIG.bank}</dd>
                  <dt>계좌번호</dt><dd>${DONATE_CONFIG.account}</dd>
                  <dt>예금주</dt><dd>${DONATE_CONFIG.holder}</dd>
                  <dt>후원 금액</dt><dd>${amountFmt}원 (${typeLabel})</dd>
                </dl>
              </div>
              <p class="donate-complete-note">입금자명을 <strong>${name}</strong>으로 입력해 주세요.<br>
                 문의: <a href="contact.html">협회 연락처</a></p>
              <div style="margin-top:28px;display:flex;gap:12px;justify-content:center">
                <button class="btn btn-primary" onclick="DonateCtrl.reset()">다시 신청하기</button>
                <button class="btn btn-gray" onclick="location.href='../index.html'">홈으로</button>
              </div>
            </div>`;
        el.style.display = '';
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },

    /* ── 초기화 (다시 신청하기) */
    reset() {
        /* 모든 입력값 초기화 */
        ['once', 'regular'].forEach(t => {
            ['Name', 'Amount', 'Phone', 'Email'].forEach(field => {
                const el = document.getElementById(`donate${field}_${t}`);
                if (el) el.value = '';
            });
            document.querySelectorAll(`#donateForm_${t} .amount-btn`).forEach(btn => {
                btn.classList.remove('active');
            });
        });
        const complete = document.getElementById('donateComplete');
        if (complete) { complete.style.display = 'none'; complete.innerHTML = ''; }
        this.init();
    },
};


/* ══════════════════════════════════════════════
   3. 연혁 데이터
   - badge: null | '현재' | '주요연도' | '창립' | '설립'
   - items[].img: null | '이미지 경로' (관리자 등록용)
══════════════════════════════════════════════ */
const HISTORY_DATA = [
    {
        year: 2026, badge: '현재',
        items: [
            { month: '03', text: '제55기 숲해설가 전문가과정 모집 시작', img: null },
            { month: '01', text: '2026년도 정기 이사회 개최, 사업계획 확정', img: null },
        ],
    },
    {
        year: 2025, badge: '주요연도',
        items: [
            { month: '11', text: '제54기 전문가과정 수료식, 수료생 42명 배출', img: null },
            { month: '09', text: '전국 지역 숲해설가 연합 워크숍 개최 (전주)', img: null },
            { month: '07', text: '산림복지진흥원 업무협약(MOU) 갱신', img: null },
            { month: '04', text: '제53기 전문가과정 수료, 온라인 교육 병행 첫 시행', img: null },
            { month: '03', text: '협회 홈페이지 전면 개편 오픈', img: null },
        ],
    },
    {
        year: 2023, badge: null,
        items: [
            { month: '10', text: '창립 25주년 기념행사 및 심포지엄 개최', img: null },
            { month: '06', text: '사회공헌단 확대 개편, 전국 12개 권역 운영 체계 구축', img: null },
            { month: '03', text: '숲 동아리단 공식 출범, 전국 15개 동아리 등록', img: null },
        ],
    },
    {
        year: 2021, badge: null,
        items: [
            { month: '09', text: '디지털 전환 추진 — 온라인 강좌 시스템 구축', img: null },
            { month: '05', text: '장애인복지관·노인복지관 숲 체험 사회공헌 프로그램 전국 확대', img: null },
        ],
    },
    {
        year: 2019, badge: null,
        items: [
            { month: '11', text: '누적 양성 숲해설가 4,000명 돌파', img: null },
            { month: '04', text: '해외 산림 교육 기관 교류 협약 체결 (일본 삼림인스트럭터협회)', img: null },
        ],
    },
    {
        year: 2017, badge: null,
        items: [
            { month: '07', text: '산림청 지정 숲해설가 교육기관 재선정', img: null },
            { month: '03', text: '시민 아카데미 프로그램 신설, 연간 정기 운영 체계 확립', img: null },
        ],
    },
    {
        year: 2015, badge: null,
        items: [
            { month: '10', text: '협회 사무국 이전 (서울 성북구 → 현 소재지)', img: null },
            { month: '06', text: '멘토링 숲학교 프로그램 출범', img: null },
        ],
    },
    {
        year: 2012, badge: null,
        items: [
            { month: '09', text: '누적 양성 숲해설가 2,000명 돌파', img: null },
            { month: '04', text: '전국 지역협회 네트워크 구성 (8개 지역)', img: null },
        ],
    },
    {
        year: 2008, badge: '주요연도',
        items: [
            { month: '05', text: '숲해설가 자격증 제도 도입, 인증 체계 구축', img: null },
            { month: '03', text: '산림청 지정 산림교육 전문기관 선정', img: null },
        ],
    },
    {
        year: 2000, badge: '창립',
        items: [
            { month: '06', text: '(사)한국숲해설가협회로 명칭 변경, 산림청 사단법인 등록', img: null },
            { month: '03', text: '협회 공식 출범, 초대 이사진 구성', img: null },
        ],
    },
    {
        year: 1998, badge: '설립',
        items: [
            { month: '10', text: '\'자연환경 안내자 협회\' 창립, 제1회 숲해설가 양성과정 개설', img: null },
        ],
    },
];


/* ══════════════════════════════════════════════
   4. 연혁 컨트롤러
   - HISTORY_DATA를 기반으로 .history-wrap 구조를 동적 렌더링
   - 관리자 CMS 연동 시 HISTORY_DATA를 API 응답으로 교체하면 됨
══════════════════════════════════════════════ */
const HistoryCtrl = {

    DATA: HISTORY_DATA,

    init() {
        const el = document.getElementById('historyTimeline');
        if (!el) return;

        el.innerHTML = this.DATA.map(group => {
            const isMajor  = !!group.badge;
            const badgeHtml = group.badge
                ? `<span class="year-badge">${group.badge}</span>`
                : '';

            const itemsHtml = group.items.map(item => {
                const imgHtml = item.img
                    ? `<img src="${item.img}" alt="" class="history-img" loading="lazy">`
                    : '';
                return `
                <div class="history-item">
                  <span class="history-month">${item.month}월</span>
                  <span class="history-text">${item.text}${imgHtml}</span>
                </div>`;
            }).join('');

            return `
            <div class="history-group${isMajor ? ' major' : ''}">
              <div class="history-year">
                <span class="year-num">${group.year}</span>
                ${badgeHtml}
              </div>
              <div class="history-items">
                ${itemsHtml}
              </div>
            </div>`;
        }).join('');
    },
};


/* ── about 페이지 자동 초기화 */
document.addEventListener('DOMContentLoaded', () => {
    const page = document.body.dataset.page;
    const initMap = {
        'regions':       () => RegionCtrl.init(),
        'region-detail': () => RegionCtrl.renderDetail(),
        'donate':        () => DonateCtrl.init(),
        'history':       () => HistoryCtrl.init(),
    };
    if (page && initMap[page]) initMap[page]();
});
