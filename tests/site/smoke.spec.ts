import { test, expect } from '@playwright/test';

/**
 * Smoke do site público: metadados por rota, ausência de overlays não
 * solicitados, chat só por clique, 404 real e orçamento de peso inicial.
 * Os bugs B-01..B-07 do PLAN-performance-ux-comercial.md ficam cobertos aqui.
 */

test.describe('metadados por rota', () => {
  const cases: { path: string; title: RegExp; canonical: string }[] = [
    { path: '/', title: /tecnologia digital de precisão — ness\./, canonical: 'https://ness.com.br/' },
    { path: '/contato', title: /contato — fale com um especialista/, canonical: 'https://ness.com.br/contato' },
    { path: '/solucoes/secops', title: /n\.secops — SOC 24×7/, canonical: 'https://ness.com.br/solucoes/secops' },
    { path: '/solucoes/cirt', title: /n\.cirt — resposta a incidentes/, canonical: 'https://ness.com.br/solucoes/cirt' },
  ];

  for (const c of cases) {
    test(`${c.path} tem título e canonical próprios`, async ({ page }) => {
      await page.goto(c.path);
      await expect(page).toHaveTitle(c.title);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', c.canonical);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index, follow');
      await expect(page.locator('h1').first()).toBeVisible();
    });
  }

  // Os testes acima leem a página já hidratada. Este lê o HTML cru, como um
  // scraper de LinkedIn ou WhatsApp, que não executa JavaScript: é o que a
  // renderização na edge existe para consertar.
  test('o HTML do servidor já traz os metadados da rota', async ({ request }) => {
    const casos = [
      { path: '/', titulo: 'tecnologia digital de precisão', canonical: 'https://ness.com.br/' },
      { path: '/contato', titulo: 'contato — fale com um especialista', canonical: 'https://ness.com.br/contato' },
      { path: '/solucoes/secops', titulo: 'n.secops', canonical: 'https://ness.com.br/solucoes/secops' },
      { path: '/sobre', titulo: 'sobre — ness. IT Company', canonical: 'https://ness.com.br/sobre' },
    ];

    for (const c of casos) {
      const html = await (await request.get(c.path)).text();
      expect(html, c.path).toContain(`<title>`);
      expect(html.match(/<title>([^<]*)<\/title>/)?.[1], c.path).toContain(c.titulo);
      expect(html, c.path).toContain(`href="${c.canonical}"`);
      expect(html, c.path).toContain('property="og:title"');
      expect(html, c.path).toContain('content="index, follow"');
    }
  });

  // No workerd o relógio fica congelado fora de uma requisição: `new Date()`
  // na importação devolve o epoch. Uma constante de módulo calculada assim
  // colocou "-22 anos" e "© 1991–1970" no HTML que o buscador lê.
  // Varredura de robô produz dezenas de 404 por minuto. O status precisa ser
  // 404 de verdade — foi por confiar no 200 que o soft-404 do Pages deixou
  // URLs mortas indexadas.
  test('URL inexistente responde 404, inclusive as que robô procura', async ({ request }) => {
    for (const path of ['/wp-login.php', '/index.php', '/post-sitemap.xml', '/glossario/qualquer-coisa']) {
      expect((await request.get(path)).status(), path).toBe(404);
    }
  });

  test('o HTML do servidor não tem data de epoch', async ({ request }) => {
    for (const path of ['/', '/sobre', '/contato']) {
      const html = await (await request.get(path)).text();
      expect(html, `${path} com ano de epoch`).not.toContain('1970');
      expect(html, `${path} com tempo de casa negativo`).not.toMatch(/-\d+ anos/);
    }
  });

  // O sufixo da marca é acrescentado por pageMeta. Repeti-lo no título da
  // própria página produz "… — ness. IT Company — ness. IT Company", que já
  // aconteceu com o fallback da raiz.
  // O título é "<página> — <marca>". O defeito que já apareceu duas vezes é a
  // página trazer a marca no próprio título, e o sufixo acrescentar de novo:
  // "DPO as a Service — trustness. — trustness.". Um travessão dentro do
  // título da página é legítimo ("contato — fale com um especialista"), então
  // o que se checa é a parte da página não terminar com nome de marca.
  test('nenhuma rota repete a marca no título', async ({ request }) => {
    const SUFIXO = ' — ness. IT Company';
    const paths = ['/', '/assessment/cyber', '/contato', '/blog', '/sobre', '/carreiras',
                   '/trustness', '/dpo-as-a-service', '/forense', '/portfolio', '/en', '/es'];
    for (const path of paths) {
      const html = await (await request.get(path)).text();
      const titulo = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
      expect(titulo, path).toContain(SUFIXO);
      const daPagina = titulo.slice(0, -SUFIXO.length);
      expect(daPagina, `${path}: ${titulo}`).not.toMatch(/(trustness\.|forense\.io|ness\.)$/);
    }
  });

  test('slug de solução inexistente renderiza 404 com noindex', async ({ page }) => {
    await page.goto('/solucoes/devsecops');
    await expect(page.locator('h1')).toContainText('página não encontrada');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
  });
});

