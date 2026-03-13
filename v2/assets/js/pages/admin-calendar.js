/* =============================================
   admin-calendar.js | 관리자 일정관리
   ============================================= */
'use strict';

const CalAdmin = {
  _events: [
    { id:1, date:'2026-03-05', title:'이사회 회의',         cat:'meeting',  link:true,  desc:'2026년 1분기 정기 이사회\n📍 장소: 협회 사무실\n⏰ 시간: 14:00~16:00' },
    { id:2, date:'2026-03-10', title:'전문가과정 OT',       cat:'edu',      link:true,  desc:'2026년 55기 전문가과정 오리엔테이션\n📍 장소: OO교육센터\n⏰ 시간: 10:00~12:00' },
    { id:3, date:'2026-03-15', title:'전문가과정 접수마감', cat:'edu',      link:true,  desc:'55기 전문가과정 신청 마감일' },
    { id:4, date:'2026-03-18', title:'봉사활동 - 도봉구',   cat:'activity', link:false, desc:'도봉구 초등학교 숲 체험 교육 봉사\n📍 장소: 도봉산 일원\n⏰ 시간: 09:00~13:00' },
    { id:5, date:'2026-03-20', title:'숲사랑단 정기모임',   cat:'club',     link:true,  desc:'3월 정기모임 및 봄철 탐방 계획 수립' },
    { id:6, date:'2026-03-22', title:'시민아카데미 강좌',   cat:'edu',      link:true,  desc:'봄 숲 이야기 시민 특강' },
    { id:7, date:'2026-03-25', title:'산들바람 모임',       cat:'club',     link:true,  desc:'산들바람 동아리 3월 정기모임' },
    { id:8, date:'2026-03-28', title:'봉사활동 - 노원구',   cat:'activity', link:false, desc:'노원구 복지관 자연치유 프로그램' },
  ],
  _catFilter: { edu:true, activity:true, meeting:true, club:true },
  CAT_COLOR: { edu:'evt-edu', activity:'evt-activity', meeting:'evt-meeting', club:'evt-club' },
  CAT_LABEL: { edu:'교육/강좌', activity:'봉사활동', meeting:'협회회의', club:'동아리' },
  _year: 2026, _month: 2,
  _editId: null,
  _detailId: null,

  init() {
    this._renderCatFilter();
    this.render();
    this._renderTable();
  },

  _renderCatFilter() {
    const el = document.getElementById('adminCatFilter');
    if (!el) return;
    el.innerHTML = Object.entries(this.CAT_LABEL).map(([k, v]) => `
      <div class="filter-item">
        <input type="checkbox" id="cat_${k}" checked onchange="CalAdmin.toggleCat('${k}',this.checked)">
        <div class="filter-dot" style="background:var(--${k === 'edu' ? 'green-main' : k === 'activity' ? 'accent' : k === 'meeting' ? 'info' : 'purple', 'green-main'})"></div>
        <label for="cat_${k}" style="cursor:pointer;font-size:14px">${v}</label>
      </div>`).join('');
  },

  toggleCat(cat, checked) {
    this._catFilter[cat] = checked;
    this.render();
  },

  changeMonth(delta) {
    this._month += delta;
    if (this._month > 11) { this._month = 0; this._year++; }
    if (this._month < 0)  { this._month = 11; this._year--; }
    this.render();
  },

  _getEvents(y, m, d) {
    const ds = `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    return this._events.filter(e => e.date === ds && this._catFilter[e.cat]);
  },

  render() {
    const { _year: y, _month: m } = this;
    const titleEl = document.getElementById('calAdminTitle');
    if (titleEl) titleEl.textContent = `${y}년 ${m+1}월`;

    const first   = new Date(y, m, 1).getDay();
    const lastDay = new Date(y, m+1, 0).getDate();
    const today   = new Date();
    const days    = ['일','월','화','수','목','금','토'];

    let html = days.map((d, i) =>
      `<div class="full-day-header ${i===0?'sun':i===6?'sat':''}">${d}</div>`
    ).join('');

    for (let i = 0; i < first; i++) html += `<div class="full-cell other-month"></div>`;

    for (let d = 1; d <= lastDay; d++) {
      const dow     = (first + d - 1) % 7;
      const isToday = y === today.getFullYear() && m === today.getMonth() && d === today.getDate();
      const evts    = this._getEvents(y, m, d);
      const dateCls = ['cell-date', isToday?'today-num':'', dow===0?'sun':dow===6?'sat':''].filter(Boolean).join(' ');

      html += `<div class="full-cell${isToday?' today':''}">
        <div class="${dateCls}" style="cursor:pointer" onclick="CalAdmin.openCreateModalOnDate('${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}')">${d}</div>
        ${evts.slice(0,2).map(e =>
          `<span class="event-tag ${this.CAT_COLOR[e.cat]}"
                onclick="event.stopPropagation();CalAdmin.openEventDetail(${e.id})">${e.title}</span>`
        ).join('')}
        ${evts.length > 2 ? `<span style="font-size:10px;color:var(--gray-mid)">+${evts.length-2}건</span>` : ''}
      </div>`;
    }

    const grid = document.getElementById('adminCalGrid');
    if (grid) grid.innerHTML = html;

    /* 사이드 일정 목록 */
    const monthEvts = this._events.filter(e => {
      const d = new Date(e.date);
      return d.getFullYear() === y && d.getMonth() === m && this._catFilter[e.cat];
    }).sort((a, b) => a.date.localeCompare(b.date));

    const titleSide = document.getElementById('adminEvtDateTitle');
    if (titleSide) titleSide.textContent = `${m+1}월 일정 (${monthEvts.length}건)`;

    const listEl = document.getElementById('adminEvtList');
    if (listEl) {
      listEl.innerHTML = monthEvts.length
        ? monthEvts.map(e => `
          <div style="padding:8px 0;border-bottom:1px solid var(--gray-light)">
            <div style="font-size:12px;color:var(--gray-mid)">${e.date} · ${this.CAT_LABEL[e.cat]}</div>
            <div style="font-size:13px;font-weight:600;margin:2px 0">${e.title}</div>
            <div style="display:flex;gap:4px;margin-top:4px">
              <button class="btn btn-outline btn-xs" onclick="CalAdmin.openEventDetail(${e.id})">상세</button>
              <button class="btn btn-outline btn-xs" onclick="location.href='calendar-edit.html?id=${e.id}'">수정</button>
              <button class="btn btn-danger btn-xs" onclick="CalAdmin.deleteEvent(${e.id})">삭제</button>
            </div>
          </div>`).join('')
        : '<p style="font-size:13px;color:var(--gray-mid);text-align:center;padding:16px 0">일정이 없습니다.</p>';
    }
  },

  _renderTable() {
    const tbody = document.getElementById('adminEventTableBody');
    if (!tbody) return;
    const sorted = [...this._events].sort((a,b) => a.date.localeCompare(b.date));
    tbody.innerHTML = sorted.map((e, i) => `
      <tr style="cursor:pointer" onclick="location.href='calendar-detail.html?id=${e.id}'"
          title="${e.title} 상세보기">
        <td class="center" onclick="event.stopPropagation()">${i+1}</td>
        <td class="center" style="font-size:13px">${e.date}</td>
        <td style="font-weight:500">${e.title}</td>
        <td class="center" onclick="event.stopPropagation()">
          <span class="badge badge-green" style="font-size:11px">${this.CAT_LABEL[e.cat] || e.cat}</span>
        </td>
        <td class="center" onclick="event.stopPropagation()">
          <span style="font-size:13px">${e.link ? '연결됨' : '-'}</span>
        </td>
        <td class="center" onclick="event.stopPropagation()">
          <div style="display:flex;gap:4px;justify-content:center">
            <button class="btn btn-outline btn-xs"
              onclick="event.stopPropagation();location.href='calendar-edit.html?id=${e.id}'">수정</button>
            <button class="btn btn-danger btn-xs"
              onclick="event.stopPropagation();CalAdmin.deleteEvent(${e.id})">삭제</button>
          </div>
        </td>
      </tr>`).join('');
  },

  /* ── 일정 상세 모달 */
  openEventDetail(id) {
    const e = this._events.find(x => x.id === id);
    if (!e) return;
    this._detailId = id;

    const catLabel = this.CAT_LABEL[e.cat] || e.cat;
    const linkHtml = e.link
      ? (e.link === true
          ? `<span style="color:var(--green-dark)">연결됨</span>`
          : `<a href="${e.link}" target="_blank" style="color:var(--green-dark);word-break:break-all">${e.link}</a>`)
      : `<span style="color:var(--gray-mid)">없음</span>`;

    document.getElementById('calDetailTitle').textContent = e.title;
    document.getElementById('calDetailBody').innerHTML = `
      <div style="display:flex;flex-direction:column;gap:14px;font-size:14px">
        <div style="background:var(--green-pale);border-radius:8px;padding:14px">
          <div style="font-weight:700;font-size:16px;color:var(--green-dark);margin-bottom:6px">${e.title}</div>
          <div style="font-size:12px;color:var(--gray-mid)">${e.date} · ${catLabel}</div>
        </div>
        ${[
          ['날짜',     `<strong>${e.date}</strong>`],
          ['카테고리', catLabel],
          ['관련 링크', linkHtml],
          ['설명',     e.desc ? `<span style="white-space:pre-line">${e.desc}</span>` : `<span style="color:var(--gray-mid)">-</span>`],
        ].map(([k, v]) => `
          <div style="display:flex;gap:16px;border-bottom:1px solid var(--gray-light);padding-bottom:10px">
            <span style="width:70px;font-weight:700;color:var(--gray-mid);flex-shrink:0">${k}</span>
            <span>${v}</span>
          </div>`).join('')}
      </div>`;

    /* 수정 버튼 링크 연결 */
    const editBtn = document.getElementById('calDetailEditBtn');
    if (editBtn) editBtn.onclick = () => {
      App.closeModal('calDetailModal');
      location.href = `calendar-edit.html?id=${id}`;
    };

    App.openModal('calDetailModal');
  },

  deleteFromDetail() {
    if (!this._detailId) return;
    if (!confirm('이 일정을 삭제하시겠습니까?')) return;
    this._events = this._events.filter(e => e.id !== this._detailId);
    App.closeModal('calDetailModal');
    this.render();
    this._renderTable();
    App.toast('일정이 삭제되었습니다.', 'error');
    this._detailId = null;
  },

  openCreateModal() {
    this._editId = null;
    document.getElementById('calEventModalTitle').textContent = '일정 등록';
    ['evtDate','evtTitle','evtLink'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    const c = document.getElementById('evtCat'); if (c) c.value = '';
    App.openModal('calEventModal');
  },

  openCreateModalOnDate(date) {
    this.openCreateModal();
    const d = document.getElementById('evtDate'); if (d) d.value = date;
  },

  saveEvent() {
    const get = id => document.getElementById(id)?.value.trim() || '';
    const date  = get('evtDate');
    const cat   = get('evtCat');
    const title = get('evtTitle');
    const link  = get('evtLink');

    if (!date)  { App.toast('날짜를 선택해주세요.', 'warning');    return; }
    if (!cat)   { App.toast('카테고리를 선택해주세요.', 'warning'); return; }
    if (!title) { App.toast('제목을 입력해주세요.', 'warning');    return; }

    const payload = { date, cat, title, link: link || null };

    if (this._editId) {
      const idx = this._events.findIndex(e => e.id === this._editId);
      if (idx > -1) this._events[idx] = { ...this._events[idx], ...payload };
      App.toast('일정이 수정되었습니다.');
    } else {
      payload.id = Date.now();
      this._events.push(payload);
      App.toast('일정이 등록되었습니다.');
    }

    this.render();
    this._renderTable();
    App.closeModal('calEventModal');
  },

  deleteEvent(id) {
    if (!confirm('일정을 삭제하시겠습니까?')) return;
    this._events = this._events.filter(e => e.id !== id);
    this.render();
    this._renderTable();
    App.toast('일정이 삭제되었습니다.', 'error');
  },
};
