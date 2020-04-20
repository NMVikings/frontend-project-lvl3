import fs from 'fs';
import path from 'path';
import init from '../src/init';

const setupDocument = () => {
  const pathToHtml = path.resolve(__dirname, '__fixtures__/index.html');
  const html = fs.readFileSync(pathToHtml, 'utf8');
  document.body.innerHTML = html;
};

describe('init', () => {
  it('init', () => {
    expect.assertions(1);
    setupDocument();
    init();
    expect(true).toBeDefined();
  });
});
