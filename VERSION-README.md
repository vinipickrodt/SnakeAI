# Snake AI - Sistema de Controle de Versão

## 🎯 Como Funciona

Este projeto possui um sistema automático de controle de versão que:

1. **Incrementa automaticamente** a versão minor a cada `git push`
2. **Exibe a versão** no canto inferior direito da tela
3. **Atualiza automaticamente** os arquivos `package.json` e `index.html`

## 🚀 Uso Automático

### Git Hook (Recomendado)
O sistema está configurado para funcionar automaticamente:

```bash
git add .
git commit -m "feat: nova funcionalidade"
git push origin main  # ← A versão será incrementada automaticamente aqui!
```

### Fluxo Automático:
1. Você faz `git push`
2. O hook `pre-push` é executado
3. A versão minor é incrementada (ex: 1.1.0 → 1.2.0)
4. Os arquivos são atualizados e commitados automaticamente
5. O push continua normalmente

## 🔧 Uso Manual

### Incrementar Versão Manualmente
```bash
# Opção 1: Script Node.js
node scripts/increment-version.js

# Opção 2: Script Windows (mais amigável)
version-manager.bat
```

### Estrutura de Versão
- **Major**: Mudanças que quebram compatibilidade
- **Minor**: Novas funcionalidades (incremento automático)
- **Patch**: Correções de bugs

Exemplo: `1.2.3`
- `1` = Major
- `2` = Minor (incrementado automaticamente)
- `3` = Patch (resetado quando minor incrementa)

## 📁 Arquivos do Sistema

```
SnakeAI/
├── package.json              # Armazena a versão atual
├── index.html                # Exibe a versão na tela
├── scripts/
│   └── increment-version.js  # Script de incremento
├── .git/hooks/
│   ├── pre-push             # Hook para Linux/Mac
│   └── pre-push.bat         # Hook para Windows
└── version-manager.bat       # Script manual amigável
```

## 🔍 Verificar Versão Atual

```bash
# No terminal
node -p "require('./package.json').version"

# Ou apenas olhe no canto inferior direito da tela do jogo!
```

## ⚙️ Configuração (já feita)

O sistema já está configurado e pronto para uso. Os hooks do Git foram instalados automaticamente.

### Se precisar reconfigurar os hooks:

**Windows:**
```bash
# Tornar o hook executável (se necessário)
chmod +x .git/hooks/pre-push
```

**Linux/Mac:**
```bash
chmod +x .git/hooks/pre-push
```

## 🎮 Visualização

A versão aparece automaticamente no canto inferior direito da tela do jogo com um design elegante que combina com o tema do jogo.

---

✨ **Dica**: A cada funcionalidade nova que você implementar e fizer push, a versão será incrementada automaticamente!
