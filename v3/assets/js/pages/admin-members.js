/* =============================================
   admin-members.js | 회원관리 페이지 로직
   ============================================= */
'use strict';

const MemberAdmin = {
  _members: [],
  _filtered: [],
  _page: 1,
  _pageSize: 10,
  _editId: null,

  init() {
    this._members  = this._generateSampleData();
    this._filtered = [...this._members];
    this._updateStats();
    this.render();
  },

  _generateSampleData() {
    const names   = ['김숲해설','이초록','박자연','최나무','정바람','윤하늘','강숲속','조생태','신나뭇잎','한자연',
                     '문청산','류이슬','백솔밭','안햇살','송나비','임물결','권하늘','오구름','황봄비','노꽃길'];
    const grades  = ['정회원','정회원','준회원','준회원','정회원','준회원','정회원','준회원','준회원','정회원'];
    const regions = ['서울','경기','인천','서울','부산','경기','서울','대구','인천','기타'];
    const statuses = ['active','active','active','active','dormant','active','active','suspended','active','active'];
    return names.map((n, i) => ({
      id:       1000 + i,
      name:     n,
      grade:    grades[i % grades.length],
      email:    `user${1000 + i}@example.com`,
      phone:    `010-${String(1000 + i).padStart(4,'0')}-${String(2000 + i).padStart(4,'0')}`,
      region:   regions[i % regions.length],
      joinDate: `2025-${String((i % 12) + 1).padStart(2,'0')}-${String((i % 28) + 1).padStart(2,'0')}`,
      status:   statuses[i % statuses.length],
      note:     '',
    }));
  },

  _updateStats() {
    const el = id => document.getElementById(id);
    if (el('statTotal'))   el('statTotal').textContent   = this._members.length;
    if (el('statFull'))    el('statFull').textContent    = this._members.filter(m => m.grade === '정회원').length;
    if (el('statAssoc'))   el('statAssoc').textContent   = this._members.filter(m => m.grade === '준회원').length;
    if (el('statDormant')) el('statDormant').textContent = this._members.filter(m => m.status === 'dormant').length;
  },

  search() {
    const grade   = document.getElementById('filterGrade')?.value         || '';
    const status  = document.getElementById('filterMemberStatus')?.value  || '';
    const keyword = document.getElementById('filterMemberKeyword')?.value.trim().toLowerCase() || '';
    this._filtered = this._members.filter(m => {
      if (grade  && m.grade  !== grade)  return false;
      if (status && m.status !== status) return false;
      if (keyword && !m.name.toLowerCase().includes(keyword)
                  && !m.email.toLowerCase().includes(keyword)
                  && !m.phone.includes(keyword)) return false;
      return true;
    });
    this._page = 1;
    this.render();
  },

  reset() {
    ['filterGrade','filterMemberStatus','filterMemberKeyword'].forEach(id => {
      const el = document.getElementById(id); if (el) el.value = '';
    });
    this._filtered = [...this._members];
    this._page = 1;
    this.render();
  },

  render() {
    const total = this._filtered.length;
    const slice = this._filtered.slice(
      (this._page - 1) * this._pageSize,
      this._page * this._pageSize
    );

    const countEl = document.getElementById('memberCount');
    if (countEl) countEl.textContent = total.toLocaleString();

    const STATUS_MAP = {
      active:    { label:'활성', cls:'badge-green' },
      dormant:   { label:'휴면', cls:'badge-gray'  },
      suspended: { label:'정지', cls:'badge-red'   },
    };

    const tbody = document.getElementById('memberTableBody');
    if (!tbody) return;

    if (!slice.length) {
      tbody.innerHTML = `<tr><td colspan="10" style="text-align:center;padding:32px;color:var(--gray-mid)">검색 결과가 없습니다.</td></tr>`;
      return;
    }

    tbody.innerHTML = slice.map((m, i) => {
      const s   = STATUS_MAP[m.status] || STATUS_MAP.active;
      const seq = total - (this._page - 1) * this._pageSize - i;
      return `<tr>
        <td class="center"><input type="checkbox" class="member-check" data-id="${m.id}"></td>
        <td class="center">${seq}</td>
        <td style="font-weight:600;cursor:pointer" onclick="MemberAdmin.openEdit(${m.id})">${m.name}</td>
        <td class="center"><span class="badge ${m.grade==='정회원'?'badge-green':'badge-gray'}" style="font-size:11px">${m.grade}</span></td>
        <td class="center" style="font-size:13px">${m.email}</td>
        <td class="center" style="font-size:13px">${m.phone}</td>
        <td class="center" style="font-size:13px">${m.region}</td>
        <td class="center" style="font-size:13px">${m.joinDate}</td>
        <td class="center"><span class="badge ${s.cls}" style="font-size:11px">${s.label}</span></td>
        <td class="center">
          <div style="display:flex;gap:4px;justify-content:center">
            <button class="btn btn-outline btn-xs" onclick="MemberAdmin.openEdit(${m.id})">수정</button>
            <button class="btn btn-danger btn-xs" onclick="MemberAdmin.deleteMember(${m.id})">삭제</button>
          </div>
        </td>
      </tr>`;
    }).join('');

    App.renderPagination('memberPagination', this._page, Math.ceil(total / this._pageSize) || 1, p => {
      this._page = p;
      this.render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  },

  openCreateModal() {
    this._editId = null;
    document.getElementById('memberModalTitle').textContent = '회원 등록';
    ['mName','mEmail','mPhone','mNote'].forEach(id => {
      const el = document.getElementById(id); if (el) el.value = '';
    });
    const g = document.getElementById('mGrade');   if (g) g.value = '준회원';
    const r = document.getElementById('mRegion');  if (r) r.value = '';
    const s = document.getElementById('mStatus');  if (s) s.value = 'active';
    App.openModal('memberModal');
  },

  openEdit(id) {
    const m = this._members.find(x => x.id === id);
    if (!m) return;
    this._editId = id;
    document.getElementById('memberModalTitle').textContent = '회원 정보 수정';
    const set = (elId, val) => { const el = document.getElementById(elId); if (el) el.value = val || ''; };
    set('mName',   m.name);
    set('mEmail',  m.email);
    set('mPhone',  m.phone);
    set('mGrade',  m.grade);
    set('mRegion', m.region);
    set('mStatus', m.status);
    set('mNote',   m.note);
    App.openModal('memberModal');
  },

  save() {
    const get = id => document.getElementById(id)?.value.trim() || '';
    const name  = get('mName');
    const email = get('mEmail');
    if (!name)  { App.toast('이름을 입력해주세요.', 'warning');   return; }
    if (!email) { App.toast('이메일을 입력해주세요.', 'warning'); return; }

    const payload = {
      name,  email,
      phone:  get('mPhone'),
      grade:  get('mGrade'),
      region: get('mRegion'),
      status: get('mStatus'),
      note:   get('mNote'),
    };

    if (this._editId) {
      const idx = this._members.findIndex(m => m.id === this._editId);
      if (idx > -1) this._members[idx] = { ...this._members[idx], ...payload };
      App.toast('회원 정보가 수정되었습니다.');
    } else {
      payload.id       = Date.now();
      payload.joinDate = new Date().toISOString().slice(0,10);
      this._members.unshift(payload);
      App.toast('회원이 등록되었습니다.');
    }

    this._filtered = [...this._members];
    this._updateStats();
    this.render();
    App.closeModal('memberModal');
  },

  deleteMember(id) {
    if (!confirm('회원을 삭제하시겠습니까?')) return;
    this._members  = this._members.filter(m => m.id !== id);
    this._filtered = this._filtered.filter(m => m.id !== id);
    this._updateStats();
    this.render();
    App.toast('회원이 삭제되었습니다.', 'error');
  },

  toggleAll(master) {
    document.querySelectorAll('.member-check').forEach(c => c.checked = master.checked);
  },

  bulkSuspend() {
    const ids = [...document.querySelectorAll('.member-check:checked')].map(c => +c.dataset.id);
    if (!ids.length) { App.toast('회원을 선택해주세요.', 'warning'); return; }
    ids.forEach(id => {
      const m = this._members.find(x => x.id === id);
      if (m) m.status = 'suspended';
    });
    this._filtered = [...this._members];
    this._updateStats();
    this.render();
    App.toast(`${ids.length}명 정지 처리되었습니다.`, 'error');
  },

  exportExcel() {
    App.toast('회원 명단 엑셀 다운로드를 시작합니다.');
  },
};
