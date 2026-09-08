import { describe, expect, it } from 'vitest';
import { validarEmail } from './formulario';

describe('validarEmail', () => {
  it('aceita e-mail corporativo sem reclamar', () => {
    expect(validarEmail('ricardo@ness.com.br')).toBeNull();
    expect(validarEmail('a.b-c@sub.dominio.io')).toBeNull();
  });

  it('não reclama de campo vazio — quem cuida disso é o required', () => {
    expect(validarEmail('')).toBeNull();
  });

  it('recusa endereço malformado', () => {
    for (const invalido of ['sem-arroba', 'a@b', 'a@b.c', '@dominio.com', 'a b@dominio.com']) {
      expect(validarEmail(invalido), invalido).toMatch(/inválido/);
    }
  });

  // Avisa, não bloqueia: barrar gmail custaria lead legítimo de empresa
  // pequena, que é exatamente quem escreve do endereço pessoal.
  it('avisa sobre domínio gratuito sem impedir o envio', () => {
    const aviso = validarEmail('alguem@gmail.com');
    expect(aviso).toMatch(/corporativo/);
    expect(aviso).not.toMatch(/inválido/);
  });

  it('não confunde domínio que apenas contém o nome de um gratuito', () => {
    expect(validarEmail('ti@gmail.com.br')).toBeNull();
    expect(validarEmail('contato@meugmail.com')).toBeNull();
  });
});
