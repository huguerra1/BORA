# BORA — Serviços informais

[![CI](https://github.com/huguerra1/BORA/actions/workflows/ci.yml/badge.svg)](https://github.com/huguerra1/BORA/actions/workflows/ci.yml)

Plataforma web para conectar quem oferece e quem contrata serviços domésticos e informais (diaristas, reparos, cuidados etc.).

**Acesse:** https://huguerra1.github.io/BORA/

## Funcionalidades
- Cadastro e login de usuários (Firebase Authentication)
- Perfil de usuário
- Criação de anúncios de serviço
- Busca de serviços
- Mensagens entre usuários em tempo real (Firestore)

## Tecnologias
HTML, Tailwind CSS e JavaScript (módulos ES), com Firebase Authentication e Cloud Firestore.

## Estrutura
| Arquivo | Responsabilidade |
|---|---|
| `js/firebaseConfig.js` | Inicialização do Firebase |
| `js/authService.js` | Cadastro, login e logout |
| `js/firestoreService.js` | Perfis, anúncios e mensagens |
| `js/ui.js` | Renderização das telas |
| `js/main.js` | Fluxo da aplicação |

## Segurança
- A configuração do Firebase (`apiKey` etc.) é pública por natureza em apps web. A proteção dos dados depende das **regras do Firestore**.
- As regras recomendadas estão em [`firestore.rules`](firestore.rules): cada usuário só acessa o próprio perfil, só o dono altera um anúncio e mensagens não podem ser editadas nem enviadas em nome de outra pessoa. Publique-as no console do Firebase.
- Todo texto vindo de usuários (anúncios e mensagens) é escapado antes de ir para a tela, e imagens só aceitam URLs `http(s)`. Isso evita XSS armazenado.

## Testes
```bash
npm test
```
O CI roda os testes a cada push e pull request.

## Como rodar localmente
Sirva a pasta com qualquer servidor estático, por exemplo:
```bash
npx serve .
```
