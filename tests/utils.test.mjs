import { test } from 'node:test';
import assert from 'node:assert/strict';
import { escapeHtml, safeImageUrl } from '../js/utils.js';

test('escapeHtml neutraliza tags e atributos', () => {
    assert.equal(escapeHtml('<img src=x onerror="alert(1)">'), '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;');
    assert.equal(escapeHtml("O'Neil & Cia"), 'O&#39;Neil &amp; Cia');
});

test('escapeHtml trata valores ausentes e não textuais', () => {
    assert.equal(escapeHtml(undefined), '');
    assert.equal(escapeHtml(null), '');
    assert.equal(escapeHtml(42), '42');
});

test('safeImageUrl só aceita http e https', () => {
    assert.equal(safeImageUrl('https://exemplo.com/a.png'), 'https://exemplo.com/a.png');
    assert.equal(safeImageUrl('javascript:alert(1)', 'X'), 'X');
    assert.equal(safeImageUrl('data:text/html,oi', 'X'), 'X');
    assert.equal(safeImageUrl('não é url', 'X'), 'X');
});
