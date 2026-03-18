/* =============================================
   admin-content.js | 콘텐츠관리 페이지 로직
   ============================================= */
'use strict';

const ContentAdmin = {
  _notices: [
    { id:10, title:'55기 전문가과정 모집 안내',     author:'관리자', date:'2026-03-08', views:248, pinned:true,  content:'55기 전문가과정 모집을 시작합니다...' },
    { id:9,  title:'[긴급] 3월 이사회 일정 변경',   author:'관리자', date:'2026-03-05', views:132, pinned:true,  content:'3월 이사회 일정이 변경되었습니다...' },
    { id:8,  title:'2026년 협회비 납부 안내',        author:'관리자', date:'2026-03-01', views:310, pinned:false, content:'2026년 협회비 납부를 안내드립니다...' },
    { id:7,  title:'홈페이지 개편 작업 예고',        author:'관리자', date:'2026-02-15', views:187, pinned:false, content:'홈페이지 개편 작업 예정입니다...' },
    { id:6,  title:'2025년 우수회원 표창 결과',      author:'관리자', date:'2026-02-10', views:224, pinned:false, content:'우수회원 표창 결과를 안내드립니다...' },
  ],
  _filtered: [],
  _page: 1,
  _pageSize: 10,
  _editId: null,

  init() {
    this._filtered = [...this._notices];
    this.render();
  },

  switchTab(tab, btn) {
    ['notice','popup','banner'].forEach(t => {
      const el = document.getElementById(`tab-${t}`);
      if (el) el.style.display = t === tab ? 'block' : 'none';
    });
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
  },

  render() {
    const total = this._filtered.length;
    const slice = this._filtered.slice(
      (this._page - 1) * this._pageSize,
      this._page * this._pageSize
    );

    const countEl = document.getElementById('noticeCount');
    if (countEl) countEl.textContent = total.toLocaleString();

    const tbody = document.getElementById('noticeTableBody');
    if (!tbody) return;

    tbody.innerHTML = slice.map((n, i) => {
      const seq = total - (this._page - 1) * this._pageSize - i;
      return `<tr>
        <td class="center">${seq}</td>
        <td class="center">${n.pinned ? '<span class="badge badge-green" style="font-size:11px">고정</span>' : '-'}</td>
        <td style="font-weight:500;cursor:pointer" onclick="ContentAdmin.openEditNotice(${n.id})">${n.title}</td>
        <td class="center" style="font-size:13px">${n.author}</td>
        <td class="center" style="font-size:13px">${n.date}</td>
        <td class="center" style="font-size:13px">${n.views.toLocaleString()}</td>
        <td class="center">
          <div style="display:flex;gap:4px;justify-content:center">
            <button class="btn btn-outline btn-xs" onclick="ContentAdmin.openEditNotice(${n.id})">수정</button>
            <button class="btn btn-danger btn-xs" onclick="ContentAdmin.deleteNotice(${n.id})">삭제</button>
          </div>
        </td>
      </tr>`;
    }).join('');

    App.renderPagination('noticePagination', this._page, Math.ceil(total / this._pageSize) || 1, p => {
      this._page = p;
      this.render();
    });
  },

  /* ── 첨부파일 UI 초기화 (모달 열 때마다 호출) */
  _resetFileList() {
    const list = document.getElementById('noticeFileList');
    if (!list) return;
    list.innerHTML = '';
    this.addFileInput(); /* 기본 1개 표시 */
    this._syncAddFileBtn();
  },

  addFileInput() {
    const MAX = 5;
    const list = document.getElementById('noticeFileList');
    if (!list) return;
    if (list.children.length >= MAX) return;

    const idx = list.children.length + 1;
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'display:flex;align-items:center;gap:8px;margin-bottom:6px';
    wrapper.innerHTML = `
      <input type="file" class="form-control notice-file-input"
        accept=".pdf,.hwp,.docx" style="flex:1">
      <button type="button" class="btn btn-gray btn-xs" style="flex-shrink:0;padding:6px 10px"
        onclick="ContentAdmin.removeFileInput(this)">✕</button>`;
    list.appendChild(wrapper);
    this._syncAddFileBtn();
  },

  removeFileInput(btn) {
    const wrapper = btn.closest('div');
    const list    = document.getElementById('noticeFileList');
    /* 마지막 1개는 삭제 안 함 */
    if (list && list.children.length <= 1) {
      const input = wrapper.querySelector('input[type=file]');
      if (input) input.value = '';
      App.toast('파일 입력란은 최소 1개 필요합니다.', 'info');
      return;
    }
    if (wrapper) wrapper.remove();
    this._syncAddFileBtn();
  },

  _syncAddFileBtn() {
    const MAX  = 5;
    const list = document.getElementById('noticeFileList');
    const btn  = document.getElementById('addFileBtn');
    if (!list || !btn) return;
    const count = list.children.length;
    btn.disabled = count >= MAX;
    btn.style.opacity = count >= MAX ? '0.4' : '1';
    btn.style.cursor  = count >= MAX ? 'not-allowed' : '';
  },

  openNoticeModal() {
    this._editId = null;
    document.getElementById('noticeModalTitle').textContent = '공지 등록';
    ['noticeTitle','noticeContent'].forEach(id => {
      const el = document.getElementById(id); if (el) el.value = '';
    });
    const r = document.querySelector('input[name="noticePinned"][value="0"]');
    if (r) r.checked = true;
    this._resetFileList();
    App.openModal('noticeModal');
  },

  openEditNotice(id) {
    const n = this._notices.find(x => x.id === id);
    if (!n) return;
    this._editId = id;
    document.getElementById('noticeModalTitle').textContent = '공지 수정';
    const t = document.getElementById('noticeTitle');    if (t) t.value = n.title;
    const c = document.getElementById('noticeContent');  if (c) c.value = n.content;
    const r = document.querySelector(`input[name="noticePinned"][value="${n.pinned ? '1' : '0'}"]`);
    if (r) r.checked = true;
    this._resetFileList();
    App.openModal('noticeModal');
  },

  saveNotice() {
    const title   = document.getElementById('noticeTitle')?.value.trim()   || '';
    const content = document.getElementById('noticeContent')?.value.trim() || '';
    const pinned  = document.querySelector('input[name="noticePinned"]:checked')?.value === '1';

    if (!title)   { App.toast('제목을 입력해주세요.', 'warning');   return; }
    if (!content) { App.toast('내용을 입력해주세요.', 'warning'); return; }

    if (this._editId) {
      const idx = this._notices.findIndex(n => n.id === this._editId);
      if (idx > -1) {
        this._notices[idx] = { ...this._notices[idx], title, content, pinned };
      }
      App.toast('공지가 수정되었습니다.');
    } else {
      this._notices.unshift({
        id:      Date.now(),
        title,   content, pinned,
        author:  '관리자',
        date:    new Date().toISOString().slice(0,10),
        views:   0,
      });
      App.toast('공지가 등록되었습니다.');
    }
    this._filtered = [...this._notices];
    this.render();
    App.closeModal('noticeModal');
  },

  deleteNotice(id) {
    if (!confirm('공지를 삭제하시겠습니까?')) return;
    this._notices  = this._notices.filter(n => n.id !== id);
    this._filtered = this._filtered.filter(n => n.id !== id);
    this.render();
    App.toast('공지가 삭제되었습니다.', 'error');
  },

  savePopup() {
    const title = document.getElementById('popupTitle')?.value.trim() || '';
    if (!title) { App.toast('팝업 제목을 입력해주세요.', 'warning'); return; }
    App.toast('팝업 공지 설정이 저장되었습니다.');
  },

  saveBanner() {
    const title = document.getElementById('heroTitle')?.value.trim() || '';
    if (!title) { App.toast('히어로 제목을 입력해주세요.', 'warning'); return; }
    App.toast('히어로 배너 설정이 저장되었습니다.');
  },
};
