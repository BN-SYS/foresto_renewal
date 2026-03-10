/* =============================================
   education.js | 강좌 목록 / 신청 모달 공통
   ============================================= */
'use strict';

/* ── 강좌 데이터 */
const ALL_COURSES_RAW = [
  ...Array.from({ length: 12 }, (_, i) => ({
    id: 1000 + i, type: '전문과정',
    title: `[전문과정] ${55 - i}기 숲해설가 전문가과정`,
    date:  `2026-0${(i % 9) + 1}-${String((i % 20) + 1).padStart(2, '0')}`,
    from:  `2026-0${(i % 9) + 1}-${String((i % 20) + 1).padStart(2, '0')}`,
    to:    `2026-0${(i % 9) + 1}-${String((i % 20) + 5).padStart(2, '0')}`,
    status: ['open','open','ready','closed','done'][i % 5],
    guide: `• 강좌: [전문과정] ${55 - i}기 숲해설가 전문가과정\n• 수료 시 수료증 발급\n• 문의: 협회 사무국 02-000-0000`,
  })),
  ...Array.from({ length: 10 }, (_, i) => ({
    id: 2000 + i, type: '시민아카데미',
    title: `[시민아카데미] ${['겨울나무의 이해','봄꽃 산책','여름 숲 탐방','가을 단풍 해설','야생화 특강','버섯 생태','새소리 탐조','나무 이름표 달기','숲 치유 체험','곤충 관찰'][i]}`,
    date: `2026-0${(i%9)+1}-${String((i%20)+1).padStart(2,'0')}`,
    from: `2026-0${(i%9)+1}-${String((i%20)+1).padStart(2,'0')}`,
    to:   `2026-0${(i%9)+1}-${String((i%20)+5).padStart(2,'0')}`,
    status: ['open','ready','closed','cancel','done'][i % 5],
    guide: `• 강좌: 시민아카데미\n• 대상: 일반 시민 누구나\n• 문의: 협회 사무국 02-000-0000`,
  })),
  ...Array.from({ length: 8 }, (_, i) => ({
    id: 3000 + i, type: '직무교육',
    title: `[직무교육] ${['직무 기본과정','현장 안전 교육','해설 역량 향상','디지털 자료 제작','생태 모니터링','환경 법령 이해','고객 응대 실습','보고서 작성'][i]}`,
    date: `2026-0${(i%9)+1}-${String((i%20)+1).padStart(2,'0')}`,
    from: `2026-0${(i%9)+1}-${String((i%20)+1).padStart(2,'0')}`,
    to:   `2026-0${(i%9)+1}-${String((i%20)+5).padStart(2,'0')}`,
    status: ['open','ready','closed','done'][i % 4],
    guide: `• 강좌: 직무교육\n• 대상: 현직 숲해설가\n• 문의: 협회 사무국 02-000-0000`,
  })),
  ...Array.from({ length: 8 }, (_, i) => ({
    id: 4000 + i, type: '역량강화',
    title: `[역량강화] ${['리더십 워크숍','커뮤니케이션 역량','팀빌딩 프로그램','멘토링 과정','자기계발 세미나','전문가 특강','해외 사례 공유','네트워킹 데이'][i]}`,
    date: `2026-0${(i%9)+1}-${String((i%20)+1).padStart(2,'0')}`,
    from: `2026-0${(i%9)+1}-${String((i%20)+1).padStart(2,'0')}`,
    to:   `2026-0${(i%9)+1}-${String((i%20)+5).padStart(2,'0')}`,
    status: ['open','ready','closed','done'][i % 4],
    guide: `• 강좌: 역량강화\n• 대상: 회원 숲해설가\n• 문의: 협회 사무국 02-000-0000`,
  })),
];

const STATUS_META = {
  open:   { label: '접수중',   cls: 'status-open',   canApply: true  },
  ready:  { label: '접수예정', cls: 'status-ready',  canApply: false },
  closed: { label: '접수마감', cls: 'status-closed', canApply: false },
  cancel: { label: '신청취소', cls: 'status-cancel', canApply: false },
  done:   { label: '수강완료', cls: 'status-done',   canApply: false },
};

/* ── 강좌 목록 공통 컨트롤러 */
class CourseListController {
  constructor(pageType, containerId, paginationId) {
    this.pageType    = pageType;
    this.containerId = containerId;
    this.paginationId = paginationId;
    this.courses     = ALL_COURSES_RAW.filter(c => c.type === pageType);
    this.filtered    = [...this.courses];
    this.currentPage = 1;
    this.pageSize    = 10;
    this._injectModal();
  }

  filter(status, from, to) {
    this.filtered = this.courses.filter(c => {
      if (status && c.status !== status) return false;
      if (from   && c.date < from)       return false;
      if (to     && c.date > to)         return false;
      return true;
    });
    this.currentPage = 1;
    this.render();
  }

