import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tempDir = path.join(__dirname, 'temp_docx');
if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
fs.mkdirSync(path.join(tempDir, '_rels'), { recursive: true });
fs.mkdirSync(path.join(tempDir, 'word', '_rels'), { recursive: true });

fs.writeFileSync(
  path.join(tempDir, '[Content_Types].xml'),
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`
);

fs.writeFileSync(
  path.join(tempDir, '_rels', '.rels'),
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`
);

fs.writeFileSync(
  path.join(tempDir, 'word', '_rels', 'document.xml.rels'),
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"/>`
);

fs.writeFileSync(
  path.join(tempDir, 'word', 'document.xml'),
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p><w:r><w:t>Student Code: QE190030</w:t></w:r></w:p>
    <w:p><w:r><w:t>Full Name: Le Thanh Phong</w:t></w:r></w:p>
    <w:p><w:r><w:t>GitHub Repository URL: https://github.com/ThanhFong05/PE_SDN</w:t></w:r></w:p>
    <w:p><w:r><w:t>Vercel Production URL: https://pe-sdn.vercel.app</w:t></w:r></w:p>
    <w:p><w:r><w:t>Test account email: grader.qe190030@example.com</w:t></w:r></w:p>
    <w:p><w:r><w:t>Test account password: Test1234!</w:t></w:r></w:p>
  </w:body>
</w:document>`
);

const tempZip = path.join(__dirname, 'temp_docx.zip');
const outDocx = path.join(__dirname, '..', 'QE190030.docx');
if (fs.existsSync(tempZip)) fs.unlinkSync(tempZip);
if (fs.existsSync(outDocx)) fs.unlinkSync(outDocx);

execSync(`powershell -Command "Compress-Archive -Path '${tempDir}\\*' -DestinationPath '${tempZip}' -Force"`);
fs.renameSync(tempZip, outDocx);
fs.rmSync(tempDir, { recursive: true, force: true });
console.log('✓ Generated real Word document: ' + outDocx);
