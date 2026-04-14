import { Project } from "ts-morph";
import * as path from "path";

const project = new Project({
  tsConfigFilePath: "tsconfig.json",
  skipAddingFilesFromTsConfig: false,
});

const pagesList = ['Home', 'About', 'Solutions', 'Services', 'Verticals', 'SolutionPage', 'Insights', 'Blog', 'Portfolio', 'Careers', 'Contact', 'Compliance'];
const componentsList = ['BlueDot', 'CTA', 'CelebrationPopup', 'ChatPreview', 'ChatbotWidget', 'Footer', 'Hero', 'Navbar', 'Presence', 'ScrollToTop'];

const sourceFiles = project.getSourceFiles("src/**/*.tsx");

for (const sourceFile of sourceFiles) {
    if (sourceFile.getBaseName() === "App.backup.tsx" || sourceFile.getBaseName() === "main.tsx" || sourceFile.getBaseName() === "App.tsx") continue;
    
    console.log(`Processing ${sourceFile.getBaseName()}...`);
    
    // Naively inject missing local components based on our known lists because ts-morph language service 
    // might struggle if files aren't saved/built yet or have parsing errors.
    const fileText = sourceFile.getText();
    let injectedImports = "";
    
    const allKnown = [...pagesList, ...componentsList];
    for (const name of allKnown) {
        // If the file uses this component, e.g. `<Hero` or `Hero()` but is NOT the component itself
        if (name !== sourceFile.getBaseNameWithoutExtension()) {
            const regex = new RegExp(`\\b${name}\\b`);
            if (regex.test(fileText)) {
                // It's used! Let's inject import
                const folder = pagesList.includes(name) ? '../pages' : '../components';
                injectedImports += `import ${name} from '${folder}/${name}';\n`;
            }
        }
    }
    
    if (injectedImports) {
        sourceFile.insertText(0, injectedImports);
    }
    
    // Now let Language service fix remaining standard missing imports if any exist
    try {
        sourceFile.fixUnusedIdentifiers();
        sourceFile.fixMissingImports();
    } catch (e) {
        console.warn(`Could not fix imports for ${sourceFile.getBaseName()}:`, e);
    }
}

project.saveSync();
console.log("Imports fixed successfully!");