  changePageSize(size) {
    this.pageSize    = size;
    this.currentPage = 1;
    this.render();
  }

  render() {
    const total = this.filtered.length;
    const slice = this.filtered.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
    const tc    = document.getElementById('totalCount');
    if (tc) tc.textContent = total.toLocaleString();

    const tbody = document.getElementById(this.containerId);
    if (!tbody) return;
    tbody.innerHTML = slice.map(c => {
      const sm    = STATUS_META[c.status];
      const badge = sm.canApply
        ? `<button class="status-badge ${sm.cls}" onclick="window._ctrl.openApply(${c.id})">${sm.label}</button>`
        : `<span class="status-badge ${sm.cls}">${sm.label}</span>`;
      return `<tr>
        <td class="center">${c.id}</td>
        <td class="td-title">${sm.canApply
          ? `<a href="#" onclick="window._ctrl.openApply(${c.id});return false">${c.title}</a>`
          : `<span>${c.title}</span>`}</td>
        <td class="center">${c.date}</td>
        <td class="center" style="font-size:13px;color:var(--gray-mid)">${c.from} ~ ${c.to}</td>
        <td class="center">${badge}</td>
      </tr>`;
    }).join('');

    App.renderPagination(this.paginationId, this.currentPage, Math.ceil(total / this.pageSize) || 1, p => {
      this.currentPage = p;
      this.render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  openApply(courseId) {
    this._currentCourse = this.courses.find(c => c.id === courseId);
    if (!this._currentCourse) return;
    document.getElementById('applyModalTitle').textContent = '강좌 신청';
    document.getElementById('guideTitle').textContent      = this._currentCourse.title;
    document.getElementById('guideContent').innerHTML      = this._currentCourse.guide.replace(/\n/g, '<br>');
    document.getElementById('agreeCheck').checked          = false;
    document.getElementById('summaryType').textContent     = this._currentCourse.type;
    document.getElementById('summaryTitle').textContent    = this._currentCourse.title;
    document.getElementById('summaryDate').textContent     = this._currentCourse.date;
    ['formName','formPhone','formEmail','formNote'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    const fr = document.getElementById('formRegion'); if (fr) fr.value = '';
    this._step = 1;
    this._updateStep();
    App.openModal('applyModal');
  }

  _updateStep() {
    [1,2,3].forEach(s => {
      const panel = document.getElementById(`applyStep${s}`);
      const step  = document.getElementById(`step${s}`);
      if (panel) panel.style.display = s === this._step ? 'block' : 'none';
      if (step)  step.className = 'step ' + (s < this._step ? 'done' : s === this._step ? 'active' : 'pending');
    });
    const prev = document.getElementById('applyPrevBtn');
    const next = document.getElementById('applyNextBtn');
    const done = document.getElementById('applyDoneBtn');
    if (prev) prev.style.display = this._step > 1 && this._step < 3 ? 'inline-flex' : 'none';
    if (next) { next.style.display = this._step < 3 ? 'inline-flex' : 'none'; next.textContent = this._step === 1 ? '동의하고 다음' : '신청 완료'; }
    if (done) done.style.display = this._step === 3 ? 'inline-flex' : 'none';
  }

  applyNext() {
    if (this._step === 1 && !document.getElementById('agreeCheck').checked) {
      App.toast('안내 사항 동의에 체크해주세요.', 'warning'); return;
    }
    if (this._step === 2) {
            const name  = document.getElementById('formName')?.value.trim();
      const phone = document.getElementById('formPhone')?.value.trim();
      const email = document.getElementById('formEmail')?.value.trim();
      if (!name)  { App.toast('이름을 입력해주세요.', 'warning');  return; }
      if (!phone) { App.toast('연락처를 입력해주세요.', 'warning'); return; }
      if (!email) { App.toast('이메일을 입력해주세요.', 'warning'); return; }
      const detail = document.getElementById('completeDetail');
      if (detail) detail.innerHTML = `<strong style="color:var(--green-dark)">${this._currentCourse.title}</strong><br>구분: ${this._currentCourse.type} &nbsp;|&nbsp; 일자: ${this._currentCourse.date}`;
    }
    this._step++;
    this._updateStep();
  }

  applyPrev() {
    this._step--;
    this._updateStep();
  }

  _injectModal() {
    if (document.getElementById('applyModal')) return;
    document.body.insertAdjacentHTML('beforeend', `
      <div class="modal-overlay" id="applyModal">
        <div class="modal" style="max-width:640px">
          <div class="modal-header">
            <h3 id="applyModalTitle">강좌 신청</h3>
            <button class="modal-close" onclick="App.closeModal('applyModal')">×</button>
          </div>
          <div class="modal-body">
            <div class="step-indicator">
              <div class="step active" id="step1"><div class="step-num">1</div><span>신청 안내</span></div>
              <div class="step-divider"></div>
              <div class="step pending" id="step2"><div class="step-num">2</div><span>신청 작성</span></div>
              <div class="step-divider"></div>
              <div class="step pending" id="step3"><div class="step-num">3</div><span>완료</span></div>
            </div>

            <div id="applyStep1">
              <div class="alert alert-warning">본 신청은 취소 시 담당자에게 별도 연락이 필요합니다.</div>
              <div style="background:var(--gray-bg);padding:16px;border-radius:var(--radius);font-size:14px;line-height:1.8;margin-bottom:16px;">
                <strong id="guideTitle" style="color:var(--green-dark);font-size:15px;display:block;margin-bottom:10px;"></strong>
                <div id="guideContent"></div>
              </div>
              <div style="background:#fff;border:1.5px solid var(--gray-light);border-radius:var(--radius);padding:14px;">
                <label style="display:flex;gap:10px;align-items:flex-start;cursor:pointer;font-size:14px;">
                  <input type="checkbox" id="agreeCheck" style="margin-top:3px;">
                  <span>안내 사항을 모두 확인하였으며, 신청에 동의합니다. <span style="color:var(--danger)">(필수)</span></span>
                </label>
              </div>
            </div>

            <div id="applyStep2" style="display:none;">
              <div style="background:var(--green-pale);border-radius:var(--radius);padding:14px 18px;margin-bottom:20px;font-size:14px;line-height:1.8;border-left:3px solid var(--green-main);">
                <div style="display:flex;gap:8px;"><span style="font-weight:700;color:var(--green-dark);min-width:60px;">구분</span><span id="summaryType"></span></div>
                <div style="display:flex;gap:8px;"><span style="font-weight:700;color:var(--green-dark);min-width:60px;">강좌명</span><span id="summaryTitle"></span></div>
                <div style="display:flex;gap:8px;"><span style="font-weight:700;color:var(--green-dark);min-width:60px;">일자</span><span id="summaryDate"></span></div>
              </div>
              <div class="form-group">
                <label class="form-label">이름 <span class="req">*</span></label>
                <input type="text" class="form-control" id="formName" placeholder="이름을 입력하세요">
              </div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                <div class="form-group">
                  <label class="form-label">연락처 <span class="req">*</span></label>
                  <input type="tel" class="form-control" id="formPhone" placeholder="010-0000-0000">
                </div>
                <div class="form-group">
                  <label class="form-label">이메일 <span class="req">*</span></label>
                  <input type="email" class="form-control" id="formEmail" placeholder="example@email.com">
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">거주 지역</label>
                <select class="form-control" id="formRegion">
                  <option value="">선택</option>
                  <option>서울</option><option>경기</option><option>인천</option>
                  <option>부산</option><option>대구</option><option>기타</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">신청 서류 첨부 <span class="req">*</span></label>
                <input type="file" class="form-control" id="formFile" accept=".pdf,.hwp,.docx,.jpg,.png">
                <div class="form-hint">파일 크기 최대 10MB / 허용 형식: PDF, HWP, DOCX, JPG, PNG</div>
              </div>
              <div class="form-group">
                <label class="form-label">특이 사항</label>
                <textarea class="form-control" id="formNote" rows="3" placeholder="문의사항이나 특이사항을 입력하세요."></textarea>
              </div>
            </div>

            <div id="applyStep3" style="display:none;text-align:center;padding:32px 0;">
              <div style="width:64px;height:64px;background:var(--green-pale);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;">
                <svg viewBox="0 0 24 24" fill="none" width="32" height="32">
                  <circle cx="12" cy="12" r="10" stroke="var(--green-main)" stroke-width="2"/>
                  <path d="M7 12.5l3.5 3.5 6.5-7" stroke="var(--green-main)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <h3 style="font-size:20px;font-weight:700;color:var(--green-dark);margin-bottom:10px;">신청이 완료되었습니다!</h3>
              <div id="completeDetail" style="font-size:14px;color:var(--gray-dark);line-height:1.8;margin-bottom:12px;"></div>
              <p style="font-size:13px;color:var(--gray-mid);line-height:1.8;">
                신청 내역은 마이페이지 → 교육이수내역에서 확인 가능합니다.<br>
                문의사항은 협회 사무국(02-000-0000)으로 연락 주세요.
              </p>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-gray" id="applyPrevBtn" style="display:none;" onclick="window._ctrl.applyPrev()">이전</button>
            <button class="btn btn-primary" id="applyNextBtn" onclick="window._ctrl.applyNext()">동의하고 다음</button>
            <button class="btn btn-primary" id="applyDoneBtn" style="display:none;"
                    onclick="App.closeModal('applyModal');App.toast('신청이 완료되었습니다!')">완료</button>
          </div>
        </div>
      </div>`);
  }
}
