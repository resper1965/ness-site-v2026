const fs = require('fs');

const content = fs.readFileSync('src/i18n.ts', 'utf8');

// A very simple regex to find all t("...") strings.
// A better way is to use bash grep, let's just use grep instead to find all t("...")
