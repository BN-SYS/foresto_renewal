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
                onclick="CalAdmin.openEditModal(${e.id})">${e.title}</span>`
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
              <button class="btn btn-outline btn-xs" onclick="CalAdmin.openEditModal(${e.id})">수정</button>
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
      <tr>
        <td class="center">${i+1}</td>
        <td class="center" style="font-size:13px">${e.date}</td>
        <td style="font-weight:500">${e.title}</td>
        <td class="center"><span class="badge badge-green" style="font-size:11px">${this.CAT_LABEL[e.cat]}</span></td>
        <td class="center"><span style="font-size:13px">${e.link ? '✅' : '-'}</span></td>
        <td class="center">
          <div style="display:flex;gap:4px;justify-content:center">
            <button class="btn btn-outline btn-xs" onclick="CalAdmin.openEditModal(${e.id})">수정</button>
            <button class="btn btn-danger btn-xs" onclick="CalAdmin.deleteEvent(${e.id})">삭제</button>
          </div>
        </td>
      </tr>`).join('');
  },

  openCreateModal() {
    this._editId = null;
    document.getElementById('calEventModalTitle').textContent = '일정 등록';
    ['evtDate','evtTitle','evtDesc'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    const c = document.getElementById('evtCat'); if (c) c.value = 'edu';
    const l = document.getElementById('evtLink'); if (l) l.checked = false;
    App.openModal('calEventModal');
  },

  openCreateModalOnDate(date) {
    this.openCreateModal();
    const d = document.getElementById('evtDate'); if (d) d.value = date;
  },

  openEditModal(id) {
    const e = this._events.find(x => x.id === id);
    if (!e) return;
    this._editId = id;
    document.getElementById('calEventModalTitle').textContent = '일정 수정';
    const set = (elId, val) => { const el = document.getElementById(elId); if (el) el.value = val || ''; };
    set('evtDate',  e.date);
    set('evtTitle', e.title);
    set('evtCat',   e.cat);
    set('evtDesc',  e.desc);
    const l = document.getElementById('evtLink'); if (l) l.checked = e.link;
    App.openModal('calEventModal');
  },

  saveEvent() {
    const get = id => document.getElementById(id)?.value.trim() || '';
    const date  = get('evtDate');
    const title = get('evtTitle');
    const cat   = get('evtCat');
    if (!date)  { App.toast('날짜를 선택해주세요.', 'warning');   return; }
    if (!title) { App.toast('제목을 입력해주세요.', 'warning'); return; }

    const payload = {
      date,  title,  cat,
      desc: get('evtDesc'),
      link: document.getElementById('evtLink')?.checked || false,
    };

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