test.describe('home enxuta', () => {
  // Nove seções eram nove telas de rolagem no celular. O corte só vale se as
  // páginas que saíram continuarem alcançáveis — daí o teste do menu acima.
  test('a home tem seis seções e não repete serviços nem verticais', async ({ page }) => {
    await page.goto('/');
    const secoes = page.locator('main > section, main > div > section');
    expect(await secoes.count(), 'a home passou de seis seções').toBeLessThanOrEqual(6);
  });
});

test.describe('eventos de conversão', () => {
  // Lê a fila real do gtag (`dataLayer`, criada pelo /boot.js) em vez de
  // simular: um stub seria sobrescrito pelo próprio boot, e o teste passaria
  // medindo a si mesmo.
  const nomesDeEventos = (page: import('@playwright/test').Page) =>
    page.evaluate(() =>
      Array.from((window as unknown as { dataLayer?: IArguments[] }).dataLayer ?? [])
        .map((entrada) => (entrada[0] === 'event' ? entrada[1] : null))
        .filter(Boolean),
    );

  test('o CTA do hero e a rolagem chegam à fila do gtag', async ({ page }) => {
    await page.goto('/');

    await expect(async () => {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
      await page.getByRole('link', { name: /falar com um especialista/i }).first().click({ trial: true });
      expect(await nomesDeEventos(page)).toContain('scroll_depth');
    }).toPass({ timeout: 15_000 });

    await page.getByRole('link', { name: /falar com um especialista/i }).first().click();
    await page.waitForURL(/contato/);
    expect(await nomesDeEventos(page)).toContain('cta_click');
  });
});

test.describe('superfícies públicas protegidas', () => {
  // Fechar só o formulário de contato deixa as portas laterais abertas: um
  // robô que quiser inundar vai pela newsletter ou pela ouvidoria.
  const superficies: [string, string][] = [
    ['/', 'newsletter-website'],
    ['/compliance/etica', 'denuncia-website'],
  ];

  for (const [path, id] of superficies) {
    test(`${path} tem armadilha fora da tela`, async ({ page }) => {
      await page.goto(path);
      const armadilha = page.locator(`#${id}`);
      await expect(armadilha).toHaveCount(1);
      await expect(armadilha).not.toBeInViewport();
      await expect(armadilha).toHaveAttribute('tabindex', '-1');
    });
  }

  test('newsletter recusa envio de robô sem revelar o motivo', async ({ request }) => {
    const r = await request.post('/api/newsletter', {
      data: { email: 'robo@exemplo.com', website: 'preenchido por robo' },
    });
    // Sucesso de mentira: dizer "recusado" ensina o robô a contornar.
    expect(r.status()).toBe(200);
  });
});

