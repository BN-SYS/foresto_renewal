/* ═══════════════════════════════════════════════
   courses-data.js
   - 공통 데이터 / 모달 HTML 자동 주입 / 공통 함수
   - 각 페이지에서 PAGE_TYPE 선언 후 이 파일 로드
═══════════════════════════════════════════════ */

/* ── 1. 공통 데이터 ── */
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
    date:  `2026-0${(i % 9) + 1}-${String((i % 20) + 1).padStart(2, '0')}`,
    from:  `2026-0${(i % 9) + 1}-${String((i % 20) + 1).padStart(2, '0')}`,
    to:    `2026-0${(i % 9) + 1}-${String((i % 20) + 5).padStart(2, '0')}`,
    status: ['open','ready','closed','cancel','done'][i % 5],
    guide: `• 강좌: 시민아카데미\n• 대상: 일반 시민 누구나\n• 문의: 협회 사무국 02-000-0000`,
  })),
  ...Array.from({ length: 8 }, (_, i) => ({
    id: 3000 + i, type: '직무교육',
    title: `[직무교육] ${['직무 기본과정','현장 안전 교육','해설 역량 향상','디지털 자료 제작','생태 모니터링','환경 법령 이해','고객 응대 실습','보고서 작성'][i]}`,
    date:  `2026-0${(i % 9) + 1}-${String((i % 20) + 1).padStart(2, '0')}`,
    from:  `2026-0${(i % 9) + 1}-${String((i % 20) + 1).padStart(2, '0')}`,
    to:    `2026-0${(i % 9) + 1}-${String((i % 20) + 5).padStart(2, '0')}`,
    status: ['open','ready','closed','done'][i % 4],
    guide: `• 강좌: 직무교육\n• 대상: 현직 숲해설가\n• 문의: 협회 사무국 02-000-0000`,
  })),
  ...Array.from({ length: 8 }, (_, i) => ({
    id: 4000 + i, type: '역량강화',
    title: `[역량강화] ${['리더십 워크숍','커뮤니케이션 역량','팀빌딩 프로그램','멘토링 과정','자기계발 세미나','전문가 특강','해외 사례 공유','네트워킹 데이'][i]}`,
    date:  `2026-0${(i % 9) + 1}-${String((i % 20) + 1).padStart(2, '0')}`,
    from:  `2026-0${(i % 9) + 1}-${String((i % 20) + 1).padStart(2, '0')}`,
    to:    `2026-0${(i % 9) + 1}-${String((i % 20) + 5).padStart(2, '0')}`,
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

/* ── 2. 모달 HTML 자동 주입 ── */
document.body.insertAdjacentHTML('beforeend', `
<div class="modal-overlay" id="applyModal">
  <div class="modal" style="max-width:640px">
    <div class="modal-header">
      <h3 id="applyModalTitle">강좌 신청</h3>
      <button class="modal-close" onclick="App.closeModal('applyModal')">×</button>
    </div>
    <div class="modal-body">
      <div class="step-indicator">
        <div class="step" id="step1"><div class="step-num">1</div><span>신청 안내</span></div>
        <div class="step-divider"></div>
        <div class="step" id="step2"><div class="step-num">2</div><span>신청 작성</span></div>
        <div class="step-divider"></div>
        <div class="step" id="step3"><div class="step-num">3</div><span>완료</span></div>
      </div>

      <div id="applyStep1">
        <div class="alert alert-warning" style="margin-bottom:16px;">
          본 신청은 취소 시 담당자에게 별도 연락이 필요합니다.
        </div>
        <div style="background:var(--gray-bg);padding:16px;border-radius:var(--radius);font-size:14px;line-height:1.8;margin-bottom:16px;">
          <strong id="guideTitle" style="color:var(--green-dark);font-size:15px;"></strong>
          <br><br>
          <div id="guideContent"></div>
        </div>
        <div style="background:#fff;border:1.5px solid var(--gray-light);border-radius:var(--radius);padding:14px;">
          <label style="display:flex;gap:10px;align-items:flex-start;cursor:pointer;font-size:14px;">
            <input type="checkbox" id="agreeCheck" style="margin-top:3px;">
            <span>안내 사항을 모두 확인하였으며, 신청에 동의합니다.
              <span style="color:var(--danger)">(필수)</span></span>
          </label>
        </div>
      </div>

      <div id="applyStep2" style="display:none;">
        <div class="modal-course-summary">
          <div class="summary-row">
            <span class="summary-label">구분</span>
            <span class="summary-value" id="summaryType">-</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">강좌명</span>
            <span class="summary-value" id="summaryTitle">-</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">일자</span>
            <span class="summary-value" id="summaryDate">-</span>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">이름 <span class="required">*</span></label>
          <input type="text" class="form-control" id="formName" placeholder="이름을 입력하세요">
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div class="form-group">
            <label class="form-label">연락처 <span class="required">*</span></label>
            <input type="tel" class="form-control" id="formPhone" placeholder="010-0000-0000">
          </div>
          <div class="form-group">
            <label class="form-label">이메일 <span class="required">*</span></label>
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
          <label class="form-label">신청 서류 첨부 <span class="required">*</span></label>
          <input type="file" class="form-control" id="formFile" accept=".pdf,.hwp,.docx,.jpg,.png">
          <div class="form-hint">파일 크기 최대 10MB / 허용 형식: PDF, HWP, DOCX, JPG, PNG</div>
        </div>
        <div class="form-group">
          <label class="form-label">특이 사항</label>
          <textarea class="form-control" id="formNote" rows="3"
            placeholder="문의사항이나 특이사항을 입력하세요."></textarea>
        </div>
      </div>

      <div id="applyStep3" style="display:none;text-align:center;padding:32px 0;">
        <div style="width:64px;height:64px;background:var(--green-pale);border-radius:50%;
                    display:flex;align-items:center;justify-content:center;margin:0 auto 20px;">
          <svg viewBox="0 0 24 24" fill="none" width="32" height="32">
            <circle cx="12" cy="12" r="10" stroke="var(--green-main)" stroke-width="2"/>
            <path d="M7 12.5l3.5 3.5 6.5-7" stroke="var(--green-main)" stroke-width="2.5"
                  stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h3 style="font-size:20px;font-weight:700;color:var(--green-dark);margin-bottom:10px;">
          신청이 완료되었습니다!</h3>
        <div id="completeDetail"
             style="font-size:14px;color:var(--gray-dark);line-height:1.8;margin-bottom:12px;"></div>
        <p style="font-size:13px;color:var(--gray-mid);line-height:1.8;">
          신청 내역은 마이페이지 → 교육이수내역에서 확인 가능합니다.<br>
          문의사항은 협회 사무국(02-000-0000)으로 연락 주세요.
        </p>
      </div>
    </div>

    <div class="modal-footer">
      <button class="btn btn-gray" id="applyPrevBtn" style="display:none;"
              onclick="applyPrev()">이전</button>
      <button class="btn btn-primary" id="applyNextBtn"
              onclick="applyNext()">동의하고 다음</button>
      <button class="btn btn-primary" id="applyDoneBtn" style="display:none;"
              onclick="App.closeModal('applyModal');App.toast('신청이 완료되었습니다!')">완료</button>
    </div>
  </div>
</div>
`);

/* ── 3. 공통 상태 변수 ── */
const PAGE_COURSES = ALL_COURSES_RAW.filter(c => c.type === PAGE_TYPE);
let filtered      = [...PAGE_COURSES];
let currentPage   = 1;
let pageSize      = 10;
let applyStep     = 1;
let currentCourse = null;

/* ── 4. 검색 / 페이지 변경 ── */
function doSearch() {
  const status = document.getElementById('filterStatus').value;
  const from   = document.getElementById('dateFrom').value;
  const to     = document.getElementById('dateTo').value;
  filtered = PAGE_COURSES.filter(c => {
    if (status && c.status !== status) return false;
    if (from   && c.date < from)       return false;
    if (to     && c.date > to)         return false;
    return true;
  });
  currentPage = 1;
  render();
}

function changePageSize() {
  pageSize = Number(document.getElementById('pageSizeSelect').value);
  currentPage = 1;
  render();
}

/* ── 5. 렌더링 ── */
function render() {
  const total      = filtered.length;
  const totalPages = Math.ceil(total / pageSize) || 1;
  const slice      = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  document.getElementById('totalCount').textContent = total.toLocaleString();

  document.getElementById('courseTableBody').innerHTML = slice.map(c => {
    const sm    = STATUS_META[c.status];
    const badge = sm.canApply
      ? `<button class="status-badge ${sm.cls}" style="cursor:pointer;border:none;"
               onclick="openApply(${c.id})">${sm.label}</button>`
      : `<span class="status-badge ${sm.cls}">${sm.label}</span>`;
    return `
      <tr>
        <td>${c.id}</td>
        <td class="td-title">
          ${sm.canApply
            ? `<a href="#" onclick="openApply(${c.id});return false;">${c.title}</a>`
            : `<span>${c.title}</span>`}
        </td>
        <td>${c.date}</td>
        <td style="font-size:13px;color:var(--gray-mid);">${c.from} ~ ${c.to}</td>
        <td>${badge}</td>
      </tr>`;
  }).join('');

  renderPagination(totalPages);
}

function renderPagination(totalPages) {
  const G  = 10;
  const gs = Math.floor((currentPage - 1) / G) * G + 1;
  const ge = Math.min(gs + G - 1, totalPages);
  let h = `<button class="page-btn arrow" ${currentPage === 1 ? 'disabled' : ''}
             onclick="goPage(${currentPage - 1})">&#8249;</button>`;
  for (let i = gs; i <= ge; i++)
    h += `<button class="page-btn ${i === currentPage ? 'active' : ''}"
               onclick="goPage(${i})">${i}</button>`;
  h += `<button class="page-btn arrow" ${currentPage === totalPages ? 'disabled' : ''}
             onclick="goPage(${currentPage + 1})">&#8250;</button>`;
  document.getElementById('pagination').innerHTML = h;
}

function goPage(p) {
  currentPage = p;
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── 6. 모달 로직 ── */
function openApply(courseId) {
  currentCourse = PAGE_COURSES.find(c => c.id === courseId);
  if (!currentCourse) return;
  document.getElementById('applyModalTitle').textContent = '강좌 신청';
  document.getElementById('guideTitle').textContent      = currentCourse.title;
  document.getElementById('guideContent').innerHTML      = currentCourse.guide.replace(/\n/g, '<br>');
  document.getElementById('agreeCheck').checked          = false;
  document.getElementById('summaryType').textContent     = currentCourse.type;
  document.getElementById('summaryTitle').textContent    = currentCourse.title;
  document.getElementById('summaryDate').textContent     = currentCourse.date;
  // 폼 초기화
  ['formName','formPhone','formEmail','formNote'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('formRegion').value = '';
  applyStep = 1;
  updateApplyStep();
  App.openModal('applyModal');
}

function updateApplyStep() {
  [1, 2, 3].forEach(s => {
    document.getElementById(`applyStep${s}`).style.display = s === applyStep ? 'block' : 'none';
    document.getElementById(`step${s}`).className =
      'step ' + (s < applyStep ? 'done' : s === applyStep ? 'active' : 'pending');
  });
  document.getElementById('applyPrevBtn').style.display =
    applyStep > 1 && applyStep < 3 ? 'inline-flex' : 'none';
  document.getElementById('applyNextBtn').style.display =
    applyStep < 3 ? 'inline-flex' : 'none';
  document.getElementById('applyDoneBtn').style.display =
    applyStep === 3 ? 'inline-flex' : 'none';
  document.getElementById('applyNextBtn').textContent =
    applyStep === 1 ? '동의하고 다음' : '신청 완료';
}

function applyNext() {
  if (applyStep === 1 && !document.getElementById('agreeCheck').checked) {
    App.toast('안내 사항 동의에 체크해주세요.', 'warning');
    return;
  }
  if (applyStep === 2) {
    // 필수값 검증
    const name  = document.getElementById('formName').value.trim();
    const phone = document.getElementById('formPhone').value.trim();
    const email = document.getElementById('formEmail').value.trim();
    if (!name)  { App.toast('이름을 입력해주세요.', 'warning');  return; }
    if (!phone) { App.toast('연락처를 입력해주세요.', 'warning'); return; }
    if (!email) { App.toast('이메일을 입력해주세요.', 'warning'); return; }
    // 완료 요약
    document.getElementById('completeDetail').innerHTML =
      `<strong style="color:var(--green-dark)">${currentCourse.title}</strong><br>
       구분: ${currentCourse.type} &nbsp;|&nbsp; 일자: ${currentCourse.date}`;
  }
  applyStep++;
  updateApplyStep();
}

function applyPrev() {
  applyStep--;
  updateApplyStep();
}

/* ── 7. 초기 렌더 ── */
render();
