/* =============================================
   community.js | 커뮤니티 페이지 공통 로직
   v2.1 - NewsletterCtrl / ArchiveCtrl 완전 교체
   ============================================= */
'use strict';

/* ══════════════════════════════════════════════
   0. 공통 유틸: 게시판 팩토리
══════════════════════════════════════════════ */
function createCommunityBoard(opts) {
    const {
        data,
        tableBodyId,
        paginationId,
        countId,
        pageSize = 10,
        rowRenderer,
        notices = [],
    } = opts;

    let filtered = [...data];
    let currentPage = 1;
    let curPageSize = pageSize;

    function render() {
        const total = filtered.length;
        const slice = filtered.slice(
            (currentPage - 1) * curPageSize,
            currentPage * curPageSize
        );

        const countEl = document.getElementById(countId);
        if (countEl) countEl.textContent = total.toLocaleString();

        const tbody = document.getElementById(tableBodyId);
        if (!tbody) return;

        const noticeRows = notices
            .map(p => rowRenderer(p, null, true))
            .join('');

        const normalRows = slice.length
            ? slice.map((row, i) =>
                rowRenderer(row, total - (currentPage - 1) * curPageSize - i, false)
            ).join('')
            : `<tr>
           <td colspan="10"
               style="text-align:center;padding:32px;color:var(--gray-mid)">
             등록된 게시물이 없습니다.
           </td>
         </tr>`;

        tbody.innerHTML = noticeRows + normalRows;

        App.renderPagination(
            paginationId,
            currentPage,
            Math.ceil(total / curPageSize) || 1,
            (p) => {
                currentPage = p;
                render();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        );
    }

    return {
        DATA: data,
        render,
        search(keyword) {
            const kw = (keyword || '').trim().toLowerCase();
            filtered = kw
                ? data.filter(r => r.title.toLowerCase().includes(kw))
                : [...data];
            currentPage = 1;
            render();
        },
        filterFn(fn) {
            filtered = fn ? data.filter(fn) : [...data];
            currentPage = 1;
            render();
        },
        changePageSize(size) {
            curPageSize = size;
            currentPage = 1;
            render();
        },
        init() { render(); },
    };
}


/* ══════════════════════════════════════════════
   1. 샘플 데이터
══════════════════════════════════════════════ */

function commMakeDate(idx, year = 2026) {
    const m = String((idx % 9) + 1).padStart(2, '0');
    const d = String((idx % 28) + 1).padStart(2, '0');
    return `${year}-${m}-${d}`;
}

/* ── 1-1. 공지사항 */
const NOTICE_DATA = {
    pinned: [
        {
            id: 9999,
            title: '[필독] 2026년 협회 운영 방침 안내',
            author: '관리자', date: '2026-01-02', views: 1240,
            content: `<p>2026년 협회 운영 방침에 대해 안내드립니다.</p>
                <p>주요 변경 사항은 다음과 같습니다.</p>`,
        },
        {
            id: 9998,
            title: '[공지] 개인정보처리방침 개정 안내',
            author: '관리자', date: '2026-01-10', views: 890,
            content: `<p>개인정보처리방침 개정 내용을 안내드립니다.</p>`,
        },
    ],
    normals: Array.from({ length: 25 }, (_, i) => ({
        id: 25 - i,
        title: [
            '55기 전문가과정 모집 안내', '[긴급] 3월 이사회 일정 변경',
            '2026년 협회비 납부 안내', '홈페이지 개편 작업 예고',
            '2025년 우수회원 표창 결과', '봄철 숲해설 프로그램 안내',
            '하반기 교육 일정 공지', '협회 사무실 이전 안내',
            '정기총회 결과 보고', '자원봉사 모집 공고',
        ][i % 10],
        author: '관리자',
        date: commMakeDate(i),
        views: Math.floor(Math.random() * 300 + 30),
        content: `<p>공지사항 ${25 - i}번 게시물 내용입니다.</p>
              <p>자세한 사항은 사무국(02-000-0000)으로 문의 바랍니다.</p>`,
    })),
};

/* ── 1-2. 자유게시판 */
const FREE_DATA = {
    pinned: [],
    normals: Array.from({ length: 30 }, (_, i) => ({
        id: 30 - i,
        title: [
            '봄 숲 탐방 다녀왔어요 🌸', '초보 숲해설가의 첫 현장 후기',
            '식물 이름이 헷갈려요 - 도움 요청', '숲해설 관련 좋은 책 추천',
            '겨울 나무 관찰 사진 공유', '해설 연습할 곳 추천해주세요',
        ][i % 6],
        author: `회원${(i % 15) + 1}`,
        date: commMakeDate(i),
        views: Math.floor(Math.random() * 150 + 5),
        likes: Math.floor(Math.random() * 30),
        content: `<p>자유게시판 ${30 - i}번 게시물입니다.</p>
              <p>여러분과 소통하고 싶어 글을 남깁니다.</p>`,
    })),
};

/* ── 1-3. 언론보도 */
const PRESS_DATA = {
    pinned: [],
    normals: Array.from({ length: 18 }, (_, i) => ({
        id: 18 - i,
        title: [
            '한국숲해설가협회, 산림 생태 교육 확대 나서',
            '숲해설가 자격증 취득자 3만 명 돌파',
            '도심 속 숲 교육, 어린이 정서 발달에 효과',
            '한국숲해설가협회, 사회공헌 우수기관 선정',
            '전문 숲해설가 양성 프로그램 인기몰이',
            '자연과 함께하는 치유 숲 프로그램 주목',
        ][i % 6],
        media: ['조선일보', 'KBS뉴스', '한겨레', '연합뉴스', 'MBC뉴스', '경향신문'][i % 6],
        date: commMakeDate(i),
        views: Math.floor(Math.random() * 200 + 50),
        link: '#',
        content: `<p>언론보도 ${18 - i}번 게시물입니다.</p>`,
    })),
};

/* ── 1-4. 일자리 및 교육정보 */
const JOB_CATEGORIES = ['채용공고', '교육정보', '자격증정보', '공모사업'];

const JOB_DATA = {
    pinned: [],
    normals: Array.from({ length: 22 }, (_, i) => ({
        id: 22 - i,
        title: [
            '[채용] 국립수목원 숲해설가 채용 공고',
            '[교육] 생태관광 전문가 양성 과정 모집',
            '[자격] 산림교육전문가 자격시험 안내',
            '[공모] 2026 녹색생활 실천 공모전',
            '[채용] 지자체 산림복지 해설사 모집',
            '[교육] 숲치유지도사 심화 과정 안내',
        ][i % 6],
        category: JOB_CATEGORIES[i % JOB_CATEGORIES.length],
        author: '사무국',
        date: commMakeDate(i),
        deadline: commMakeDate(i + 5),
        views: Math.floor(Math.random() * 180 + 20),
        content: `<p>일자리/교육정보 ${22 - i}번 게시물입니다.</p>`,
    })),
};

/* ── 1-5. 갤러리 */
const GALLERY_DATA = Array.from({ length: 24 }, (_, i) => ({
    id: 24 - i,
    title: [
        '2026 봄 숲 탐방 행사', '55기 전문가과정 수료식',
        '사공단 봉사활동 현장', '동아리 정기모임 사진',
        '이사회 회의 모습', '시민아카데미 현장',
        '숲 치유 프로그램', '어린이 생태교육',
    ][i % 8],
    author: ['사무국', '김회원', '이회원', '박회원'][i % 4],
    date: commMakeDate(i),
    views: Math.floor(Math.random() * 200 + 20),
    imgUrl: null,
    content: `<p>갤러리 ${24 - i}번 게시물입니다.</p>`,
}));

/* ── 1-6. 협회 일정 이벤트 */
const CALENDAR_EVENTS = [
    {
        id: 1, date: '2026-03-05',
        title: '이사회 회의', cat: 'meeting', link: true,
        desc: '2026년 1분기 정기 이사회\n📍 장소: 협회 사무실\n⏰ 시간: 14:00~16:00',
    },
    {
        id: 2, date: '2026-03-10',
        title: '전문가과정 OT', cat: 'edu', link: true,
        desc: '2026년 55기 전문가과정 오리엔테이션\n📍 장소: OO교육센터\n⏰ 시간: 10:00~12:00',
    },
    {
        id: 3, date: '2026-03-15',
        title: '전문가과정 접수마감', cat: 'edu', link: true,
        desc: '55기 전문가과정 신청 마감일\n마감 전 신청 완료 바랍니다.',
    },
    {
        id: 4, date: '2026-03-18',
        title: '봉사활동 - 도봉구', cat: 'activity', link: false,
        desc: '도봉구 초등학교 숲 체험 교육 봉사\n📍 장소: 도봉산 일원\n⏰ 시간: 09:00~13:00',
    },
    {
        id: 5, date: '2026-03-20',
        title: '숲사랑단 정기모임', cat: 'club', link: true,
        desc: '3월 정기모임 및 봄철 탐방 계획 수립\n📍 장소: OO공원\n⏰ 시간: 10:00~12:00',
    },
    {
        id: 6, date: '2026-03-22',
        title: '시민아카데미 강좌', cat: 'edu', link: true,
        desc: '봄 숲 이야기 시민 특강\n📍 장소: OO도서관\n⏰ 시간: 14:00~16:00',
    },
    {
        id: 7, date: '2026-03-25',
        title: '산들바람 모임', cat: 'club', link: true,
        desc: '산들바람 동아리 3월 정기모임\n📍 장소: 북한산 둘레길\n⏰ 시간: 09:00~12:00',
    },
    {
        id: 8, date: '2026-03-28',
        title: '봉사활동 - 노원구', cat: 'activity', link: false,
        desc: '노원구 복지관 자연치유 프로그램\n📍 장소: OO복지관\n⏰ 시간: 10:00~12:00',
    },
    {
        id: 9, date: '2026-04-05',
        title: '55기 전문가과정 1회차', cat: 'edu', link: true,
        desc: '55기 전문가과정 첫 번째 교육일\n📍 장소: OO교육센터\n⏰ 시간: 09:00~18:00',
    },
    {
        id: 10, date: '2026-04-15',
        title: '정기 이사회', cat: 'meeting', link: true,
        desc: '2026년 2분기 정기 이사회',
    },
];


/* ══════════════════════════════════════════════
   2. 캘린더 컨트롤러
══════════════════════════════════════════════ */
const CalendarCtrl = {

    CAT_META: {
        edu: { label: '교육/강좌', cls: 'evt-edu', dotColor: 'var(--green-main)' },
        activity: { label: '봉사활동', cls: 'evt-activity', dotColor: 'var(--accent)' },
        meeting: { label: '협회회의', cls: 'evt-meeting', dotColor: 'var(--info)' },
        club: { label: '동아리', cls: 'evt-club', dotColor: '#9c27b0' },
    },

    _year: 2026,
    _month: 2,
    _view: 'month',
    _filter: { edu: true, activity: true, meeting: true, club: true },

    init() {
        this._renderFilterPanel();
        this._injectEventModal();
        this.render();
    },

    _renderFilterPanel() {
        const el = document.getElementById('calFilterPanel');
        if (!el) return;
        el.innerHTML = Object.entries(this.CAT_META).map(([k, v]) => `
      <div class="filter-item">
        <input type="checkbox" id="calCat_${k}" checked
               onchange="CalendarCtrl.toggleCat('${k}', this.checked)">
        <div class="filter-dot" style="background:${v.dotColor}"></div>
        <label for="calCat_${k}"
               style="cursor:pointer;font-size:14px">${v.label}</label>
      </div>`).join('');
    },

    toggleCat(cat, checked) {
        this._filter[cat] = checked;
        this.render();
    },

    setView(v) {
        this._view = v;
        const mView = document.getElementById('monthView');
        const lView = document.getElementById('listView');
        if (mView) mView.style.display = v === 'month' ? 'block' : 'none';
        if (lView) lView.style.display = v === 'list' ? 'block' : 'none';
        ['btnMonth', 'btnList'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.classList.toggle(
                'active',
                (id === 'btnMonth' && v === 'month') || (id === 'btnList' && v === 'list')
            );
        });
        this.render();
    },

    changeMonth(delta) {
        this._month += delta;
        if (this._month > 11) { this._month = 0; this._year++; }
        if (this._month < 0) { this._month = 11; this._year--; }
        this.render();
    },

    _getEvents(y, m, d) {
        const ds = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        return CALENDAR_EVENTS.filter(e => e.date === ds && this._filter[e.cat]);
    },

    openEventModal(evt) {
        const meta = this.CAT_META[evt.cat] || { label: evt.cat };
        const titleEl = document.getElementById('calModalEvtTitle');
        const bodyEl = document.getElementById('calModalEvtBody');
        const linkBtn = document.getElementById('calModalEvtLink');
        if (titleEl) titleEl.textContent = evt.title;
        if (bodyEl) {
            bodyEl.innerHTML = `
        <div style="margin-bottom:12px">
          <span class="badge badge-green">${meta.label}</span>
          <span style="font-size:13px;color:var(--gray-mid);margin-left:8px">
            📅 ${evt.date}
          </span>
        </div>
        <div style="font-size:14px;line-height:1.8;
                    white-space:pre-line;color:var(--gray-dark)">
          ${evt.desc}
        </div>`;
        }
        if (linkBtn) linkBtn.style.display = evt.link ? 'inline-flex' : 'none';
        App.openModal('calEventModal');
    },

    render() {
        const titleEl = document.getElementById('calMonthTitle');
        if (titleEl) titleEl.textContent = `${this._year}년 ${this._month + 1}월`;
        if (this._view === 'month') {
            this._renderMonthGrid();
        } else {
            this._renderList();
        }
        this._renderUpcoming();
    },

    _renderMonthGrid() {
        const { _year: y, _month: m } = this;
        const first = new Date(y, m, 1).getDay();
        const lastDay = new Date(y, m + 1, 0).getDate();
        const today = new Date();
        const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

        let html = DAYS.map((d, i) =>
            `<div class="full-day-header ${i === 0 ? 'sun' : i === 6 ? 'sat' : ''}">${d}</div>`
        ).join('');

        for (let i = 0; i < first; i++) {
            html += `<div class="full-cell other-month"></div>`;
        }

        for (let d = 1; d <= lastDay; d++) {
            const dow = (first + d - 1) % 7;
            const isToday = (
                y === today.getFullYear() &&
                m === today.getMonth() &&
                d === today.getDate()
            );
            const evts = this._getEvents(y, m, d);
            const dateNumCls = [
                'cell-date',
                isToday ? 'today-num' : '',
                dow === 0 ? 'sun' : dow === 6 ? 'sat' : '',
            ].filter(Boolean).join(' ');

            const evtTags = [
                ...evts.slice(0, 2).map(e => {
                    const encoded = encodeURIComponent(JSON.stringify(e));
                    return `<span class="event-tag ${this.CAT_META[e.cat]?.cls || ''}"
                        data-evt="${encoded}">${e.title}</span>`;
                }),
                evts.length > 2
                    ? `<span style="font-size:10px;color:var(--gray-mid)">
               +${evts.length - 2}건 더
             </span>`
                    : '',
            ].join('');

            html += `
        <div class="full-cell${isToday ? ' today' : ''}">
          <div class="${dateNumCls}">${d}</div>
          <div class="evt-container">${evtTags}</div>
        </div>`;
        }

        const grid = document.getElementById('fullCalGrid');
        if (!grid) return;
        grid.innerHTML = html;
        grid.querySelectorAll('.event-tag[data-evt]').forEach(el => {
            el.addEventListener('click', () => {
                const evt = JSON.parse(decodeURIComponent(el.dataset.evt));
                CalendarCtrl.openEventModal(evt);
            });
        });
    },

    _renderList() {
        const { _year: y, _month: m } = this;
        const lvTitle = document.getElementById('listViewTitle');
        if (lvTitle) lvTitle.textContent = `${y}년 ${m + 1}월 일정 목록`;

        const monthEvts = CALENDAR_EVENTS
            .filter(e => {
                const ed = new Date(e.date);
                return ed.getFullYear() === y && ed.getMonth() === m && this._filter[e.cat];
            })
            .sort((a, b) => a.date.localeCompare(b.date));

        const countEl = document.getElementById('eventCount');
        if (countEl) countEl.textContent = `${monthEvts.length}건`;

        const listEl = document.getElementById('eventListWrap');
        if (!listEl) return;

        if (!monthEvts.length) {
            listEl.innerHTML = `
        <div style="text-align:center;padding:40px;color:var(--gray-mid)">
          이번 달 등록된 일정이 없습니다.
        </div>`;
            return;
        }

        listEl.innerHTML = monthEvts.map(e => {
            const d = new Date(e.date);
            const meta = this.CAT_META[e.cat] || { label: e.cat };
            return `
        <div style="display:flex;gap:16px;align-items:flex-start;
                    padding:14px 0;border-bottom:1px solid var(--gray-light);cursor:pointer"
             onclick="CalendarCtrl.openEventModal(${JSON.stringify(e).replace(/"/g, '&quot;')})">
          <div style="background:var(--green-dark);color:#fff;border-radius:8px;
                      padding:8px 12px;text-align:center;min-width:52px;flex-shrink:0">
            <div style="font-size:11px;opacity:.8">${d.getMonth() + 1}월</div>
            <div style="font-size:22px;font-weight:700;line-height:1">${d.getDate()}</div>
          </div>
          <div>
            <h4 style="font-size:14px;font-weight:700;margin-bottom:4px">
              ${e.title}
              <span class="badge badge-green" style="font-size:11px">${meta.label}</span>
            </h4>
            <p style="font-size:13px;color:var(--gray-mid)">${e.desc.split('\n')[0]}</p>
            ${e.link
                    ? `<button class="btn btn-outline btn-sm" style="margin-top:6px"
                         onclick="event.stopPropagation();App.toast('관련 페이지로 이동합니다.')">
                   관련 페이지 →
                 </button>`
                    : ''}
          </div>
        </div>`;
        }).join('');
    },

    _renderUpcoming() {
        const today = new Date();
        const upEl = document.getElementById('upcomingList');
        if (!upEl) return;

        const upcoming = CALENDAR_EVENTS
            .filter(e => new Date(e.date) >= today && this._filter[e.cat])
            .sort((a, b) => a.date.localeCompare(b.date))
            .slice(0, 5);

        if (!upcoming.length) {
            upEl.innerHTML = `
        <p style="font-size:13px;color:var(--gray-mid);
                  text-align:center;padding:12px 0">
          예정된 일정이 없습니다.
        </p>`;
            return;
        }

        upEl.innerHTML = upcoming.map(e => {
            const meta = this.CAT_META[e.cat] || { label: e.cat };
            const encoded = JSON.stringify(e).replace(/"/g, '&quot;');
            return `
        <div style="padding:8px 0;border-bottom:1px solid var(--gray-light);cursor:pointer"
             onclick="CalendarCtrl.openEventModal(${encoded})">
          <div style="font-size:12px;color:var(--gray-mid)">
            ${e.date} · ${meta.label}
          </div>
          <div style="font-size:14px;font-weight:600;color:var(--gray-dark);margin-top:2px">
            ${e.title}
          </div>
        </div>`;
        }).join('');
    },

    _injectEventModal() {
        if (document.getElementById('calEventModal')) return;
        document.body.insertAdjacentHTML('beforeend', `
      <div class="modal-overlay" id="calEventModal">
        <div class="modal" style="max-width:480px">
          <div class="modal-header">
            <h3 id="calModalEvtTitle"></h3>
            <button class="modal-close"
                    onclick="App.closeModal('calEventModal')">×</button>
          </div>
          <div class="modal-body" id="calModalEvtBody"></div>
          <div class="modal-footer">
            <button class="btn btn-outline btn-sm"
                    id="calModalEvtLink"
                    style="display:none"
                    onclick="App.toast('관련 페이지로 이동합니다.')">
              관련 페이지 →
            </button>
            <button class="btn btn-gray"
                    onclick="App.closeModal('calEventModal')">닫기</button>
          </div>
        </div>
      </div>`);
    },
};


/* ══════════════════════════════════════════════
   3. 공지사항 컨트롤러
══════════════════════════════════════════════ */
const NoticeCtrl = {
    _board: null,

    init() {
        this._board = createCommunityBoard({
            data: NOTICE_DATA.normals,
            tableBodyId: 'noticeTableBody',
            paginationId: 'noticePagination',
            countId: 'noticeCount',
            notices: NOTICE_DATA.pinned,
            rowRenderer: (row, seq, isPinned) => `
  <tr class="${isPinned ? 'pinned' : ''}">
    <td class="col-num">
      ${isPinned ? '<span class="badge-notice">공지</span>' : seq}
    </td>
    <td class="td-title">
      <a href="notice-detail.html?id=${row.id}">
        ${row.title}
      </a>
    </td>
    <td class="col-author">${row.author}</td>
    <td class="col-date">${row.date}</td>
    <td class="col-views">${row.views}</td>
  </tr>`,

        });
        this._board.init();
    },

    search() {
        const keyword = document.getElementById('noticeKeyword')?.value || '';
        this._board?.search(keyword);
    },

    reset() {
        ['noticeSearchType', 'noticeKeyword'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        this._board?.search('');
    },

    changePageSize(size) {
        this._board?.changePageSize(Number(size));
    },

    renderDetail() {
        const id = App.getParam('id');
        const all = [...NOTICE_DATA.pinned, ...NOTICE_DATA.normals];
        const item = all.find(d => String(d.id) === String(id));
        if (!item) return;
        const el = document.getElementById('noticeDetail');
        if (!el) return;
        el.innerHTML = `
      <div class="post-wrap">
        <div class="post-head">
          <h2>${item.title}</h2>
          <div class="post-meta">
            <span>작성자 <strong>${item.author}</strong></span>
            <span>작성일 <strong>${item.date}</strong></span>
            <span>조회 <strong>${item.views}</strong></span>
          </div>
        </div>
        <div class="post-body">${item.content}</div>
        <div class="post-actions">
          <a href="notice-list.html" class="btn btn-gray">목록으로</a>
        </div>
      </div>`;
    },
};


/* ══════════════════════════════════════════════
   4. 자유게시판 컨트롤러
══════════════════════════════════════════════ */
const FreeCtrl = {
    _board: null,

    init() {
        this._board = createCommunityBoard({
            data: FREE_DATA.normals,
            tableBodyId: 'freeTableBody',
            paginationId: 'freePagination',
            countId: 'freeCount',
            notices: FREE_DATA.pinned,
            rowRenderer: (row, seq) => `
  <tr>
    <td class="col-num">${seq}</td>
    <td class="td-title">
      <a href="?id=${row.id}">${row.title}</a>
    </td>
    <td class="col-author">${row.author}</td>
    <td class="col-date">${row.date}</td>
    <td class="col-views">${row.views}</td>
  </tr>`,
        });
        this._board.init();
    },

    search() {
        this._board?.search(document.getElementById('freeKeyword')?.value || '');
    },

    reset() {
        const el = document.getElementById('freeKeyword');
        if (el) el.value = '';
        this._board?.search('');
    },

    openWriteModal() {
        ['freeTitle', 'freeContent'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        App.openModal('freeWriteModal');
    },

    savePost() {
        const title = document.getElementById('freeTitle')?.value.trim() || '';
        const content = document.getElementById('freeContent')?.value.trim() || '';
        if (!title) { App.toast('제목을 입력해주세요.', 'warning'); return; }
        if (!content) { App.toast('내용을 입력해주세요.', 'warning'); return; }
        FREE_DATA.normals.unshift({
            id: Date.now(),
            title,
            content: `<p>${content}</p>`,
            author: App.user.name,
            date: new Date().toISOString().slice(0, 10),
            views: 0, likes: 0,
        });
        this.init();
        App.closeModal('freeWriteModal');
        App.toast('게시글이 등록되었습니다.');
    },
};


/* ══════════════════════════════════════════════
   5. 언론보도 컨트롤러
══════════════════════════════════════════════ */
const PressCtrl = {
    _board: null,

    init() {
        this._board = createCommunityBoard({
            data: PRESS_DATA.normals,
            tableBodyId: 'pressTableBody',
            paginationId: 'pressPagination',
            countId: 'pressCount',
            notices: PRESS_DATA.pinned,
            rowRenderer: (row, seq) => `
  <tr>
    <td class="col-num">${seq}</td>
    <td class="td-title">
      <a href="${row.link || '#'}"
         target="_blank" rel="noopener noreferrer">
        ${row.title}
      </a>
    </td>
    <td class="col-author">${row.media}</td>
    <td class="col-date">${row.date}</td>
    <td class="col-views">${row.views}</td>
  </tr>`,
        });
        this._board.init();
    },

    search() {
        this._board?.search(document.getElementById('pressKeyword')?.value || '');
    },

    reset() {
        const el = document.getElementById('pressKeyword');
        if (el) el.value = '';
        this._board?.search('');
    },
};


/* ══════════════════════════════════════════════
   6. 일자리 및 교육정보 컨트롤러
══════════════════════════════════════════════ */
const JobCtrl = {
    _board: null,

    init() {
        this._board = createCommunityBoard({
            data: JOB_DATA.normals,
            tableBodyId: 'jobTableBody',
            paginationId: 'jobPagination',
            countId: 'jobCount',
            notices: JOB_DATA.pinned,
            rowRenderer: (row, seq) => `
  <tr>
    <td class="col-num">${seq}</td>
    <td class="center">
      <span class="badge badge-blue" style="font-size:11px">${row.category}</span>
    </td>
    <td class="td-title">
      <a href="?id=${row.id}">${row.title}</a>
    </td>
    <td class="col-author">${row.author}</td>
    <td class="col-date">${row.date}</td>
    <td class="center" style="font-size:13px;color:var(--danger)">${row.deadline}</td>
    <td class="col-views">${row.views}</td>
  </tr>`,
        });
        this._board.init();
    },

    search() {
        const category = document.getElementById('jobCategory')?.value || '';
        const keyword = document.getElementById('jobKeyword')?.value || '';
        this._board?.filterFn(r => {
            if (category && r.category !== category) return false;
            if (keyword && !r.title.toLowerCase().includes(keyword.toLowerCase())) return false;
            return true;
        });
    },

    reset() {
        ['jobCategory', 'jobKeyword'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        this._board?.filterFn(null);
    },
};


/* ══════════════════════════════════════════════
   7. 갤러리 컨트롤러
══════════════════════════════════════════════ */
const GalleryCtrl = {
    _data: GALLERY_DATA,
    _filtered: [...GALLERY_DATA],
    _page: 1,
    _pageSize: 12,

    init() { this.render(); },

    render() {
        const total = this._filtered.length;
        const slice = this._filtered.slice(
            (this._page - 1) * this._pageSize,
            this._page * this._pageSize
        );
        const countEl = document.getElementById('galleryCount');
        if (countEl) countEl.textContent = total.toLocaleString();
        const grid = document.getElementById('galleryGrid');
        if (!grid) return;
        grid.innerHTML = slice.length
            ? slice.map(item => `
          <div class="gallery-card" onclick="App.toast('${item.title}')">
            <div class="gallery-thumb-placeholder">🌿</div>
            <div class="gallery-info">
              <div class="gallery-title">${item.title}</div>
              <div class="gallery-meta">
                <span>${item.author}</span>
                <span>${item.date}</span>
                <span>👁 ${item.views}</span>
              </div>
            </div>
          </div>`).join('')
            : `<div style="grid-column:1/-1;text-align:center;
                     padding:40px;color:var(--gray-mid)">
           등록된 사진이 없습니다.
         </div>`;
        App.renderPagination(
            'galleryPagination',
            this._page,
            Math.ceil(total / this._pageSize) || 1,
            (p) => { this._page = p; this.render(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
        );
    },

    search() {
        const kw = document.getElementById('galleryKeyword')?.value.trim().toLowerCase() || '';
        this._filtered = kw
            ? this._data.filter(r => r.title.toLowerCase().includes(kw))
            : [...this._data];
        this._page = 1;
        this.render();
    },

    reset() {
        const el = document.getElementById('galleryKeyword');
        if (el) el.value = '';
        this._filtered = [...this._data];
        this._page = 1;
        this.render();
    },
};



/* ══════════════════════════════════════════════
   10. 페이지 자동 초기화 (소식지·자료실 제외 → community-media.js 참조)
══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
    const page = document.body.dataset.page;

    const initMap = {
        'calendar':      () => CalendarCtrl.init(),
        'notice':        () => NoticeCtrl.init(),
        'notice-detail': () => NoticeCtrl.renderDetail(),
        'free':          () => FreeCtrl.init(),
        'press':         () => PressCtrl.init(),
        'job':           () => JobCtrl.init(),
        'gallery':       () => GalleryCtrl.init(),
        /* 'newsletter' / 'archive' → community-media.js 에서 처리 */
    };

    if (page && initMap[page]) {
        initMap[page]();
    }
});