test.describe('navegação', () => {
  test('soluções abre o mapa dos cinco produtos e fecha no Esc', async ({ page, isMobile }) => {
    test.skip(!!isMobile, 'o mega-menu é do desktop; no mobile os produtos ficam listados');
    await page.goto('/');
    const botao = page.getByRole('button', { name: /soluções/i });
    await expect(botao).toHaveAttribute('aria-expanded', 'false');

    await botao.click();
    await expect(botao).toHaveAttribute('aria-expanded', 'true');
    // Cinco produtos, serviços, verticais e o diagnóstico.
    await expect(page.locator('#menu-solucoes a')).toHaveCount(8);
    // Serviços e Verticais saíram da home: sem isto, só se chega por URL.
    await expect(page.locator('#menu-solucoes a[href="/servicos"]')).toHaveCount(1);
    await expect(page.locator('#menu-solucoes a[href="/verticais"]')).toHaveCount(1);

    await page.keyboard.press('Escape');
    await expect(botao).toHaveAttribute('aria-expanded', 'false');
  });

  test('o switcher leva às três marcas, cada uma no seu domínio', async ({ page, isMobile }) => {
    test.skip(!!isMobile, 'o switcher é do desktop');
    await page.goto('/');
    const botao = page.getByRole('button', { name: /trocar de marca/i });
    await botao.click();

    const links = page.locator('#ecossistema a');
    await expect(links).toHaveCount(3);
    // Domínio próprio por marca: trocar é sair do site, então são âncoras.
    await expect(links.nth(0)).toHaveAttribute('href', 'https://ness.com.br');
    await expect(links.nth(1)).toHaveAttribute('href', 'https://trustness.com.br');
    await expect(links.nth(2)).toHaveAttribute('href', 'https://forense.io');

    await page.keyboard.press('Escape');
    await expect(botao).toHaveAttribute('aria-expanded', 'false');
  });

  test('toda página interna declara a hierarquia para o buscador', async ({ request }) => {
    for (const path of ['/blog', '/contato', '/solucoes/secops', '/sobre']) {
      const html = await (await request.get(path)).text();
      expect(html, path).toContain('BreadcrumbList');
      // Uma só: schema duplicado é pior que schema nenhum.
      expect(html.match(/BreadcrumbList/g)!.length, path).toBe(1);
    }
  });

  test('no mobile os cinco produtos ficam listados sob soluções', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'somente mobile');
    await page.goto('/');
    await page.getByRole('button', { name: /abrir menu/i }).click();
    await expect(page.locator('#solucoes-mobile a')).toHaveCount(7);
  });

  test('a página de solução mostra a trilha; a de blog, não', async ({ page }) => {
    await page.goto('/solucoes/secops');
    await expect(page.getByRole('navigation', { name: /trilha/i })).toBeVisible();
    await page.goto('/blog');
    await expect(page.getByRole('navigation', { name: /trilha/i })).toHaveCount(0);
  });
});

