/**
 * 페이지 내 HTML 에디터 — 텍스트 편집 후 index.html 저장
 */

const EDITABLE_SELECTORS = [
    '.nav-logo a',
    '.nav-menu a',
    '.hero-label',
    '.hero-main-title',
    '.hero-description',
    '.hero-btn',
    '.section-label',
    '.section-title',
    '.section-subtitle',
    '.block-heading',
    '.philosophy-text',
    '.author-tag',
    '#ongoingColumns .column-media-name',
    '#ongoingColumns .column-desc',
    '#ongoingColumns .column-latest-title a',
    '#ongoingColumns .column-latest-meta',
    '#archiveFeatured .archive-featured-title a',
    '#archiveFeatured .archive-featured-meta',
    '#archiveList .archive-list-title',
    '#archiveList .archive-list-media',
    '#archiveList .archive-list-date',
    '.book-title',
    '.book-subtitle',
    '.book-publisher',
    '.book-price-list',
    '.book-badge',
    '.inquiry-card h3',
    '.inquiry-card > p',
    '.newsletter-text',
    '.footer-title',
    '.footer-text',
    '.footer-email',
    '.footer-links a',
    '.footer-bottom p'
];

let editMode = false;
let editableElements = [];

function initEditor() {
    const toolbar = document.getElementById('editorToolbar');
    const toggleBtn = document.getElementById('editorToggle');
    const saveBtn = document.getElementById('editorSave');

    if (!toolbar || !toggleBtn || !saveBtn) {
        console.warn('[editor] 툴바 요소를 찾을 수 없습니다.');
        return;
    }

    if (toggleBtn.dataset.bound) return;
    toggleBtn.dataset.bound = 'true';

    toggleBtn.addEventListener('click', () => setEditMode(!editMode));
    saveBtn.addEventListener('click', saveHtml);
    saveBtn.disabled = false;

    document.addEventListener('click', (e) => {
        if (!editMode) return;
        const link = e.target.closest('a[contenteditable="true"]');
        if (link) e.preventDefault();
    }, true);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEditor);
} else {
    initEditor();
}

function collectEditableElements() {
    const set = new Set();
    EDITABLE_SELECTORS.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => set.add(el));
    });
    return [...set];
}

function setEditMode(active) {
    editMode = active;
    const toggleBtn = document.getElementById('editorToggle');
    const saveBtn = document.getElementById('editorSave');

    document.body.classList.toggle('editor-active', active);
    toggleBtn.classList.toggle('active', active);
    toggleBtn.textContent = active ? '편집 종료' : '편집 모드';
    saveBtn.disabled = false;

    editableElements = collectEditableElements();

    editableElements.forEach(el => {
        el.contentEditable = active ? 'true' : 'false';
        el.classList.toggle('editor-editable', active);
        if (!active) el.removeAttribute('contenteditable');
    });

    if (active) {
        showEditorToast('텍스트를 클릭해 수정하세요. 완료 후 HTML 저장을 누르세요.');
    }
}

function saveHtml() {
    if (editMode) setEditMode(false);

    const clone = document.documentElement.cloneNode(true);

    clone.querySelectorAll('.toast').forEach(el => el.remove());

    clone.querySelectorAll('[contenteditable]').forEach(el => {
        el.removeAttribute('contenteditable');
    });
    clone.querySelectorAll('.editor-editable').forEach(el => {
        el.classList.remove('editor-editable');
    });
    clone.querySelector('body')?.classList.remove('editor-active');

    ['ongoingColumns', 'archiveFeatured', 'archiveList'].forEach(id => {
        const el = clone.querySelector('#' + id);
        if (el && el.innerHTML.trim()) el.dataset.baked = 'true';
    });

    const archiveList = clone.querySelector('#archiveList');
    if (archiveList?.hasAttribute('hidden')) {
        archiveList.setAttribute('hidden', '');
    }

    let html = '<!DOCTYPE html>\n' + clone.outerHTML;

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    a.click();
    URL.revokeObjectURL(url);

    showEditorToast('index.html 파일이 저장되었습니다.');
}

function showEditorToast(message) {
    if (typeof showToast === 'function') {
        showToast(message);
        return;
    }
    alert(message);
}
