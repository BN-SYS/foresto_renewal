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
        id: 1, name: '서울협회',
        link: 'https://seoul.forestguide.or.kr',
        content: `<img src="https://picsum.photos/seed/seoul/800/400" alt="서울협회" style="width:800px;border-radius:8px;margin-bottom:16px;display:block; margin:50px auto">
                  <p>서울협회는 서울특별시 전역을 활동 권역으로 하며, 320명의 회원이 활동하고 있습니다.</p>
                  <p>서울 소재 공원, 학교, 복지관 등 다양한 기관과 협력하여 숲 해설 활동을 전개하고 있습니다.</p>
                  <ul>
                    <li>설립: 2001년</li>
                    <li>회장: 홍길동</li>
                    <li>연락처: 02-000-1001</li>
                    <li><a href="https://seoul.forestguide.or.kr" target="_blank">홈페이지 바로가기</a></li>
                    <li>주요 활동: 북한산, 관악산, 서울숲 등 연간 200회 이상 숲 해설 진행</li>
                  </ul>`,
    },
    {
        id: 2, name: '경기북부협회',
        link: 'https://gyeonggi-n.forestguide.or.kr',
        content: `<img src="https://picsum.photos/seed/gyeonggi-n/800/400" alt="경기북부협회" style="width:800px;border-radius:8px;margin-bottom:16px;display:block; margin:50px auto">
                  <p>경기북부협회는 의정부, 고양, 파주, 양주, 동두천 등 경기 북부 지역을 활동 권역으로 합니다.</p>
                  <p>185명의 회원이 지역 내 자연환경교육시설 및 학교 연계 프로그램을 운영하고 있습니다.</p>
                  <ul>
                    <li>설립: 2003년</li>
                    <li>회장: 이순신</li>
                    <li>연락처: 031-000-1002</li><br>
                    <li><a href="#" target="_blank" style="color: #007bff; text-decoration: underline;">홈페이지 바로가기</a></li>
                  </ul>`,
    },
    {
        id: 3, name: '경기남부협회',
        link: 'https://gyeonggi-s.forestguide.or.kr',
        content: `<img src="https://picsum.photos/seed/gyeonggi-s/800/400" alt="경기남부협회" style="width:800px;border-radius:8px;margin-bottom:16px;display:block; margin:50px auto">
                  <p>경기남부협회는 수원, 성남, 안양, 화성 등 경기 남부 지역을 활동 권역으로 합니다.</p>
                  <p>210명의 회원이 활동 중이며, 특히 광교산 일원 생태 해설 프로그램이 활발합니다.</p>
                  <ul>
                    <li>설립: 2004년</li>
                    <li>회장: 강감찬</li>
                    <li>연락처: 031-000-1003</li><br>
                    <li><a href="#" target="_blank" style="color: #007bff; text-decoration: underline;">홈페이지 바로가기</a></li>
                  </ul>`,
    },
    {
        id: 4, name: '인천협회',
        link: 'https://incheon.forestguide.or.kr',
        content: `<img src="https://picsum.photos/seed/incheon/800/400" alt="인천협회" style="width:800px;border-radius:8px;margin-bottom:16px;display:block; margin:50px auto">
                  <p>인천협회는 인천광역시 전역을 활동 권역으로 하며, 142명의 회원이 활동하고 있습니다.</p>
                  <p>인천대공원, 계양산, 문학산 등 시내 산림 공원을 중심으로 해설 활동을 전개합니다.</p>
                  <ul>
                    <li>설립: 2005년</li>
                    <li>회장: 을지문덕</li>
                    <li>연락처: 032-000-1004</li><br>
                    <li><a href="#" target="_blank" style="color: #007bff; text-decoration: underline;">홈페이지 바로가기</a></li>
                  </ul>`,
    },
    {
        id: 5, name: '강원협회',
        link: 'https://gangwon.forestguide.or.kr',
        content: `<img src="https://picsum.photos/seed/gangwon/800/400" alt="강원협회" style="width:800px;border-radius:8px;margin-bottom:16px;display:block; margin:50px auto">
                  <p>강원협회는 강원도 전역을 활동 권역으로 하며, 국내 최고의 산림 환경을 배경으로 활동합니다.</p>
                  <p>98명의 회원이 설악산, 오대산, 태백산 등 강원도 주요 산림지에서 해설 활동을 전개합니다.</p>
                  <ul>
                    <li>설립: 2006년</li>
                    <li>회장: 세종대왕</li>
                    <li>연락처: 033-000-1005</li><br>
                    <li><a href="#" target="_blank" style="color: #007bff; text-decoration: underline;">홈페이지 바로가기</a></li>
                  </ul>`,
    },
    {
        id: 6, name: '충북협회',
        link: 'https://chungbuk.forestguide.or.kr',
        content: `<img src="https://picsum.photos/seed/chungbuk/800/400" alt="충북협회" style="width:800px;border-radius:8px;margin-bottom:16px;display:block; margin:50px auto">
                  <p>충북협회는 충청북도 전역을 활동 권역으로 하며, 청주, 충주, 제천 등을 중심으로 활동합니다.</p>
                  <p>87명의 회원이 속리산, 월악산 등 국립공원 인근 산림에서 해설 프로그램을 운영합니다.</p>
                  <ul>
                    <li>설립: 2007년</li>
                    <li>회장: 김유신</li>
                    <li>연락처: 043-000-1006</li><br>
                    <li><a href="#" target="_blank" style="color: #007bff; text-decoration: underline;">홈페이지 바로가기</a></li>
                  </ul>`,
    },
    {
        id: 7, name: '충남협회',
        link: 'https://chungnam.forestguide.or.kr',
        content: `<img src="https://picsum.photos/seed/chungnam/800/400" alt="충남협회" style="width:800px;border-radius:8px;margin-bottom:16px;display:block; margin:50px auto">
                  <p>충남협회는 충청남도와 대전광역시를 활동 권역으로 합니다.</p>
                  <p>103명의 회원이 계룡산, 태안해안국립공원 등 다양한 산림 환경에서 활동합니다.</p>
                  <ul>
                    <li>설립: 2007년</li>
                    <li>회장: 장보고</li>
                    <li>연락처: 041-000-1007</li><br>
                    <li><a href="#" target="_blank" style="color: #007bff; text-decoration: underline;">홈페이지 바로가기</a></li>
                  </ul>`,
    },
    {
        id: 8, name: '전북협회',
        link: 'https://jeonbuk.forestguide.or.kr',
        content: `<img src="https://picsum.photos/seed/jeonbuk/800/400" alt="전북협회" style="width:800px;border-radius:8px;margin-bottom:16px;display:block; margin:50px auto">
                  <p>전북협회는 전라북도 전역을 활동 권역으로 하며, 전주, 군산, 익산 등을 중심으로 활동합니다.</p>
                  <p>95명의 회원이 지리산, 덕유산 등 전북 산림지에서 해설 활동을 전개합니다.</p>
                  <ul>
                    <li>설립: 2008년</li>
                    <li>회장: 신사임당</li>
                    <li>연락처: 063-000-1008</li><br>
                    <li><a href="#" target="_blank" style="color: #007bff; text-decoration: underline;">홈페이지 바로가기</a></li>
                  </ul>`,
    },
    {
        id: 9, name: '전남협회',
        link: 'https://jeonnam.forestguide.or.kr',
        content: `<img src="https://picsum.photos/seed/jeonnam/800/400" alt="전남협회" style="width:800px;border-radius:8px;margin-bottom:16px;display:block; margin:50px auto">
                  <p>전남협회는 전라남도와 광주광역시를 활동 권역으로 합니다.</p>
                  <p>112명의 회원이 무등산, 다도해 해상국립공원 일원에서 해설 활동을 전개합니다.</p>
                  <ul>
                    <li>설립: 2008년</li>
                    <li>회장: 이성계</li>
                    <li>연락처: 061-000-1009</li><br>
                    <li><a href="#" target="_blank" style="color: #007bff; text-decoration: underline;">홈페이지 바로가기</a></li>
                  </ul>`,
    },
    {
        id: 10, name: '경북협회',
        link: 'https://gyeongbuk.forestguide.or.kr',
        content: `<img src="https://picsum.photos/seed/gyeongbuk/800/400" alt="경북협회" style="width:800px;border-radius:8px;margin-bottom:16px;display:block; margin:50px auto">
                  <p>경북협회는 경상북도와 대구광역시를 활동 권역으로 합니다.</p>
                  <p>88명의 회원이 주왕산, 소백산 등 경북 주요 산림지에서 활동합니다.</p>
                  <ul>
                    <li>설립: 2009년</li>
                    <li>회장: 박혁거세</li>
                    <li>연락처: 053-000-1010</li><br>
                    <li><a href="#" target="_blank" style="color: #007bff; text-decoration: underline;">홈페이지 바로가기</a></li>
                  </ul>`,
    },
    {
        id: 11, name: '경남협회',
        link: 'https://gyeongnam.forestguide.or.kr',
        content: `<img src="https://picsum.photos/seed/gyeongnam/800/400" alt="경남협회" style="width:800px;border-radius:8px;margin-bottom:16px;display:block; margin:50px auto">
                  <p>경남협회는 경상남도, 부산광역시, 울산광역시를 활동 권역으로 합니다.</p>
                  <p>134명의 회원이 지리산, 가야산, 금정산 등 다양한 산림지에서 해설 활동을 전개합니다.</p>
                  <ul>
                    <li>설립: 2009년</li>
                    <li>회장: 허준</li>
                    <li>연락처: 055-000-1011</li><br>
                    <li><a href="#" target="_blank" style="color: #007bff; text-decoration: underline;">홈페이지 바로가기</a></li>
                  </ul>`,
    },
    {
        id: 12, name: '제주협회',
        link: 'https://jeju.forestguide.or.kr',
        content: `<img src="https://picsum.photos/seed/jeju/800/400" alt="제주협회" style="width:800px;;border-radius:8px;margin-bottom:16px;display:block; margin:50px auto">
                  <p>제주협회는 제주특별자치도를 활동 권역으로 하며, 한라산과 오름 등 제주 고유 생태계를 배경으로 활동합니다.</p>
                  <p>64명의 회원이 한라산국립공원, 곶자왈 등에서 특색 있는 숲 해설 프로그램을 운영합니다.</p>
                  <ul>
                    <li>설립: 2012년</li>
                    <li>회장: 김만덕</li>
                    <li>연락처: 064-000-1012</li><br>
                    <li><a href="#" target="_blank" style="color: #007bff; text-decoration: underline;">홈페이지 바로가기</a></li>
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
              </div>
            </div>`;
        }).join('');
    },

    /* ── 상세 페이지 렌더 */
    renderDetail() {
        const id = App.getParam('id');
        const item = this.DATA.find(d => String(d.id) === String(id));
        const el = document.getElementById('regionDetail');
        if (!el) return;

        if (!item) {
            el.innerHTML = `
                <div style="text-align:center;padding:48px;color:var(--gray-mid)">
                  해당 지역협회를 찾을 수 없습니다.
                </div>`;
            return;
        }

        const idx = this.DATA.findIndex(d => d.id === item.id);
        const prev = this.DATA[idx - 1];
        const next = this.DATA[idx + 1];
       

        const navHtml = (next || prev) ? `
          <div class="cd-nav">
            ${next ? `<div class="cd-nav-item" onclick="location.href='region-detail.html?id=${next.id}'">
              <span class="cd-nav-label">다음</span>
              <span class="cd-nav-title">${next.name}</span>
            </div>` : ''}
            ${prev ? `<div class="cd-nav-item" onclick="location.href='region-detail.html?id=${prev.id}'">
              <span class="cd-nav-label">이전</span>
              <span class="cd-nav-title">${prev.name}</span>
            </div>` : ''}
          </div>` : '';
        el.innerHTML = `
          <div class="cd-wrap">
            <div class="cd-head">
              <div class="cd-head-left">
                <h2 class="cd-title">${item.name}</h2>
              </div>
            </div>
            <hr class="cd-divider">
            <div class="cd-body">
              <div class="cd-content">${item.content || ''}</div>
            </div>
            ${navHtml}
            <div class="cd-actions">
              <button class="btn btn-primary btn-sm cd-btn-list"
                      onclick="location.href='regions.html'">목록</button>
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
    bank: '국민은행',
    account: '000-00-0000-0000',
    holder: '(사)한국숲해설가협회',
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
            const btn = document.getElementById(`donateTab_${t}`);
            if (form) form.style.display = t === tab ? '' : 'none';
            if (btn) btn.classList.toggle('active', t === tab);
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
        const name = document.getElementById(`donateName_${tab}`)?.value.trim();
        const amount = document.getElementById(`donateAmount_${tab}`)?.value.replace(/,/g, '').trim();
        const phone = document.getElementById(`donatePhone_${tab}`)?.value.trim();

        if (!name) { App.toast('성함을 입력해주세요.', 'warning'); return; }
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            App.toast('후원 금액을 입력해주세요.', 'warning'); return;
        }
        if (!phone) { App.toast('연락처를 입력해주세요.', 'warning'); return; }

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
   - items[].img: null | '이미지 경로' (관리자 등록용)
══════════════════════════════════════════════ */
const HISTORY_DATA = [
    {
        year: 2026,
        items: [
            { month: '03', text: '제55기 숲해설가 전문가과정 모집 시작', img: null },
            { month: '01', text: '2026년도 정기 이사회 개최, 사업계획 확정', img: null },
        ],
    },
    {
        year: 2025,
        items: [
            { month: '11', text: '제54기 전문가과정 수료식, 수료생 42명 배출', img: null },
            { month: '09', text: '전국 지역 숲해설가 연합 워크숍 개최 (전주)', img: null },
            { month: '07', text: '산림복지진흥원 업무협약(MOU) 갱신', img: null },
            { month: '04', text: '제53기 전문가과정 수료, 온라인 교육 병행 첫 시행', img: null },
            { month: '03', text: '협회 홈페이지 전면 개편 오픈', img: null },
        ],
    },
    {
        year: 2023,
        items: [
            { month: '10', text: '창립 25주년 기념행사 및 심포지엄 개최', img: null },
            { month: '06', text: '사회공헌단 확대 개편, 전국 12개 권역 운영 체계 구축', img: null },
            { month: '03', text: '숲 동아리단 공식 출범, 전국 15개 동아리 등록', img: null },
        ],
    },
    {
        year: 2021,
        items: [
            { month: '09', text: '디지털 전환 추진 — 온라인 강좌 시스템 구축', img: null },
            { month: '05', text: '장애인복지관·노인복지관 숲 체험 사회공헌 프로그램 전국 확대', img: null },
        ],
    },
    {
        year: 2019,
        items: [
            { month: '11', text: '누적 양성 숲해설가 4,000명 돌파', img: null },
            { month: '04', text: '해외 산림 교육 기관 교류 협약 체결 (일본 삼림인스트럭터협회)', img: null },
        ],
    },
    {
        year: 2017,
        items: [
            { month: '07', text: '산림청 지정 숲해설가 교육기관 재선정', img: null },
            { month: '03', text: '시민 아카데미 프로그램 신설, 연간 정기 운영 체계 확립', img: null },
        ],
    },
    {
        year: 2015,
        items: [
            { month: '10', text: '협회 사무국 이전 (서울 성북구 → 현 소재지)', img: null },
            { month: '06', text: '멘토링 숲학교 프로그램 출범', img: null },
        ],
    },
    {
        year: 2012,
        items: [
            { month: '09', text: '누적 양성 숲해설가 2,000명 돌파', img: null },
            { month: '04', text: '전국 지역협회 네트워크 구성 (8개 지역)', img: null },
        ],
    },
    {
        year: 2008,
        items: [
            { month: '05', text: '숲해설가 자격증 제도 도입, 인증 체계 구축', img: null },
            { month: '03', text: '산림청 지정 산림교육 전문기관 선정', img: null },
        ],
    },
    {
        year: 2000,
        items: [
            { month: '06', text: '(사)한국숲해설가협회로 명칭 변경, 산림청 사단법인 등록', img: null },
            { month: '03', text: '협회 공식 출범, 초대 이사진 구성', img: null },
        ],
    },
    {
        year: 1998,
        items: [
            { month: '10', text: '\'자연환경 안내자 협회\' 창립, 제1회 숲해설가 양성과정 개설', img: null },
        ],
    },
];


/* ══════════════════════════════════════════════
   4. 연혁 컨트롤러 (REQ-018)
   - SVG stepped(직각 꺾임) 연결선 + 대형 원 아이콘
   - ① 연도 타이틀  ② 상세내용(5개 + 더보기/접기)
   - ③ 대형 원     ④ 연도 숫자
   - 모바일: 수직 타임라인 자동 전환
══════════════════════════════════════════════ */
const HistoryCtrl = {

    DATA: HISTORY_DATA,
    FOLD_LIMIT: 5,

    /* ── 레이아웃 상수 */
    _NW:   240,  /* 노드 너비 */
    _CW:   80,   /* 연결 구간 너비 (2*RS 이상 필요) */
    _RC:   44,   /* 대형 원 반지름 */
    _STEM: 10,   /* 원 ↔ dot 줄기 길이 */
    _RD:   5,    /* 연결 dot 반지름 */
    _YT:   300,  /* 상단 dot Y */
    _YB:   440,  /* 하단 dot Y */
    _TH:   760,  /* 스테이지 높이 */
    _RS:   18,   /* 꺾임 모서리 라운드 반지름 */

    /* ── 순환 색상 팔레트 */
    _COLORS: ['#1e5c35','#2d7a4f','#3a9660','#52b37f','#6bc49a','#276847','#3d8a58','#4aad6c'],

    /* ── 연도별 타이틀 (①) */
    _LABELS: {
        2026:'2026년 사업',    2025:'2025년 주요활동',
        2023:'창립 25주년',    2021:'디지털 전환기',
        2019:'성장의 도약',    2017:'제도적 기반',
        2015:'사무국 확장',    2012:'전국 네트워크',
        2008:'자격 제도 도입', 2000:'사단법인 등록',
        1998:'협회 창립',
    },

    init() {
        const wrap = document.getElementById('historyTimeline');
        if (!wrap) return;

        const {
            _NW:NW, _CW:CW, _RC:RC, _STEM:STEM, _RD:RD,
            _YT:YT, _YB:YB, _TH:TH, _RS:RS,
            _COLORS:COLORS, _LABELS:LABELS, DATA:data, FOLD_LIMIT:FL,
        } = this;

        const n      = data.length;
        const totalW = n * NW + (n - 1) * CW;
        const topCY  = YT - STEM - RC;  /* 상단 노드 원 중심 Y: 300-10-44=246 */
        const botCY  = YB + STEM + RC;  /* 하단 노드 원 중심 Y: 440+10+44=494 */

        /* ── SVG: stepped(직각 꺾임) 경로 ──────────────── */
        const pathPts = [`M 0 ${YT}`];   /* 왼쪽 끝에서 시작 */

        data.forEach((_, i) => {
            const isTop = i % 2 === 0;
            const dotY  = isTop ? YT : YB;
            const cx    = i * (NW + CW) + NW / 2;

            if (i === 0) {
                pathPts.push(`L ${cx} ${dotY}`);
            } else {
                const prevIsTop = (i - 1) % 2 === 0;
                const prevDotY  = prevIsTop ? YT : YB;
                const prevCx    = (i - 1) * (NW + CW) + NW / 2;
                const cS        = prevCx + NW / 2;  /* 연결 시작 X */
                const R         = RS;

                pathPts.push(`L ${cS} ${prevDotY}`);

                if (prevDotY < dotY) {
                    /* 아래로 꺾임 (상단→하단): 두 모서리 모두 CW(sweep=1) */
                    pathPts.push(`A ${R} ${R} 0 0 1 ${cS+R} ${prevDotY+R}`);
                    pathPts.push(`L ${cS+R} ${dotY-R}`);
                    pathPts.push(`A ${R} ${R} 0 0 1 ${cS+2*R} ${dotY}`);
                } else {
                    /* 위로 꺾임 (하단→상단): 두 모서리 모두 CCW(sweep=0) */
                    pathPts.push(`A ${R} ${R} 0 0 0 ${cS+R} ${prevDotY-R}`);
                    pathPts.push(`L ${cS+R} ${dotY+R}`);
                    pathPts.push(`A ${R} ${R} 0 0 0 ${cS+2*R} ${dotY}`);
                }
                pathPts.push(`L ${cx} ${dotY}`);
            }
        });

        /* 오른쪽 끝 연장 */
        pathPts.push(`L ${totalW} ${(n - 1) % 2 === 0 ? YT : YB}`);

        /* ── SVG: 대형 원 + 줄기 + 연결 dot ─────────────── */
        const ICONS = ['🌲','🌿','🍃','🌱','🌳','🍀','🌾','🌵'];
        let svgE = '';

        data.forEach((group, i) => {
            const isTop  = i % 2 === 0;
            const dotY   = isTop ? YT : YB;
            const cx     = i * (NW + CW) + NW / 2;
            const color  = COLORS[i % COLORS.length];
            const cirCY  = isTop ? topCY : botCY;

            /* 줄기 (원 ↔ dot) */
            const sY1 = isTop ? cirCY + RC : dotY;
            const sY2 = isTop ? dotY       : cirCY - RC;
            svgE += `<line x1="${cx}" y1="${sY1}" x2="${cx}" y2="${sY2}" stroke="${color}" stroke-width="2" opacity="0.5"/>`;

            /* 대형 원: 후광 → 점선 테두리 → 흰 채움 → 아이콘 */
            svgE += `<circle cx="${cx}" cy="${cirCY}" r="${RC+9}" fill="${color}" opacity="0.07"/>`;
            svgE += `<circle cx="${cx}" cy="${cirCY}" r="${RC+3}" fill="none" stroke="${color}" stroke-width="1.5" stroke-dasharray="6 4" opacity="0.25"/>`;
            svgE += `<circle cx="${cx}" cy="${cirCY}" r="${RC}"   fill="#fff" stroke="${color}" stroke-width="2.5"/>`;
            svgE += `<text x="${cx}" y="${cirCY+8}" text-anchor="middle" font-size="26" font-family="'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif">${ICONS[i % ICONS.length]}</text>`;

            /* 연결 dot: 후광 → 채움 → 흰 중심 */
            svgE += `<circle cx="${cx}" cy="${dotY}" r="${RD+4}" fill="${color}" opacity="0.15"/>`;
            svgE += `<circle cx="${cx}" cy="${dotY}" r="${RD}"   fill="${color}"/>`;
            svgE += `<circle cx="${cx}" cy="${dotY}" r="${RD-2}" fill="#fff"/>`;
        });

        /* ── 콘텐츠 노드 HTML ────────────────────────────── */
        const nodesHtml = data.map((group, i) => {
            const isTop  = i % 2 === 0;
            const leftPx = i * (NW + CW);
            const dotY   = isTop ? YT : YB;
            const cirCY  = isTop ? topCY : botCY;
            const color  = COLORS[i % COLORS.length];
            const label  = LABELS[group.year] || `${group.year}년`;

            const vis = group.items.slice(0, FL);
            const hid = group.items.slice(FL);

            const renderItem = it =>
                `<li class="ht-item">
                   <span class="ht-month">${it.month}월</span>
                   <span class="ht-text">${it.text}</span>
                 </li>`;

            const foldHtml = hid.length ? `
                <div class="ht-fold-items" id="htFold${i}" style="display:none">
                  <ul class="ht-items">${hid.map(renderItem).join('')}</ul>
                </div>
                <button class="ht-fold-btn" onclick="HistoryCtrl.toggleFold(${i},this)">
                  더보기 (${hid.length}개) ▾
                </button>` : '';

            /* 콘텐츠 박스 위치 */
            const contentStyle = isTop
                ? `top:10px; left:8px; right:8px;`
                : `top:${cirCY + RC + 16}px; left:8px; right:8px; bottom:10px;`;

            /* 연도 숫자 (④) 위치 */
            const yearStyle = isTop
                ? `top:${dotY + RD + 8}px;`
                : `top:${dotY - RD - 28}px;`;

            return `
            <div class="ht-node ${isTop ? 'ht-top' : 'ht-bot'}"
                 style="left:${leftPx}px; width:${NW}px;">
              <div class="ht-content" style="${contentStyle}">
                <div class="ht-label" style="color:${color};">${label}</div>
                <ul class="ht-items">${vis.map(renderItem).join('')}</ul>
                ${foldHtml}
              </div>
              <div class="ht-year" style="${yearStyle}; color:${color};">${group.year}</div>
            </div>`;
        }).join('');

        wrap.innerHTML = `
        <div class="ht-scroll-outer" id="htScrollOuter">
          <div class="ht-stage" style="width:${totalW}px; height:${TH}px;">
            <svg class="ht-svg" width="${totalW}" height="${TH}" aria-hidden="true">
              <path d="${pathPts.join(' ')}"
                    fill="none" stroke="#c5dfc8" stroke-width="2.5"
                    stroke-linecap="round" stroke-linejoin="round"/>
              ${svgE}
            </svg>
            ${nodesHtml}
          </div>
        </div>`;

        /* ── 마우스 드래그 스크롤 */
        this._initDrag(document.getElementById('htScrollOuter'));
    },

    /* ── 드래그 스크롤 초기화 */
    _initDrag(el) {
        if (!el) return;
        let isDown = false, startX = 0, scrollLeft = 0;

        el.addEventListener('mousedown', e => {
            isDown    = true;
            startX    = e.pageX - el.offsetLeft;
            scrollLeft = el.scrollLeft;
        });
        el.addEventListener('mouseleave', () => { isDown = false; });
        el.addEventListener('mouseup',    () => { isDown = false; });
        el.addEventListener('mousemove',  e => {
            if (!isDown) return;
            e.preventDefault();
            const x    = e.pageX - el.offsetLeft;
            const walk = (x - startX) * 1.2;   /* 드래그 감도 */
            el.scrollLeft = scrollLeft - walk;
        });
    },

    /* ── 더보기 / 접기 토글 + 스테이지 높이 자동 확장 */
    toggleFold(i, btn) {
        const fold  = document.getElementById(`htFold${i}`);
        if (!fold) return;
        const isOpen = fold.style.display === 'none';
        fold.style.display = isOpen ? 'block' : 'none';
        btn.innerHTML = isOpen
            ? '접기 ▴'
            : `더보기 (${fold.querySelectorAll('.ht-item').length}개) ▾`;

        /* 확장된 콘텐츠가 잘리지 않도록 스테이지 높이 재조정 */
        this._resizeStage();
    },

    /* ── 스테이지 높이를 콘텐츠 최대값에 맞게 재계산 */
    _resizeStage() {
        const stage = document.querySelector('.ht-stage');
        if (!stage) return;
        let maxBottom = this._TH;
        stage.querySelectorAll('.ht-content').forEach(el => {
            const rect = el.getBoundingClientRect();
            const stageRect = stage.getBoundingClientRect();
            const bottom = (rect.bottom - stageRect.top);
            if (bottom > maxBottom) maxBottom = bottom + 16; /* 여백 16px 추가 */
        });
        stage.style.height = maxBottom + 'px';
        /* SVG 높이도 동기화 */
        const svg = stage.querySelector('.ht-svg');
        if (svg) svg.setAttribute('height', maxBottom);
    },
};


/* ── about 페이지 자동 초기화 */
document.addEventListener('DOMContentLoaded', () => {
    const page = document.body.dataset.page;
    const initMap = {
        'regions': () => RegionCtrl.init(),
        'region-detail': () => RegionCtrl.renderDetail(),
        'donate': () => DonateCtrl.init(),
        'history': () => HistoryCtrl.init(),
    };
    if (page && initMap[page]) initMap[page]();
});