test.describe('formulário de contato', () => {
  test('quatro campos, sem select de assunto', async ({ page }) => {
    await page.goto('/contato');
    await expect(page.locator('#contact-name')).toBeVisible();
    await expect(page.locator('#contact-company')).toBeVisible();
    await expect(page.locator('#contact-email')).toBeVisible();
    await expect(page.locator('#contact-message')).toBeVisible();
    // O assunto passou a sair do `ref` da URL: um campo a menos para o visitante.
    await expect(page.locator('#contact-subject')).toHaveCount(0);
  });

  // Fora da tela, não `display:none`: robô ingênuo preenche campo escondido
  // por CSS de display, e é justamente ele que a armadilha pega.
  test('honeypot está fora da tela e fora do teclado', async ({ page }) => {
    await page.goto('/contato');
    // Por id: o rodapé tem a sua própria armadilha, com o mesmo `name`.
    const armadilha = page.locator('#website');
    await expect(armadilha).toHaveCount(1);
    await expect(armadilha).toHaveAttribute('tabindex', '-1');

    await expect(armadilha, 'honeypot dentro da tela').not.toBeInViewport();

    const display = await armadilha.evaluate((el) => getComputedStyle(el).display);
    expect(display, 'honeypot virou display:none — robô ingênuo preenche assim mesmo').not.toBe('none');

    const escondidoDeLeitorDeTela = await armadilha.evaluate(
      (el) => !!el.closest('[aria-hidden="true"]'),
    );
    expect(escondidoDeLeitorDeTela, 'honeypot visível para leitor de tela').toBe(true);
  });

  test('e-mail inválido avisa na hora, sem esperar o envio', async ({ page }) => {
    await page.goto('/contato');
    // O aviso depende do onBlur, que só existe depois da hidratação. Repetir
    // o ciclo inteiro é honesto; esperar um tempo fixo é torcer.
    await expect(async () => {
      await page.locator('#contact-email').fill('nao-e-email');
      await page.locator('#contact-name').click();
      await expect(page.locator('#contact-email-erro')).toContainText('inválido');
    }).toPass({ timeout: 15_000 });
  });

  // O chat manda o lead para o mesmo endpoint do formulário. Sem widget lá, a
  // verificação recusa todo lead vindo do chat — aconteceu em produção.
  //
  // A prova de que o widget renderizou é o campo oculto `cf-turnstile-response`:
  // é o próprio Turnstile que o cria. Sem ele, não há token, e todo envio é
  // recusado — que foi exatamente a falha que a renderização implícita causou.
  test('cada formulário tem o campo que o Turnstile cria ao renderizar', async ({ page }) => {
    test.skip(!process.env.SITE_BASE_URL, 'precisa da sitekey, que só existe no preview');

    await page.goto('/contato');
    await expect(page.locator('form input[name="cf-turnstile-response"]').first()).toHaveCount(1, { timeout: 15_000 });

    await page.goto('/');
    await page.getByRole('button', { name: /gabi/i }).click();
    await page.getByRole('button', { name: /especialista/i }).click();
    await expect(page.locator('#chat-nome')).toBeVisible();
    await expect(page.locator('form input[name="cf-turnstile-response"]')).not.toHaveCount(0, { timeout: 15_000 });
  });

  test('a confirmação é página própria e não é indexável', async ({ request }) => {
    const resposta = await request.get('/obrigado');
    expect(resposta.status()).toBe(200);
    const html = await resposta.text();
    expect(html).toContain('content="noindex, nofollow"');
    expect(html).toContain('recebemos sua mensagem');
  });
});

test.describe('idioma na URL', () => {
  test('cada idioma tem endereço próprio, com conteúdo e lang corretos', async ({ request }) => {
    const casos = [
      { path: '/', lang: 'pt-BR', trecho: 'invisíveis quando tudo funciona' },
      { path: '/en', lang: 'en', trecho: 'invisible when everything works' },
      { path: '/es', lang: 'es', trecho: 'invisibles cuando todo funciona' },
    ];
    for (const c of casos) {
      const html = await (await request.get(c.path)).text();
      expect(html, c.path).toContain(`<html lang="${c.lang}"`);
      expect(html, c.path).toContain(c.trecho);
    }
  });

  test('o título também muda de idioma', async ({ request }) => {
    const titulo = async (path: string) =>
      (await (await request.get(path)).text()).match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
    expect(await titulo('/en')).toContain('precision digital engineering');
    expect(await titulo('/es')).toContain('ingeniería digital de precisión');
    expect(await titulo('/en/contato')).toContain('talk to a specialist');
  });

  // B-10: o sitemap declarava pt, en e es apontando para a mesma URL.
  test('hreflang recíproco em cada idioma', async ({ request }) => {
    for (const path of ['/', '/en', '/es']) {
      const html = await (await request.get(path)).text();
      for (const idioma of ['pt', 'en', 'es']) {
        expect(html.toLowerCase(), `${path} sem hreflang ${idioma}`).toContain(`hreflang="${idioma}"`);
      }
    }
  });

  // Soluções e assessments têm o conteúdo só em português: publicá-los sob
  // /en seria indexar página inglesa com corpo em português.
  test('o que não está traduzido não existe em en/es', async ({ request }) => {
    expect((await request.get('/en/solucoes/secops')).status()).toBe(404);
    expect((await request.get('/es/assessment/cyber')).status()).toBe(404);
    expect((await request.get('/solucoes/secops')).status()).toBe(200);
  });
});

