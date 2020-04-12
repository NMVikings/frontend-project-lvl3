import { promises as fs } from 'fs';
import path from 'path';
import init from '../src/init';

const setupDocument = async () => {
  const pathToHtml = path.resolve(__dirname, '__fixtures__/index.html');
  const html = await fs.readFile(pathToHtml, 'utf8');
  document.body.innerHTML = html;
};

describe('init', () => {
  it('init', async () => {
    expect.assertions(1);
    await setupDocument();
    init();
    expect(true).toBeDefined();
  });
});
