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
   8. 협회소식지 컨트롤러
   - 카드형 / 목록형 뷰 전환
   - 연도별 탭 필터
   - 최신호 하이라이트 배너
   - PDF 다운로드
══════════════════════════════════════════════ */
const NewsletterCtrl = {

    DATA: [
        {
            id: 10, year: 2026, half: '상반기',
            title: '한국숲해설가협회 소식지 2026년 상반기호',
            desc: '55기 전문가과정 수료, 사공단 봉사활동 성과, 동아리 정기총회 결과 등 2026년 상반기 주요 활동을 담았습니다.',
            date: '2026-06-30', file: '소식지_2026_상반기.pdf',
            views: 312, downloads: 185,
            tags: ['전문가과정', '사공단', '동아리', '봉사활동'],
            isLatest: true,
        },
        {
            id: 9, year: 2025, half: '하반기',
            title: '한국숲해설가협회 소식지 2025년 하반기호',
            desc: '2025년 하반기 협회 주요 활동 및 회원 소식을 담았습니다.',
            date: '2025-12-31', file: '소식지_2025_하반기.pdf',
            views: 487, downloads: 302,
            tags: ['수료식', '정기총회', '봉사활동'],
            isLatest: false,
        },
        {
            id: 8, year: 2025, half: '상반기',
            title: '한국숲해설가협회 소식지 2025년 상반기호',
            desc: '2025년 상반기 협회 주요 활동 및 회원 소식을 담았습니다.',
            date: '2025-06-30', file: '소식지_2025_상반기.pdf',
            views: 524, downloads: 341,
            tags: ['전문가과정', '역량강화', '신입회원'],
            isLatest: false,
        },
        {
            id: 7, year: 2024, half: '하반기',
            title: '한국숲해설가협회 소식지 2024년 하반기호',
            desc: '2024년 하반기 협회 주요 활동을 담았습니다.',
            date: '2024-12-31', file: '소식지_2024_하반기.pdf',
            views: 612, downloads: 398,
            tags: ['사공단', '동아리', '교육'],
            isLatest: false,
        },
        {
            id: 6, year: 2024, half: '상반기',
            title: '한국숲해설가협회 소식지 2024년 상반기호',
            desc: '2024년 상반기 협회 주요 활동을 담았습니다.',
            date: '2024-06-30', file: '소식지_2024_상반기.pdf',
            views: 578, downloads: 365,
            tags: ['전문가과정', '멘토링'],
            isLatest: false,
        },
        {
            id: 5, year: 2023, half: '하반기',
            title: '한국숲해설가협회 소식지 2023년 하반기호',
            desc: '2023년 하반기 협회 주요 활동을 담았습니다.',
            date: '2023-12-31', file: '소식지_2023_하반기.pdf',
            views: 445, downloads: 280,
            tags: ['봉사활동', '수료식'],
            isLatest: false,
        },
        {
            id: 4, year: 2023, half: '상반기',
            title: '한국숲해설가협회 소식지 2023년 상반기호',
            desc: '2023년 상반기 협회 주요 활동을 담았습니다.',
            date: '2023-06-30', file: '소식지_2023_상반기.pdf',
            views: 390, downloads: 241,
            tags: ['전문가과정', '교육'],
            isLatest: false,
        },
        {
            id: 3, year: 2022, half: '하반기',
            title: '한국숲해설가협회 소식지 2022년 하반기호',
            desc: '2022년 하반기 협회 주요 활동을 담았습니다.',
            date: '2022-12-31', file: '소식지_2022_하반기.pdf',
            views: 321, downloads: 198,
            tags: ['사공단', '동아리'],
            isLatest: false,
        },
        {
            id: 2, year: 2022, half: '상반기',
            title: '한국숲해설가협회 소식지 2022년 상반기호',
            desc: '2022년 상반기 협회 주요 활동을 담았습니다.',
            date: '2022-06-30', file: '소식지_2022_상반기.pdf',
            views: 298, downloads: 172,
            tags: ['전문가과정'],
            isLatest: false,
        },
        {
            id: 1, year: 2021, half: '하반기',
            title: '한국숲해설가협회 소식지 2021년 하반기호',
            desc: '2021년 하반기 협회 창립 이후 주요 활동을 담은 첫 소식지입니다.',
            date: '2021-12-31', file: '소식지_2021_하반기.pdf',
            views: 256, downloads: 143,
            tags: ['창립', '전문가과정'],
            isLatest: false,
        },
    ],

    _filtered: [],
    _page: 1,
    _pageSize: 6,
    _view: 'card',
    _yearFilter: 'all',

    /* ── 진입점 */
    init() {
        this._filtered = [...this.DATA];
        this._renderLatestBanner();
        this._renderYearTabs();
        this.render();
    },

    /* ── 최신호 배너 */
    _renderLatestBanner() {
        const latest = this.DATA.find(d => d.isLatest) || this.DATA[0];
        const el = document.getElementById('nlLatestBanner');
        if (!el || !latest) return;

        el.innerHTML = `
      <div class="nl-latest-cover">
        <span>📰</span>
        <span>${latest.year}</span>
      </div>
      <div class="nl-latest-info">
        <div style="font-size:12px;opacity:.7;margin-bottom:6px;
                    letter-spacing:1px;font-weight:700">✨ 최신호</div>
        <h3>${latest.title}</h3>
        <p>${latest.desc}</p>
        <div class="nl-tags">
          ${latest.tags.map(t => `<span class="nl-tag">#${t}</span>`).join('')}
        </div>
      </div>
      <div class="nl-latest-actions">
        <button class="btn btn-white btn-sm"
                onclick="NewsletterCtrl.download('${latest.file}', '${latest.title}')">
          📥 PDF 다운로드
        </button>
        <button class="btn btn-white-outline btn-sm"
                onclick="App.toast('소식지 미리보기를 엽니다.')">
          👁 미리보기
        </button>
        <div style="font-size:12px;opacity:.7;text-align:center;margin-top:4px">
          조회 ${latest.views} · 다운 ${latest.downloads}
        </div>
      </div>`;
    },

    /* ── 연도 탭 렌더 */
    _renderYearTabs() {
        const el = document.getElementById('yearTabs');
        if (!el) return;
        const years = [...new Set(this.DATA.map(d => d.year))].sort((a, b) => b - a);
        el.innerHTML = `
      <button class="year-tab active" data-year="all"
              onclick="NewsletterCtrl.filterYear('all', this)">전체</button>
      ${years.map(y => `
        <button class="year-tab" data-year="${y}"
                onclick="NewsletterCtrl.filterYear(${y}, this)">
          ${y}년
        </button>`).join('')}`;
    },

    /* ── 연도 필터 */
    filterYear(year, btn) {
        this._yearFilter = year;
        this._page = 1;
        document.querySelectorAll('.year-tab').forEach(b => b.classList.remove('active'));
        if (btn) btn.classList.add('active');
        this._applyFilter();
    },

    /* ── 검색 */
    search() {
        this._page = 1;
        this._applyFilter();
    },

    reset() {
        const el = document.getElementById('nlSearchInput');
        if (el) el.value = '';
        this._yearFilter = 'all';
        this._page = 1;
        document.querySelectorAll('.year-tab').forEach(b => b.classList.remove('active'));
        const allTab = document.querySelector('.year-tab[data-year="all"]');
        if (allTab) allTab.classList.add('active');
        this._applyFilter();
    },

    /* ── 필터 적용 */
    _applyFilter() {
        const kw = (document.getElementById('nlSearchInput')?.value || '').trim().toLowerCase();
        this._filtered = this.DATA.filter(d => {
            if (this._yearFilter !== 'all' && d.year !== this._yearFilter) return false;
            if (kw && !d.title.toLowerCase().includes(kw)) return false;
            return true;
        });
        this.render();
    },

    /* ── 뷰 전환 */
    setView(v, btn) {
        this._view = v;
        this._page = 1;
        document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
        if (btn) btn.classList.add('active');
        const cardWrap = document.getElementById('viewCardWrap');
        const listWrap = document.getElementById('viewListWrap');
        if (cardWrap) cardWrap.style.display = v === 'card' ? 'block' : 'none';
        if (listWrap) listWrap.style.display = v === 'list' ? 'block' : 'none';
        this.render();
    },

    /* ── 메인 렌더 */
    render() {
        const total = this._filtered.length;
        const slice = this._filtered.slice(
            (this._page - 1) * this._pageSize,
            this._page * this._pageSize
        );
        const countEl = document.getElementById('nlCount');
        if (countEl) countEl.textContent = total.toLocaleString();
        if (this._view === 'card') {
            this._renderCards(slice, total);
        } else {
            this._renderTable(slice, total);
        }
    },

    /* ── 카드형 렌더 */
    _renderCards(slice, total) {
        const grid = document.getElementById('nlGrid');
        if (!grid) return;
        if (!slice.length) {
            grid.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;
                    padding:60px;color:var(--gray-mid)">
          <div style="font-size:40px;margin-bottom:12px">📭</div>
          <p>검색 결과가 없습니다.</p>
        </div>`;
            App.renderPagination('nlPagination', 1, 1, () => { });
            return;
        }
        grid.innerHTML = slice.map(item => `
      <div class="nl-card">
        <div class="nl-cover">
          ${item.isLatest ? '<span class="nl-cover-badge">최신호</span>' : ''}
          <div class="nl-cover-icon">📰</div>
          <div class="nl-cover-year">${item.year}년</div>
          <div class="nl-cover-title">${item.half}호</div>
        </div>
        <div class="nl-info">
          <div class="nl-info-title">${item.title}</div>
          <div class="nl-info-desc">${item.desc}</div>
          <div class="nl-info-meta">
            <span style="font-size:12px;color:var(--gray-mid)">
              ${item.date} · 조회 ${item.views}
            </span>
            <button class="nl-download-btn"
                    onclick="NewsletterCtrl.download('${item.file}', '${item.title}')">
              📥 PDF
            </button>
          </div>
        </div>
      </div>`).join('');
        App.renderPagination(
            'nlPagination',
            this._page,
            Math.ceil(total / this._pageSize) || 1,
            (p) => { this._page = p; this.render(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
        );
    },

    /* ── 목록형 렌더 */
    _renderTable(slice, total) {
        const tbody = document.getElementById('nlTableBody');
        if (!tbody) return;
        if (!slice.length) {
            tbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align:center;padding:40px;color:var(--gray-mid)">
            검색 결과가 없습니다.
          </td>
        </tr>`;
            App.renderPagination('nlListPagination', 1, 1, () => { });
            return;
        }
        tbody.innerHTML = slice.map((item, i) => {
            const seq = total - (this._page - 1) * this._pageSize - i;
            return `
        <tr>
          <td class="center" style="font-size:13px">${seq}</td>
          <td>
            <div style="font-weight:600;margin-bottom:2px">${item.title}</div>
            <div style="font-size:12px;color:var(--gray-mid)">${item.desc}</div>
          </td>
          <td class="center" style="font-size:13px">${item.date}</td>
          <td class="center" style="font-size:13px">${item.views}</td>
          <td class="center">
            <button class="btn btn-outline btn-xs"
                    onclick="NewsletterCtrl.download('${item.file}', '${item.title}')">
              📥 PDF
            </button>
          </td>
        </tr>`;
        }).join('');
        App.renderPagination(
            'nlListPagination',
            this._page,
            Math.ceil(total / this._pageSize) || 1,
            (p) => { this._page = p; this.render(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
        );
    },

    /* ── 다운로드 */
    download(file, title) {
        App.toast(`📥 "${title}" 다운로드를 시작합니다.`);
        /* 실제 구현 시: window.open(`/uploads/${file}`) */
    },
};


/* ══════════════════════════════════════════════
   9. 자료실 컨트롤러 (정회원 전용)
   - 카테고리 사이드바 필터
   - 파일형식 / 키워드 복합 검색
   - 정렬 (최신순 / 조회순 / 다운로드순)
   - 권한별 다운로드 잠금 + 오버레이
══════════════════════════════════════════════ */
const ArchiveCtrl = {

    DATA: [
        /* 교육자료 */
        {
            id: 20, category: '교육자료',
            title: '숲해설가 교육 매뉴얼 2026',
            desc: '2026년 개정 숲해설가 교육 과정 전체 매뉴얼입니다.',
            author: '사무국', date: '2026-03-01',
            file: '교육매뉴얼_2026.pdf', ext: 'pdf', size: '4.2MB',
            views: 312, downloads: 187,
        },
        {
            id: 19, category: '교육자료',
            title: '봄철 식물 해설 참고자료',
            desc: '봄철 주요 식물 해설에 활용할 수 있는 사진·설명 자료집입니다.',
            author: '사무국', date: '2026-02-20',
            file: '봄철식물자료.pdf', ext: 'pdf', size: '8.1MB',
            views: 245, downloads: 142,
        },
        {
            id: 18, category: '교육자료',
            title: '숲 생태 해설 자료집 v3',
            desc: '숲 생태 관련 해설 자료 최신 버전입니다.',
            author: '교육팀', date: '2025-11-15',
            file: '생태해설자료_v3.pdf', ext: 'pdf', size: '6.7MB',
            views: 423, downloads: 258,
        },
        {
            id: 17, category: '교육자료',
            title: '조류 생태 관찰 가이드',
            desc: '숲 해설 시 자주 만나는 조류 30종 사진 및 설명 가이드입니다.',
            author: '생태팀', date: '2025-09-10',
            file: '조류가이드.pdf', ext: 'pdf', size: '5.3MB',
            views: 367, downloads: 213,
        },
        /* 양식서류 */
        {
            id: 16, category: '양식서류',
            title: '협회 회원 가입 신청서',
            desc: '협회 신규 회원 가입 시 제출하는 신청서 양식입니다.',
            author: '사무국', date: '2026-01-05',
            file: '회원가입신청서.hwp', ext: 'hwp', size: '0.3MB',
            views: 521, downloads: 395,
        },
        {
            id: 15, category: '양식서류',
            title: '강사 활동 일지 양식',
            desc: '숲 해설 강사 활동 일지 작성 양식입니다. 월별 작성 후 제출해 주세요.',
            author: '사무국', date: '2026-01-05',
            file: '강사활동일지.hwp', ext: 'hwp', size: '0.2MB',
            views: 389, downloads: 312,
        },
        {
            id: 14, category: '양식서류',
            title: '사공단 활동 보고 양식',
            desc: '사회공헌사업단 활동 보고서 작성 양식입니다.',
            author: '사무국', date: '2026-01-05',
            file: '사공단활동보고.hwp', ext: 'hwp', size: '0.2MB',
            views: 278, downloads: 201,
        },
        {
            id: 13, category: '양식서류',
            title: '동아리 활동 계획서 양식',
            desc: '동아리 연간 활동 계획서 작성 양식입니다.',
            author: '사무국', date: '2025-12-20',
            file: '동아리활동계획서.docx', ext: 'docx', size: '0.2MB',
            views: 234, downloads: 178,
        },
        /* 보고서 */
        {
            id: 12, category: '보고서',
            title: '2025년 사업 결과 보고서',
            desc: '2025년 협회 전체 사업 추진 결과 종합 보고서입니다.',
            author: '사무국', date: '2026-02-10',
            file: '2025사업결과보고서.pdf', ext: 'pdf', size: '3.5MB',
            views: 445, downloads: 267,
        },
        {
            id: 11, category: '보고서',
            title: '2025년 사공단 연간 활동 보고서',
            desc: '2025년 사회공헌사업단 연간 봉사 활동 실적 보고서입니다.',
            author: '사공단', date: '2026-02-05',
            file: '사공단_2025연간보고.pdf', ext: 'pdf', size: '2.1MB',
            views: 312, downloads: 189,
        },
        {
            id: 10, category: '보고서',
            title: '회원 현황 통계 보고서 2025',
            desc: '2025년 회원 현황 및 활동 통계 보고서입니다.',
            author: '사무국', date: '2026-01-20',
            file: '회원통계_2025.xlsx', ext: 'xlsx', size: '1.2MB',
            views: 198, downloads: 124,
        },
        /* 규정/정관 */
        {
            id: 9, category: '규정/정관',
            title: '협회 정관 (2026년 개정)',
            desc: '2026년 정기총회에서 개정된 최신 협회 정관입니다.',
            author: '사무국', date: '2026-03-01',
            file: '협회정관_2026.pdf', ext: 'pdf', size: '0.8MB',
            views: 567, downloads: 348,
        },
        {
            id: 8, category: '규정/정관',
            title: '회원 규정집 (2025년 개정)',
            desc: '회원 등급, 권리/의무, 징계 등 회원 규정 전체를 담은 문서입니다.',
            author: '사무국', date: '2025-08-15',
            file: '회원규정_2025.pdf', ext: 'pdf', size: '0.6MB',
            views: 412, downloads: 256,
        },
        {
            id: 7, category: '규정/정관',
            title: '윤리강령 및 행동지침',
            desc: '협회 임원 및 회원의 윤리강령과 행동지침을 담은 문서입니다.',
            author: '사무국', date: '2025-03-10',
            file: '윤리강령.pdf', ext: 'pdf', size: '0.4MB',
            views: 289, downloads: 167,
        },
        /* 기타 */
        {
            id: 6, category: '기타',
            title: '회원 혜택 안내문 2026',
            desc: '2026년 협회 회원 혜택 및 지원 사항 안내 문서입니다.',
            author: '사무국', date: '2026-01-10',
            file: '회원혜택안내_2026.pdf', ext: 'pdf', size: '0.5MB',
            views: 478, downloads: 312,
        },
        {
            id: 5, category: '기타',
            title: '숲해설가 자격 취득 안내',
            desc: '국가 공인 숲해설가 자격 취득 절차 및 준비 사항 안내입니다.',
            author: '사무국', date: '2025-10-05',
            file: '자격취득안내.pdf', ext: 'pdf', size: '0.7MB',
            views: 634, downloads: 421,
        },
        {
            id: 4, category: '기타',
            title: '협회 홍보 브로슈어 2025',
            desc: '협회 소개 및 주요 사업을 담은 홍보용 브로슈어 파일입니다.',
            author: '홍보팀', date: '2025-06-01',
            file: '홍보브로슈어_2025.pdf', ext: 'pdf', size: '12.3MB',
            views: 345, downloads: 198,
        },
        {
            id: 3, category: '기타',
            title: '2025 정기총회 자료집',
            desc: '2025년 정기총회 발표 자료 및 결의 사항을 담은 문서입니다.',
            author: '사무국', date: '2025-02-20',
            file: '정기총회_2025.pdf', ext: 'pdf', size: '2.8MB',
            views: 512, downloads: 334,
        },
        {
            id: 2, category: '기타',
            title: '숲해설 프로그램 운영 가이드',
            desc: '숲해설 프로그램 기획부터 운영까지 전반적인 가이드입니다.',
            author: '교육팀', date: '2024-11-30',
            file: '프로그램운영가이드.pdf', ext: 'pdf', size: '3.1MB',
            views: 423, downloads: 278,
        },
        {
            id: 1, category: '기타',
            title: '협회 연혁 자료 모음',
            desc: '협회 설립부터 현재까지 주요 연혁을 정리한 자료입니다.',
            author: '사무국', date: '2024-06-15',
            file: '연혁자료.pdf', ext: 'pdf', size: '1.4MB',
            views: 234, downloads: 156,
        },
    ],

    _filtered: [],
    _page: 1,
    _pageSize: 10,
    _currentCategory: '',
    _currentSort: 'latest',
    _isFullMember: false,

    /* ── 진입점 */
    init() {
        this._isFullMember = (
            typeof App !== 'undefined' &&
            (App.user.role === 'fullMember' || App.user.role === 'admin')
        );
        this._applyAccessControl();
        this._updateCategoryCounts();
        this._filtered = [...this.DATA];
        this.render();
    },

    /* ── 권한 처리 */
    _applyAccessControl() {
        /* 접근 배너: 비정회원에게 노출 */
        const banner = document.getElementById('accessBanner');
        if (banner) banner.style.display = !this._isFullMember ? 'flex' : 'none';

        /* 통계: 정회원만 노출 */
        const stats = document.getElementById('archiveStats');
        if (stats && this._isFullMember) {
            stats.style.display = 'grid';
            this._renderStats();
        }

        /* 다운로드 잠금 오버레이 */
        const lockMask = document.getElementById('lockMask');
        if (lockMask) lockMask.style.display = !this._isFullMember ? 'flex' : 'none';
    },

    /* ── 통계 렌더 */
    _renderStats() {
        const set = (id, v) => {
            const el = document.getElementById(id);
            if (el) el.textContent = v.toLocaleString();
        };
        const now = new Date();
        const thisM = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        set('statTotalFiles', this.DATA.length);
        set('statThisMonth', this.DATA.filter(d => d.date.startsWith(thisM)).length);
        set('statTotalDownload', this.DATA.reduce((s, d) => s + d.downloads, 0));
        set('statTotalViews', this.DATA.reduce((s, d) => s + d.views, 0));
    },

    /* ── 카테고리 카운트 */
    _updateCategoryCounts() {
        const cats = ['교육자료', '양식서류', '보고서', '규정/정관', '기타'];
        const allEl = document.getElementById('catCountAll');
        if (allEl) allEl.textContent = this.DATA.length;
        cats.forEach(cat => {
            const el = document.getElementById(`catCount_${cat}`);
            if (el) el.textContent = this.DATA.filter(d => d.category === cat).length;
        });
    },

    /* ── 카테고리 필터 */
    filterByCategory(cat, btn) {
        this._currentCategory = cat;
        this._page = 1;

        /* 사이드바 활성화 */
        document.querySelectorAll('.archive-cat-item')
            .forEach(el => el.classList.remove('active'));
        if (btn) {
            btn.classList.add('active');
        } else {
            document.querySelectorAll(`.archive-cat-item[data-cat="${cat}"]`)
                .forEach(el => el.classList.add('active'));
        }

        /* select 동기화 */
        const sel = document.getElementById('archiveCategoryFilter');
        if (sel) sel.value = cat;

        this._applyFilter();
    },

    /* ── 정렬 */
    changeSort(sort) {
        this._currentSort = sort;
        this._page = 1;
        this._applyFilter();
    },

    /* ── 검색 */
    search() {
        this._page = 1;
        this._applyFilter();
    },

    reset() {
        this._currentCategory = '';
        this._currentSort = 'latest';
        this._page = 1;
        ['archiveCategoryFilter', 'archiveFileType', 'archiveKeyword'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        document.querySelectorAll('.archive-cat-item')
            .forEach(el => el.classList.remove('active'));
        const allCat = document.querySelector('.archive-cat-item[data-cat=""]');
        if (allCat) allCat.classList.add('active');
        this._applyFilter();
    },

    /* ── 필터 + 정렬 */
    _applyFilter() {
        const keyword = (document.getElementById('archiveKeyword')?.value || '').trim().toLowerCase();
        const fileType = document.getElementById('archiveFileType')?.value || '';

        this._filtered = this.DATA.filter(d => {
            if (this._currentCategory && d.category !== this._currentCategory) return false;
            if (fileType && d.ext !== fileType) return false;
            if (keyword && !d.title.toLowerCase().includes(keyword) &&
                !d.desc.toLowerCase().includes(keyword)) return false;
            return true;
        });

        const sortMap = {
            latest: (a, b) => b.date.localeCompare(a.date),
            views: (a, b) => b.views - a.views,
            download: (a, b) => b.downloads - a.downloads,
        };
        this._filtered.sort(sortMap[this._currentSort] || sortMap.latest);
        this.render();
    },

    /* ── 파일 확장자 → 뱃지 클래스 */
    _extClass(ext) {
        const map = {
            pdf: 'file-type-pdf', hwp: 'file-type-hwp',
            docx: 'file-type-docx', xlsx: 'file-type-xlsx',
            zip: 'file-type-zip',
        };
        return map[(ext || '').toLowerCase()] || 'file-type-etc';
    },

    /* ── 메인 렌더 */
    render() {
        const total = this._filtered.length;
        const slice = this._filtered.slice(
            (this._page - 1) * this._pageSize,
            this._page * this._pageSize
        );

        const countEl = document.getElementById('archiveCount');
        if (countEl) countEl.textContent = total.toLocaleString();

        const listEl = document.getElementById('archiveCardList');
        if (!listEl) return;

        if (!slice.length) {
            listEl.innerHTML = `
        <div style="text-align:center;padding:60px 24px;color:var(--gray-mid)">
          <div style="font-size:40px;margin-bottom:12px">📂</div>
          <p style="font-size:15px">검색 결과가 없습니다.</p>
        </div>`;
            App.renderPagination('archivePagination', 1, 1, () => { });
            return;
        }

        listEl.innerHTML = slice.map(item => {
            const extCls = this._extClass(item.ext);
            const extUpper = (item.ext || 'FILE').toUpperCase();
            /* 비정회원: 다운로드 버튼 잠금 */
            const dlBtn = this._isFullMember
                ? `<button class="btn btn-primary btn-sm"
                   onclick="ArchiveCtrl.download('${item.file}', '${item.title}')">
             다운로드
           </button>`
                : `<button class="btn btn-gray btn-sm" disabled title="정회원만 다운로드 가능합니다.">
             다운로드
           </button>`;

            return `
        <div class="archive-item-row">
          <div class="file-type-badge ${extCls}">${extUpper}</div>
          <div class="archive-item-body">
            <div class="archive-item-title">${item.title}</div>
            <div class="archive-item-meta">
              <span>${item.category}</span>
              <span>${item.author}</span>
              <span>${item.date}</span>
              <span>${item.size}</span>
              <span>조회 ${item.views}</span>
              <span>다운 ${item.downloads}</span>
            </div>
            <div style="font-size:12px;color:var(--gray-mid);margin-top:4px;
                        white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
              ${item.desc}
            </div>
          </div>
          <div class="archive-item-actions">
            ${dlBtn}
          </div>
        </div>`;
        }).join('');

        App.renderPagination(
            'archivePagination',
            this._page,
            Math.ceil(total / this._pageSize) || 1,
            (p) => {
                this._page = p;
                this.render();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        );
    },

    /* ── 다운로드 핸들러 */
    download(file, title) {
        if (!this._isFullMember) {
            App.toast('정회원만 다운로드할 수 있습니다.', 'warning');
            return;
        }
        App.toast(`📥 "${title}" 다운로드를 시작합니다.`);
        /* 실제 구현 시: window.open(`/uploads/${file}`) */
    },
};


/* ══════════════════════════════════════════════
   10. 페이지 자동 초기화
══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
    const page = document.body.dataset.page;

    const initMap = {
        'calendar': () => CalendarCtrl.init(),
        'notice': () => NoticeCtrl.init(),
        'notice-detail': () => NoticeCtrl.renderDetail(),
        'free': () => FreeCtrl.init(),
        'press': () => PressCtrl.init(),
        'job': () => JobCtrl.init(),
        'gallery': () => GalleryCtrl.init(),
        'newsletter': () => NewsletterCtrl.init(),
        'archive': () => ArchiveCtrl.init(),
    };

    if (page && initMap[page]) {
        initMap[page]();
    }
});