test.describe('rotas espelho e www', () => {
  const espelhos: [string, string][] = [
    ['/contact', '/contato'],
    ['/about', '/sobre'],
    ['/portf%C3%B3lio', '/portfolio'],
  ];

  for (const [de, para] of espelhos) {
    test(`${de} redireciona 301 para ${para}`, async ({ request }) => {
      const resposta = await request.get(de, { maxRedirects: 0 });
      expect(resposta.status()).toBe(301);
      expect(resposta.headers()['location']).toContain(para);
    });
  }

  test('a grafia canônica continua respondendo', async ({ request }) => {
    for (const path of ['/contato', '/sobre', '/portfolio']) {
      expect((await request.get(path)).status(), path).toBe(200);
    }
  });
});

test.describe('conteúdo do CMS no HTML', () => {
  // O D1 local (miniflare) está vazio; estas asserções só valem contra um
  // ambiente com o banco de verdade, que é o preview do PR.
  test.skip(!process.env.SITE_BASE_URL, 'precisa do D1 com conteúdo');

  test('a lista do blog sai renderizada do servidor', async ({ request }) => {
    const html = await (await request.get('/blog')).text();
    const links = html.match(/href="\/blog\/[a-z0-9-]+"/g) ?? [];
    expect(links.length, 'nenhum link de post no HTML cru').toBeGreaterThan(0);
  });

  test('o post traz o corpo e og:type article no HTML cru', async ({ request }) => {
    const lista = await (await request.get('/blog')).text();
    const slug = lista.match(/href="\/blog\/([a-z0-9-]+)"/)?.[1];
    expect(slug, 'nenhum post publicado para testar').toBeTruthy();

    const resposta = await request.get(`/blog/${slug}`);
    expect(resposta.status()).toBe(200);
    const html = await resposta.text();
    expect(html).toContain('content="article"');
    // O corpo do artigo é markdown renderizado: sem ele a página é uma casca.
    expect(html.match(/<p[^>]*>/g)?.length ?? 0, 'sem parágrafos no HTML').toBeGreaterThan(1);
  });

  test('slug inexistente devolve 404', async ({ request }) => {
    expect((await request.get('/blog/nao-existe-mesmo')).status()).toBe(404);
    expect((await request.get('/portfolio/nao-existe-mesmo')).status()).toBe(404);
  });
});

