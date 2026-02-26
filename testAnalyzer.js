import { ImprovedAnalyzer } from './server/src/controllers/decompileController.js';

(async () => {
  const sample = `fetch('http://example.com/api/data'); axios.post("https://api.test.com/v1", {});`;
  const res = await ImprovedAnalyzer.analyzeCode(sample);
  console.log(JSON.stringify(res, null, 2));
})();
