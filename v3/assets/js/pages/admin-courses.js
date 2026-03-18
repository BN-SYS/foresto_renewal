/* =============================================
   admin-courses.js | 강좌관리 페이지 로직
   ============================================= */
'use strict';

const CourseAdmin = {

  /* ── 데이터 (실제 구현 시 API 교체) */
  _courses: ALL_COURSES_RAW ? [...ALL_COURSES_RAW] : [],
  _applies: [],
  _filtered: [],
  _applyFiltered: [],
  _page: 1,
  _applyPage: 1,
  _pageSize: 10,
  _editId: null,
  _currentApplyId: null,

  init() {
    this._generateApplyData();
    this._populateCourseSelects();
    this._filtered = [...this._courses];
    this.render();
  },

  /* ── 샘플 신청자 데이터 생성 */
  _generateApplyData() {
    const names    = ['김숲해설','이초록','박자연','최나무','정바람','윤하늘','강숲속','조생태','신나뭇잎','한자연'];
    const statuses = ['pending','approved','approved','rejected','pending','approved','cancel','approved','pending','approved'];
    this._applies  = this._courses
      .filter(c => ['open','closed','done'].includes(c.status))
      .slice(0, 8)
      .flatMap((c, ci) =>
        Array.from({ length: Math.floor(Math.random() * 5) + 2 }, (_, i) => ({
          id:        `${c.id}-${i}`,
          courseId:  c.id,
          courseTitle: c.title,
          name:      names[(ci + i) % names.length],
          phone:     `010-${String(1000 + ci * 10 + i).padStart(4,'0')}-${String(2000 + i).padStart(4,'0')}`,
          email:     `user${ci * 10 + i}@example.com`,
          region:    ['서울','경기','인천','부산'][i % 4],
          applyDate: `2026-03-${String((i + 1) * 2).padStart(2,'0')}`,
          status:    statuses[(ci + i) % statuses.length],
          note:      i % 3 === 0 ? '특이사항 없음' : '',
        }))
      );
    this._applyFiltered = [...this._applies];
  },

  /* ── 강좌 선택 셀렉트 채우기 */
  _populateCourseSelects() {
    const openCourses = this._courses.filter(c => ['open','closed','done'].includes(c.status));
    ['applyCourseFilter','completeCourseFilter'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      openCourses.forEach(c => {
        const opt = document.createElement('option');
        opt.value       = c.id;
        opt.textContent = c.title;
        el.appendChild(opt);
      });
    });
  },

  /* ── 탭 전환 */
  switchTab(tab, btn) {
    ['list','apply','complete'].forEach(t => {
      const el = document.getElementById(`tab-${t}`);
      if (el) el.style.display = t === tab ? 'block' : 'none';
    });
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    if (tab === 'apply')    this.renderApply();
    if (tab === 'complete') this._renderCompleteEmpty();
  },

  /* ════════════════════════════════
     강좌 목록
  ════════════════════════════════ */
  search() {
    const type    = document.getElementById('filterType')?.value    || '';
    const status  = document.getElementById('filterStatus')?.value  || '';
    const keyword = document.getElementById('filterKeyword')?.value.trim().toLowerCase() || '';

    this._filtered = this._courses.filter(c => {
      if (type    && c.type   !== type)                         return false;
      if (status  && c.status !== status)                       return false;
      if (keyword && !c.title.toLowerCase().includes(keyword)) return false;
      return true;
    });
    this._page = 1;
    this.render();
  },

  resetFilter() {
    ['filterType','filterStatus','filterKeyword'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    this._filtered = [...this._courses];
    this._page = 1;
    this.render();
  },

  changePageSize(size) {
    this._pageSize = size;
    this._page     = 1;
    this.render();
  },

  render() {
    const total = this._filtered.length;
    const slice = this._filtered.slice(
      (this._page - 1) * this._pageSize,
      this._page * this._pageSize
    );

    const countEl = document.getElementById('courseCount');
    if (countEl) countEl.textContent = total.toLocaleString();

    const tbody = document.getElementById('courseTableBody');
    if (!tbody) return;

    if (!slice.length) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:32px;color:var(--gray-mid)">검색 결과가 없습니다.</td></tr>`;
      App.renderPagination('coursePagination', 1, 1, () => {});
      return;
    }

    const applyCountMap = {};
    this._applies.forEach(a => {
      if (!applyCountMap[a.courseId]) applyCountMap[a.courseId] = 0;
      if (a.status === 'approved')    applyCountMap[a.courseId]++;
    });

    tbody.innerHTML = slice.map((c, i) => {
      const sm       = STATUS_META[c.status] || { label: c.status, cls: '' };
      const capacity = c.capacity || 20;
      const applyN   = applyCountMap[c.id] || 0;
      const seq      = total - (this._page - 1) * this._pageSize - i;

      return `<tr style="cursor:pointer" onclick="location.href='course-detail.html?id=${c.id}'"
                  title="${c.title} 상세보기">
        <td class="center" onclick="event.stopPropagation()">${seq}</td>
        <td class="center" onclick="event.stopPropagation()">
          <span class="badge badge-green" style="font-size:12px">${c.type}</span>
        </td>
        <td style="font-weight:500">${c.title}</td>
        <td class="center" style="font-size:13px">${c.from || c.date || '-'}</td>
        <td class="center">${applyN}명</td>
        <td class="center">${capacity}명</td>
        <td class="center" onclick="event.stopPropagation()">
          <span class="status-badge ${sm.cls}">${sm.label}</span>
        </td>
        <td class="center" onclick="event.stopPropagation()">
          <div style="display:flex;gap:4px;justify-content:center">
            <button class="btn btn-outline btn-xs"
              onclick="event.stopPropagation();location.href='course-edit.html?id=${c.id}'">수정</button>
            <button class="btn btn-danger btn-xs"
              onclick="event.stopPropagation();CourseAdmin.deleteCourse(${c.id})">삭제</button>
          </div>
        </td>
      </tr>`;
    }).join('');

    App.renderPagination('coursePagination', this._page, Math.ceil(total / this._pageSize) || 1, p => {
      this._page = p;
      this.render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  },

  /* ── 강좌 개설 모달 열기 */
  openCreateModal() {
    this._editId = null;
    document.getElementById('courseModalTitle').textContent = '강좌 개설';
    ['modalCourseTitle','modalCourseLocation','modalCourseFee','modalCourseGuide'].forEach(id => {
      const el = document.getElementById(id); if (el) el.value = '';
    });
    ['modalCourseFrom','modalCourseTo','modalApplyFrom','modalApplyTo'].forEach(id => {
      const el = document.getElementById(id); if (el) el.value = '';
    });
    const typeEl = document.getElementById('modalCourseType');    if (typeEl)     typeEl.value     = '';
    const statusEl = document.getElementById('modalCourseStatus'); if (statusEl) statusEl.value = 'ready';
    const hoursEl = document.getElementById('modalCourseHours');  if (hoursEl)   hoursEl.value  = '';
    const capEl   = document.getElementById('modalCourseCapacity');if (capEl)    capEl.value    = '';
    App.openModal('courseModal');
  },

  /* ── 강좌 수정 모달 열기 */
  openEditModal(id) {
    const c = this._courses.find(x => x.id === id);
    if (!c) return;
    this._editId = id;
    document.getElementById('courseModalTitle').textContent = '강좌 수정';

    const set = (elId, val) => { const el = document.getElementById(elId); if (el) el.value = val || ''; };
    set('modalCourseType',     c.type);
    set('modalCourseStatus',   c.status);
    set('modalCourseTitle',    c.title);
    set('modalCourseFrom',     c.from || c.date);
    set('modalCourseTo',       c.to   || c.date);
    set('modalCourseHours',    c.hours   || '');
    set('modalApplyFrom',      c.applyFrom || '');
    set('modalApplyTo',        c.applyTo   || '');
    set('modalCourseCapacity', c.capacity  || '');
    set('modalCourseFee',      c.fee       || '');
    set('modalCourseLocation', c.location  || '');
    set('modalCourseGuide',    c.guide     || '');
    App.openModal('courseModal');
  },

  /* ── 강좌 저장 */
  saveCourse() {
    const get = id => document.getElementById(id)?.value.trim() || '';
    const type    = get('modalCourseType');
    const title   = get('modalCourseTitle');
    const from    = get('modalCourseFrom');
    const to      = get('modalCourseTo');
    const hours   = get('modalCourseHours');
    const status  = get('modalCourseStatus');

    if (!type)   { App.toast('구분을 선택해주세요.', 'warning');      return; }
    if (!title)  { App.toast('강좌명을 입력해주세요.', 'warning');    return; }
    if (!from)   { App.toast('교육 시작일을 선택해주세요.', 'warning'); return; }
    if (!to)     { App.toast('교육 종료일을 선택해주세요.', 'warning'); return; }
    if (!hours)  { App.toast('총 교육시간을 입력해주세요.', 'warning'); return; }

    const payload = {
      type,   title,  from,  to,
      date:   from,
      status: status || 'ready',
      hours:  parseInt(hours),
      applyFrom:  get('modalApplyFrom'),
      applyTo:    get('modalApplyTo'),
      capacity:   parseInt(get('modalCourseCapacity')) || 20,
      fee:        get('modalCourseFee'),
      location:   get('modalCourseLocation'),
      guide:      get('modalCourseGuide'),
    };

    if (this._editId) {
      const idx = this._courses.findIndex(c => c.id === this._editId);
      if (idx > -1) this._courses[idx] = { ...this._courses[idx], ...payload };
      App.toast('강좌가 수정되었습니다.');
    } else {
      payload.id = Date.now();
      this._courses.unshift(payload);
      App.toast('강좌가 개설되었습니다.');
    }

    this._filtered = [...this._courses];
    this._page     = 1;
    this.render();
    App.closeModal('courseModal');
  },

  /* ── 강좌 삭제 */
  deleteCourse(id) {
    if (!confirm('해당 강좌를 삭제하시겠습니까?\n신청자 데이터도 함께 삭제됩니다.')) return;
    this._courses    = this._courses.filter(c => c.id !== id);
    this._applies    = this._applies.filter(a => a.courseId !== id);
    this._filtered   = this._courses.filter(c =>
      this._filtered.some(f => f.id === c.id)
    );
    this._filtered   = [...this._courses];
    this.render();
    App.toast('강좌가 삭제되었습니다.', 'error');
  },

  exportExcel() {
    App.toast('강좌 목록 엑셀 다운로드를 시작합니다.');
  },

  /* ════════════════════════════════
     신청자 관리
  ════════════════════════════════ */
  searchApply() {
    const courseId = document.getElementById('applyCourseFilter')?.value || '';
    const status   = document.getElementById('applyStatusFilter')?.value || '';
    const keyword  = document.getElementById('applyKeyword')?.value.trim().toLowerCase() || '';

    this._applyFiltered = this._applies.filter(a => {
      if (courseId && String(a.courseId) !== courseId)                              return false;
      if (status   && a.status !== status)                                          return false;
      if (keyword  && !a.name.toLowerCase().includes(keyword)
                   && !a.email.toLowerCase().includes(keyword))                    return false;
      return true;
    });
    this._applyPage = 1;
    this.renderApply();
  },

  renderApply() {
    const total = this._applyFiltered.length;
    const slice = this._applyFiltered.slice(
      (this._applyPage - 1) * this._pageSize,
      this._applyPage * this._pageSize
    );

    const countEl = document.getElementById('applyCount');
    if (countEl) countEl.textContent = total.toLocaleString();

    const tbody = document.getElementById('applyTableBody');
    if (!tbody) return;

    const APPLY_STATUS = {
      pending:  { label: '검토중', color: '#f9a825', bg: '#fff8e1' },
      approved: { label: '승인',   color: '#2d6a4f', bg: '#d8f3dc' },
      rejected: { label: '반려',   color: '#e74c3c', bg: '#fce4ec' },
      cancel:   { label: '취소',   color: '#636e72', bg: '#f4f6f4' },
    };

    if (!slice.length) {
      tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;padding:32px;color:var(--gray-mid)">검색 결과가 없습니다.</td></tr>`;
      return;
    }

    tbody.innerHTML = slice.map((a, i) => {
      const s   = APPLY_STATUS[a.status] || APPLY_STATUS.pending;
      const seq = total - (this._applyPage - 1) * this._pageSize - i;
      return `<tr>
        <td class="center"><input type="checkbox" class="apply-check" data-id="${a.id}"></td>
        <td class="center">${seq}</td>
        <td style="font-size:13px;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${a.courseTitle}</td>
        <td class="center" style="font-weight:600">${a.name}</td>
        <td class="center" style="font-size:13px">${a.phone}</td>
        <td class="center" style="font-size:13px">${a.email}</td>
        <td class="center" style="font-size:13px">${a.applyDate}</td>
        <td class="center">
          <span style="padding:3px 10px;border-radius:20px;font-size:12px;font-weight:700;
                       color:${s.color};background:${s.bg}">${s.label}</span>
        </td>
        <td class="center">
          <div style="display:flex;gap:4px;justify-content:center">
            <button class="btn btn-outline btn-xs" onclick="CourseAdmin.openApplyDetail('${a.id}')">상세</button>
            ${a.status === 'pending'
              ? `<button class="btn btn-primary btn-xs" onclick="CourseAdmin.approveOne('${a.id}')">승인</button>`
              : ''}
          </div>
        </td>
      </tr>`;
    }).join('');

    App.renderPagination('applyPagination', this._applyPage, Math.ceil(total / this._pageSize) || 1, p => {
      this._applyPage = p;
      this.renderApply();
    });
  },

  openApplyDetail(id) {
    const a = this._applies.find(x => x.id === id);
    if (!a) return;
    this._currentApplyId = id;
    document.getElementById('applyDetailBody').innerHTML = `
      <div style="display:flex;flex-direction:column;gap:12px;font-size:14px">
        <div style="background:var(--green-pale);border-radius:var(--radius);padding:14px">
          <div style="font-weight:700;color:var(--green-dark);margin-bottom:4px">${a.courseTitle}</div>
          <div style="font-size:12px;color:var(--gray-mid)">신청일: ${a.applyDate}</div>
        </div>
        ${[
          ['이름',   a.name],
          ['연락처', a.phone],
          ['이메일', a.email],
          ['지역',   a.region || '-'],
          ['특이사항', a.note || '-'],
        ].map(([k, v]) => `
          <div style="display:flex;gap:16px;border-bottom:1px solid var(--gray-light);padding-bottom:10px">
            <span style="width:70px;font-weight:700;color:var(--gray-mid);flex-shrink:0">${k}</span>
            <span>${v}</span>
          </div>`).join('')}
      </div>`;
    App.openModal('applyDetailModal');
  },

  approveOne(id) {
    const a = this._applies.find(x => x.id === id);
    if (a) { a.status = 'approved'; this.renderApply(); App.toast(`${a.name} 님 신청을 승인했습니다.`); }
  },

  approveApply() {
    if (!this._currentApplyId) return;
    this.approveOne(this._currentApplyId);
    App.closeModal('applyDetailModal');
  },

  rejectApply() {
    const a = this._applies.find(x => x.id === this._currentApplyId);
    if (a) {
      a.status = 'rejected';
      this.renderApply();
      App.closeModal('applyDetailModal');
      App.toast(`${a.name} 님 신청을 반려했습니다.`, 'error');
    }
  },

  bulkApprove() {
    const ids = [...document.querySelectorAll('.apply-check:checked')].map(c => c.dataset.id);
    if (!ids.length) { App.toast('신청자를 선택해주세요.', 'warning'); return; }
    ids.forEach(id => { const a = this._applies.find(x => x.id === id); if (a) a.status = 'approved'; });
    this.renderApply();
    App.toast(`${ids.length}건 승인 처리되었습니다.`);
  },

  bulkReject() {
    const ids = [...document.querySelectorAll('.apply-check:checked')].map(c => c.dataset.id);
    if (!ids.length) { App.toast('신청자를 선택해주세요.', 'warning'); return; }
    ids.forEach(id => { const a = this._applies.find(x => x.id === id); if (a) a.status = 'rejected'; });
    this.renderApply();
    App.toast(`${ids.length}건 반려 처리되었습니다.`, 'error');
  },

  toggleAllCheck(master) {
    document.querySelectorAll('.apply-check').forEach(c => c.checked = master.checked);
  },

  exportApplyExcel() {
    App.toast('신청자 명단 엑셀 다운로드를 시작합니다.');
  },

  /* ════════════════════════════════
     수료 처리
  ════════════════════════════════ */
  loadCompleteList() {
    const courseId = document.getElementById('completeCourseFilter')?.value;
    if (!courseId) { App.toast('강좌를 선택해주세요.', 'warning'); return; }

    const approved = this._applies.filter(a =>
      String(a.courseId) === courseId && a.status === 'approved'
    );

    const tbody = document.getElementById('completeTableBody');
    if (!tbody) return;

    if (!approved.length) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:32px;color:var(--gray-mid)">승인된 수강생이 없습니다.</td></tr>`;
      return;
    }

    tbody.innerHTML = approved.map((a, i) => {
      const attend = Math.floor(Math.random() * 30 + 70);
      const isDone = a.completed || false;
      return `<tr>
        <td class="center"><input type="checkbox" class="complete-check" data-id="${a.id}"></td>
        <td class="center">${i + 1}</td>
        <td class="center" style="font-weight:600">${a.name}</td>
        <td class="center" style="font-size:13px">${a.phone}</td>
        <td class="center">
          <div style="display:flex;align-items:center;gap:8px">
            <div style="flex:1;height:6px;background:var(--gray-light);border-radius:3px">
              <div style="width:${attend}%;height:100%;background:${attend>=80?'var(--green-main)':'var(--accent)'};border-radius:3px"></div>
            </div>
            <span style="font-size:13px;min-width:36px">${attend}%</span>
          </div>
        </td>
        <td class="center">
          <span class="badge ${isDone ? 'badge-green' : 'badge-gray'}">${isDone ? '수료' : '미처리'}</span>
        </td>
        <td class="center">
          <button class="btn btn-outline btn-xs" onclick="CourseAdmin.toggleComplete('${a.id}', this)">
            ${isDone ? '수료 취소' : '수료 처리'}
          </button>
        </td>
      </tr>`;
    }).join('');
  },

  toggleComplete(id, btn) {
    const a = this._applies.find(x => x.id === id);
    if (!a) return;
    a.completed = !a.completed;
    const badge = btn.closest('tr').querySelector('.badge');
    if (badge) {
      badge.className = `badge ${a.completed ? 'badge-green' : 'badge-gray'}`;
      badge.textContent = a.completed ? '수료' : '미처리';
    }
    btn.textContent = a.completed ? '수료 취소' : '수료 처리';
    App.toast(a.completed ? `${a.name} 님 수료 처리되었습니다.` : `${a.name} 님 수료가 취소되었습니다.`);
  },

  bulkComplete() {
    const ids = [...document.querySelectorAll('.complete-check:checked')].map(c => c.dataset.id);
    if (!ids.length) { App.toast('수강생을 선택해주세요.', 'warning'); return; }
    ids.forEach(id => { const a = this._applies.find(x => x.id === id); if (a) a.completed = true; });
    this.loadCompleteList();
    App.toast(`${ids.length}명 수료 처리되었습니다.`);
  },

  toggleCompleteCheck(master) {
    document.querySelectorAll('.complete-check').forEach(c => c.checked = master.checked);
  },

  exportCompleteExcel() {
    App.toast('수료자 명단 엑셀 다운로드를 시작합니다.');
  },

  _renderCompleteEmpty() {
    const tbody = document.getElementById('completeTableBody');
    if (tbody && tbody.innerHTML.trim() === '')
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:32px;color:var(--gray-mid)">강좌를 선택하여 조회하세요.</td></tr>`;
  },
};
