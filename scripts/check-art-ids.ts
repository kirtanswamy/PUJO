import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { DOMParser } from 'xmldom';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ART_DIR = join(__dirname, '..', 'src', 'art');

const REQUIRED_IDS = [
  'sky',
  'structure',
  'chalchitra',
  'protima',
  'eye-l',
  'eye-r',
  'lights',
  'lamp-pradip',
  'foreground',
];

const FORBIDDEN_TAGS = ['image', 'text', 'linearGradient', 'radialGradient', 'filter', 'mask', 'pattern', 'clipPath'];

function hasElementWithId(node: any, id: string): boolean {
  if (node.getAttribute && node.getAttribute('id') === id) return true;
  if (node.childNodes && node.childNodes.length) {
    for (let i = 0; i < node.childNodes.length; i++) {
      if (hasElementWithId(node.childNodes[i], id)) return true;
    }
  }
  return false;
}

function getElementsByTagName(node: any, tag: string): any[] {
  const results: any[] = [];
  if (node.tagName === tag) results.push(node);
  if (node.childNodes && node.childNodes.length) {
    for (let i = 0; i < node.childNodes.length; i++) {
      results.push(...getElementsByTagName(node.childNodes[i], tag));
    }
  }
  return results;
}

function checkSvg(filePath: string, fileName: string): string[] {
  const errors: string[] = [];
  const content = readFileSync(filePath, 'utf-8');

  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'image/svg+xml');
  const svg = doc.documentElement;

  if (svg.tagName !== 'svg') {
    errors.push(`${fileName}: Root element is not <svg>`);
    return errors;
  }

  for (const id of REQUIRED_IDS) {
    if (!hasElementWithId(svg, id)) {
      errors.push(`${fileName}: Missing required ID #${id}`);
    }
  }

  for (const tag of FORBIDDEN_TAGS) {
    const elements = getElementsByTagName(svg, tag);
    if (elements.length > 0) {
      errors.push(`${fileName}: Contains forbidden element <${tag}> (${elements.length} found)`);
    }
  }

  if (content.includes('data:image/') || content.includes('base64,')) {
    errors.push(`${fileName}: Contains raster data (data URI or base64)`);
  }

  const styleContent = content.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  if (styleContent) {
    const css = styleContent[1];
    if (/gradient|filter|mask|clip-path/i.test(css)) {
      errors.push(`${fileName}: CSS contains gradients, filters, or masks`);
    }
  }

  return errors;
}

function main(): void {
  const files = readdirSync(ART_DIR).filter((f) => f.endsWith('.svg'));

  if (files.length === 0) {
    console.error('No SVG files found in src/art/');
    process.exit(1);
  }

  let allErrors: string[] = [];

  for (const file of files) {
    const filePath = join(ART_DIR, file);
    const errors = checkSvg(filePath, file);
    allErrors = allErrors.concat(errors);
  }

  if (allErrors.length > 0) {
    console.error('\nArt validation failed:\n');
    for (const err of allErrors) {
      console.error(`  ✗ ${err}`);
    }
    console.error(`\nTotal errors: ${allErrors.length}\n`);
    process.exit(1);
  } else {
    console.log('\n✓ All scene SVGs pass validation\n');
    for (const file of files) {
      console.log(`  ✓ ${file}`);
    }
    console.log('');
  }
}

main();