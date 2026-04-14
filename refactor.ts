import fs from 'fs';
import path from 'path';

const content = fs.readFileSync('src/App.tsx', 'utf-8');
const lines = content.split('\n');

const components: Record<string, string[]> = {};
let currentComponent: string | null = null;
const imports: string[] = [];
const constants: string[] = [];
const defaultApp: string[] = [];

for (let line of lines) {
    if (line.startsWith('import ')) {
        imports.push(line);
    } else if (line.match(/^const ([A-Z][A-Za-z0-9_]*) = \(\) =>/)) {
        const match = line.match(/^const ([A-Z][A-Za-z0-9_]*) = \(\) =>/);
        if (match) {
            currentComponent = match[1];
            components[currentComponent] = [line];
        }
    } else if (line.startsWith('export default function App')) {
        currentComponent = 'App';
        defaultApp.push(line);
    } else if (currentComponent === 'App') {
        defaultApp.push(line);
    } else if (currentComponent) {
        components[currentComponent].push(line);
    } else {
        constants.push(line);
    }
}

// Ensure directories exist
const pagesDir = 'src/pages';
const componentsDir = 'src/components';
if (!fs.existsSync(pagesDir)) fs.mkdirSync(pagesDir, { recursive: true });
if (!fs.existsSync(componentsDir)) fs.mkdirSync(componentsDir, { recursive: true });
if (!fs.existsSync('src/shared')) fs.mkdirSync('src/shared', { recursive: true });

const pagesList = ['Home', 'About', 'Solutions', 'Services', 'Verticals', 'SolutionPage', 'Insights', 'Blog', 'Portfolio', 'Careers', 'Contact', 'Compliance'];

// We will package imports + constants to put them at the top of every file
const headerLines = [...imports, ...constants].join('\n');

for (const [name, compLines] of Object.entries(components)) {
    const dir = pagesList.includes(name) ? pagesDir : componentsDir;
    const filePath = path.join(dir, `${name}.tsx`);
    
    let fileContent = headerLines + '\n\n' + compLines.join('\n') + `\n\nexport default ${name};\n`;
    fs.writeFileSync(filePath, fileContent);
}

// Generate the new App.tsx
let newAppContent = headerLines + '\n\n';

for (const name of Object.keys(components)) {
    const dirName = pagesList.includes(name) ? 'pages' : 'components';
    newAppContent += `import ${name} from './${dirName}/${name}';\n`;
}

newAppContent += '\n\n' + defaultApp.join('\n') + '\n';

// Write backup
fs.writeFileSync('src/App.backup.tsx', content);

// Write new App.tsx
fs.writeFileSync('src/App.tsx', newAppContent);

console.log("Refactoring complete!");
