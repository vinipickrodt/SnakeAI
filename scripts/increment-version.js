const fs = require('fs');
const path = require('path');

// Lê o package.json
const packagePath = path.join(__dirname, '..', 'package.json');
const package = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// Incrementa a versão minor
const versionParts = package.version.split('.');
const major = parseInt(versionParts[0]);
const minor = parseInt(versionParts[1]) + 1;
const patch = 0; // Reset patch quando incrementa minor

const newVersion = `${major}.${minor}.${patch}`;
package.version = newVersion;

// Salva o package.json atualizado
fs.writeFileSync(packagePath, JSON.stringify(package, null, 2));

// Atualiza o index.html com a nova versão
const indexPath = path.join(__dirname, '..', 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');

// Procura por um elemento de versão existente ou adiciona um novo
const versionRegex = /<div class="version">v[\d.]+<\/div>/;
const versionElement = `<div class="version">v${newVersion}</div>`;

if (versionRegex.test(indexContent)) {
    // Substitui a versão existente
    indexContent = indexContent.replace(versionRegex, versionElement);
} else {
    // Adiciona a versão antes do fechamento do body
    indexContent = indexContent.replace('</body>', `    ${versionElement}\n</body>`);
}

fs.writeFileSync(indexPath, indexContent);

console.log(`✅ Versão incrementada para: ${newVersion}`);
console.log(`📝 Arquivos atualizados: package.json, index.html`);
