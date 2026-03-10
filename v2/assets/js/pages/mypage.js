/* =============================================
   mypage.js | 마이페이지 공통 로직
   ============================================= */
'use strict';

const MyPage = {

  ALL_EDU: [
    { id:1,  title:'숲해설가 전문과정 1기',       type:'전문과정',   date:'2024-03-01', hours:40, status:'done',     cert:true  },
    { id:2,  title:'식물생태 심화 특강',           type:'시민아카데미',date:'2024-05-10', hours:8,  status:'done',     cert:true  },
    { id:3,  title:'숲치유 전문가 과정',           type:'직무교육',   date:'2024-07-20', hours:16, status:'done',     cert:true  },
    { id:4,  title:'생태 해설 기법 워크숍',        type:'역량강화',   date:'2024-09-05', hours:8,  status:'done',     cert:false },
    { id:5,  title:'산림교육 전문가 특강',         type:'전문과정',   date:'2024-11-01', hours:24, status:'done',     cert:true  },
    { id:6,  title:'조류 생태 관찰 실습',          type:'시민아카데미',date:'2025-01-15', hours:6,  status:'done',     cert:false },
    { id:7,  title:'2025 숲해설 직무역량 강화',    type:'직무교육',   date:'2025-03-10', hours:16, status:'progress', cert:false },
    { id:8,  title:'곤충 생태계 해설 워크숍',      type:'역량강화',   date:'2025-04-01', hours:8,  status:'applied',  cert:false },
    { id:9,  title:'숲 환경 교육 지도사 과정',     type:'전문과정',   date:'2025-05-15', hours:32, status:'applied',  cert:false },
    { id:10, title:'맹그로브 해설 기법 특강',      type:'시민아카데미',date:'2024-02-20', hours:4,  status:'cancel',   cert:false },
    { id:11, title:'산림치유지도사 전문과정',      type:'전문과정',   date:'2023-09-01', hours:40, status:'done',     cert:true  },
    { id:12, title:'식용식물 해설 실습',           type:'역량강화',   date:'2023-06-15', hours:8,  status:'done',     cert:false },
  ],

  EDU_STATUS: {
    done:     { label:'이수완료', cls:'edu-badge done'     },
    progress: { label:'수강중',   cls:'edu-badge progress' },
    applied:  { label:'신청완료', cls:'edu-badge applied'  },
    cancel:   { label:'취소',     cls:'edu-badge cancel'   },
  },

  eduFilter:   'all',
  eduPage:     1,
  EDU_PAGE_SZ: 8,

  init() {
    this.showPanel('info');
  },

  showPanel(name) {
    document.querySelectorAll('.my-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.side-nav a').forEach(a => a.classList.remove('active'));
    document.getElementById('panel-' + name)?.classList.add('active');
    document.getElementById('nav-' + name)?.classList.add('active');
    if (name === 'cert') this.renderEdu();
  },

  changePw() {
    const cur = document.getElementById('pwCurrent')?.value.trim();
    const nw  = document.getElementById('pwNew')?.value.trim();
    const cf  = document.getElementById('pwConfirm')?.value.trim();
    const msg = document.getElementById('pwMsg');
    if (!cur || !nw || !cf) { if (msg) { msg.style.color='var(--danger)'; msg.textContent='모든 비밀번호 항목을 입력해주세요.'; } return; }
    if (nw !== cf) { if (msg) { msg.style.color='#e74c3c'; msg.textContent='새 비밀번호가 일치하지 않습니다.'; } return; }
    if (nw.length < 8) { if (msg) { msg.style.color='#e74c3c'; msg.textContent='비밀번호는 8자 이상이어야 합니다.'; } return; }
    if (msg) { msg.style.color='var(--green-dark)'; msg.textContent='비밀번호가 변경되었습니다.'; }
    ['pwCurrent','pwNew','pwConfirm'].forEach(id => { const el=document.getElementById(id); if(el) el.value=''; });
  },

  openWithdraw() { App.openModal('withdrawModal'); },

  doWithdraw() {
    if (!document.getElementById('withdrawAgree')?.checked) {
      App.toast('탈퇴 동의 체크박스를 선택해주세요.', 'warning'); return;
    }
    App.toast('탈퇴 처리가 완료되었습니다.');
    App.closeModal('withdrawModal');
  },

  filterEdu(type, btn) {
    this.eduFilter = type;
    this.eduPage   = 1;
    document.querySelectorAll('.edu-tab').forEach(t => t.classList.remove('active'));
    if (btn) btn.classList.add('active');
    this.renderEduTable();
  },

  renderEdu() {
    document.getElementById('statTotal')?.setAttribute('textContent',    this.ALL_EDU.length);
    document.getElementById('statTotal').textContent    = this.ALL_EDU.length;
    document.getElementById('statDone').textContent     = this.ALL_EDU.filter(e => e.status==='done').length;
    document.getElementById('statProgress').textContent = this.ALL_EDU.filter(e => e.status==='progress').length;
    document.getElementById('statApplied').textContent  = this.ALL_EDU.filter(e => e.status==='applied').length;
    this.renderEduTable();
  },

  renderEduTable() {
    const filtered = this.eduFilter === 'all'
      ? this.ALL_EDU
      : this.ALL_EDU.filter(e => e.status === this.eduFilter);
    const total = filtered.length;
    const slice = filtered.slice((this.eduPage-1)*this.EDU_PAGE_SZ, this.eduPage*this.EDU_PAGE_SZ);

    const tbody = document.getElementById('eduTableBody');
    if (!tbody) return;

    if (!slice.length) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:32px;color:var(--gray-mid)">해당 내역이 없습니다.</td></tr>`;
    } else {
      tbody.innerHTML = slice.map((e, i) => {
        const s = this.EDU_STATUS[e.status] || { label: e.status, cls: '' };
        return `<tr>
          <td class="center">${(this.eduPage-1)*this.EDU_PAGE_SZ + i + 1}</td>
          <td>${e.title}</td>
          <td class="center">${e.type}</td>
          <td class="center">${e.date}</td>
          <td class="center">${e.hours}시간</td>
          <td class="center"><span class="${s.cls}">${s.label}</span></td>
          <td class="center">${e.cert
            ? `<button class="btn btn-outline btn-xs" onclick="MyPage.openCertModal(${e.id})">PDF</button>`
            : '-'}</td>
        </tr>`;
      }).join('');
    }

    App.renderPagination('eduPagination', this.eduPage, Math.ceil(total/this.EDU_PAGE_SZ)||1, p => {
      this.eduPage = p;
      this.renderEduTable();
    });
  },

  openCertModal(id) {
    const e = this.ALL_EDU.find(x => x.id === id);
    if (!e) return;
    const [y, m, d] = e.date.split('-');
    const dateStr   = `${y}년 ${parseInt(m)}월 ${parseInt(d)}일`;
    document.getElementById('certPreviewArea').innerHTML = `
      <div style="border:3px solid var(--green-dark);border-radius:8px;padding:28px 32px;text-align:center;background:linear-gradient(180deg,#f9fbf9,#fff);">
        <div style="font-size:36px;margin-bottom:12px;">🏆</div>
        <div style="font-size:28px;font-weight:900;letter-spacing:16px;color:#1a1a1a;margin-bottom:6px;">수 료 증</div>
        <div style="height:1px;background:linear-gradient(to right,transparent,#d4af37,transparent);margin:16px 0;"></div>
        <table style="width:88%;font-size:13px;border-collapse:collapse;margin:0 auto 20px;color:#2d2d2d;">
          <tr style="border-bottom:1px solid #e8d48b;"><td style="padding:9px 0;width:90px;color:#7a6a2a;font-weight:700;">성&emsp;&emsp;명</td><td style="font-weight:700;font-size:15px;letter-spacing:2px;">${App.user.name}</td></tr>
          <tr style="border-bottom:1px solid #e8d48b;"><td style="padding:9px 0;color:#7a6a2a;font-weight:700;">교육과정</td><td>${e.title}</td></tr>
          <tr style="border-bottom:1px solid #e8d48b;"><td style="padding:9px 0;color:#7a6a2a;font-weight:700;">교육기간</td><td>${e.date} (총 ${e.hours}시간)</td></tr>
          <tr><td style="padding:9px 0;color:#7a6a2a;font-weight:700;">구&emsp;&emsp;분</td><td>${e.type}</td></tr>
        </table>
        <p style="font-size:14px;line-height:2;color:#1a1a1a;margin-bottom:16px;">위 사람은 <strong>(사)한국숲해설가협회</strong>에서 실시하는<br><strong>${e.title}</strong> 과정을 성실히 수료하였으므로 이 증서를 드립니다.</p>
        <p style="font-size:14px;letter-spacing:2px;margin-bottom:16px;">${dateStr}</p>
        <p style="font-size:16px;font-weight:900;color:var(--green-dark);">(사)한국숲해설가협회</p>
        <p style="font-size:13px;color:var(--gray-mid);">상임대표 ○○○</p>
      </div>`;
    App.openModal('certModal');
  },
};
