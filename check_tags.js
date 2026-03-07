const fs = require('fs');
const content = fs.readFileSync('/home/batman/Desktop/acad-point-repo/Frontend/src/components/LoginRegister.jsx', 'utf8');

const tags = [];
const tagRegex = /<\/?([a-zA-Z0-9]+|(\s*[\>]*))(\s+[^>]*?)?(\/?)>/g;
let match;

while ((match = tagRegex.exec(content)) !== null) {
    const fullTag = match[0];
    const tagName = match[1] || '';
    const isClosing = fullTag.startsWith('</');
    const isSelfClosing = fullTag.endsWith('/>');

    if (isSelfClosing) continue;
    if (fullTag.startsWith('<!--')) continue; // Ignore comments

    if (isClosing) {
        if (tags.length === 0) {
            console.log(`Found closing tag ${fullTag} but no opening tag found.`);
        } else {
            const lastTag = tags.pop();
            if (lastTag !== tagName && tagName !== '') {
                // Ignore cases where tagName is empty (fragments) if the last tag was also empty
                if (tagName === '' && lastTag === '') {
                    // match
                } else if (lastTag !== tagName) {
                    console.log(`Mismatched tag: opened ${lastTag}, closed ${tagName}`);
                }
            }
        }
    } else {
        tags.push(tagName);
    }
}

console.log('Open tags remaining:', tags);
