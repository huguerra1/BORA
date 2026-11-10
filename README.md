# BORA — Serviços informais

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
A configuração do Firebase (`apiKey` etc.) é pública por natureza em apps web. A proteção dos dados depende das **regras do Firestore**, que devem permitir a cada usuário ler e escrever apenas os próprios dados.

## Como rodar localmente
Sirva a pasta com qualquer servidor estático, por exemplo:
```bash
npx serve .
```
