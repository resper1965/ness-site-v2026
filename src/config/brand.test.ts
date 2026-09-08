import { describe, it, expect } from 'vitest';
import { detectBrandFromHost } from './brand';

// Esta função decide qual das 3 marcas cada domínio recebe. Se ela errar,
// trustness.com.br passa a servir a ness — que é exatamente a falha que a
// migração para HTML na edge existe para corrigir.
describe('detectBrandFromHost', () => {
  it('resolve os domínios de produção', () => {
    expect(detectBrandFromHost('ness.com.br')).toBe('ness');
    expect(detectBrandFromHost('trustness.com.br')).toBe('trustness');
    expect(detectBrandFromHost('forense.io')).toBe('forense');
  });

  it('resolve subdomínios (www e previews)', () => {
    expect(detectBrandFromHost('www.trustness.com.br')).toBe('trustness');
    expect(detectBrandFromHost('www.forense.io')).toBe('forense');
    expect(detectBrandFromHost('staging.ness.com.br')).toBe('ness');
  });

  it('cai em ness quando o host é ausente ou desconhecido', () => {
    expect(detectBrandFromHost(null)).toBe('ness');
    expect(detectBrandFromHost(undefined)).toBe('ness');
    expect(detectBrandFromHost('')).toBe('ness');
    expect(detectBrandFromHost('localhost:5173')).toBe('ness');
    expect(detectBrandFromHost('ness-site2026.pages.dev')).toBe('ness');
  });

  // "trustness" contém "ness" — a ordem das checagens importa, e uma
  // reordenação descuidada faria trustness.com.br servir a ness.
  it('não confunde trustness com ness', () => {
    expect(detectBrandFromHost('trustness.com.br')).not.toBe('ness');
    expect(detectBrandFromHost('pr-7.ness-site2026.pages.dev')).toBe('ness');
  });
});