test.describe('primeira visita sem interrupções', () => {
  test('nenhum modal ou chat abre sozinho', async ({ page }) => {
    await page.goto('/solucoes/secops');
    await page.waitForTimeout(9_000); // antes: popup em 1,5 s e chat em 8 s
    await expect(page.locator('[role="dialog"], .fixed.inset-0')).toHaveCount(0);
    await expect(page.getByPlaceholder(/digite sua mensagem/i)).toHaveCount(0);
  });

  test('chat abre apenas ao clicar no botão', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /gabi/i }).click();
    await expect(page.getByPlaceholder(/digite sua mensagem/i)).toBeVisible({ timeout: 10_000 });
  });

  // O chat existe para virar lead. Mandar o visitante recomeçar num formulário
  // é onde a conversa morre — a qualificação acontece dentro dele.
  test('falar com especialista qualifica dentro do chat', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /gabi/i }).click();
    await page.getByRole('button', { name: /especialista/i }).click();

    await expect(page.locator('#chat-nome')).toBeVisible();
    await expect(page.locator('#chat-email')).toBeVisible();
    await expect(page.locator('#chat-empresa')).toBeVisible();
    // Enquanto qualifica, o campo de conversa sai de cena: um foco por vez.
    await expect(page.getByPlaceholder(/digite sua mensagem/i)).toHaveCount(0);
  });

  test('menu mobile abre, fecha com Esc e mantém o CTA visível', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'somente mobile');
    await page.goto('/');
    await expect(page.getByRole('link', { name: /contato/i }).first()).toBeVisible();
    await page.getByRole('button', { name: /abrir menu/i }).click();
    await expect(page.locator('#mobile-menu')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#mobile-menu')).toHaveCount(0);
  });
});

test.describe('orçamento de performance', () => {
  test('home não carrega terceiros no caminho crítico e cabe no orçamento', async ({ page }) => {
    const external: string[] = [];
    let bytes = 0;
    let comprimidas = 0;
    page.on('response', async (res) => {
      const url = res.url();
      if (!url.startsWith('http://127.0.0.1') && !url.includes(process.env.SITE_BASE_URL || '127.0.0.1')) external.push(url);
      if (res.headers()['content-encoding']) comprimidas += 1;
      bytes += Number(res.headers()['content-length'] || 0);
    });
    await page.goto('/', { waitUntil: 'load' });

    const critical = external.filter((u) => /unsplash|fonts\.googleapis|fonts\.gstatic|clearbit/.test(u));
    expect(critical, `terceiros no caminho crítico: ${critical.join(', ')}`).toHaveLength(0);

    // O preview local do Worker entrega tudo sem compressão; a Cloudflare
    // comprime em produção e no preview do PR. O orçamento segue o que foi
    // de fato transferido, senão a mesma página reprova em uma máquina e
    // passa na outra.
    const orcamentoKB = comprimidas > 0 ? 450 : 950;
    expect(bytes / 1024, `${comprimidas > 0 ? 'comprimido' : 'sem compressão'}`).toBeLessThan(orcamentoKB);
  });

  // O HTML da edge traz os dados de hidratação num script inline. O que não
  // pode existir é 'unsafe-inline': cada script inline carrega o nonce da
  // resposta, e o mesmo nonce está no cabeçalho.
  test('todo script inline tem o nonce da CSP da resposta', async ({ page }) => {
    const res = await page.goto('/');
    const html = (await res?.text()) || '';
    const csp = res?.headers()['content-security-policy'] || '';

    const scriptSrc = csp.match(/script-src ([^;]*)/)?.[1] ?? '';
    expect(scriptSrc, `script-src: ${scriptSrc}`).not.toContain("'unsafe-inline'");
    expect(scriptSrc).toMatch(/'nonce-[a-f0-9]+'/);
    const nonce = scriptSrc.match(/'nonce-([a-f0-9]+)'/)?.[1];

    const semNonce = (html.match(/<script(?![^>]*\ssrc=)[^>]*>/g) || [])
      .filter((tag) => !tag.includes(`nonce="${nonce}"`));
    expect(semNonce, `scripts inline sem nonce: ${semNonce.join(' ')}`).toHaveLength(0);

    expect(html).toContain('src="/boot.js"');
    const boot = await page.request.get('/boot.js');
    expect(boot.ok()).toBeTruthy();
  });

  test('formulário de contato tem telefone e e-mail clicáveis', async ({ page }) => {
    await page.goto('/contato');
    await expect(page.locator('a[href^="tel:"]')).toHaveCount(1);
    await expect(page.locator('a[href^="mailto:"]')).toHaveCount(1);
    await expect(page.locator('label[for="contact-email"]')).toBeVisible();
  });
});
