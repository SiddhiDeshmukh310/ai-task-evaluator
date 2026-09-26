import fs from 'fs';
import path from 'path';
import { evaluateCode } from '../app/lib/evaluator.js';

function parseCSV(content) {
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',');
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    // Regex to parse CSV line with quoted strings
    const matches = line.match(/(?:^|,)(?:"([^"]*)"|([^,]*))/g);
    if (!matches) continue;

    const values = matches.map((m) => {
      let val = m.replace(/^,/, '').trim();
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.substring(1, val.length - 1);
      }
      return val;
    });

    if (values.length >= 10) {
      rows.push({
        id: values[0],
        title: values[1],
        language: values[2],
        human_score: Number(values[3]),
        human_correctness: Number(values[4]),
        human_readability: Number(values[5]),
        human_efficiency: Number(values[6]),
        human_security: Number(values[7]),
        description: values[8],
        code: values[9],
      });
    }
  }

  return rows;
}

function calculatePearsonCorrelation(x, y) {
  const n = x.length;
  if (n === 0) return 0;

  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumX2 = x.reduce((a, b) => a + b * b, 0);
  const sumY2 = y.reduce((a, b) => a + b * b, 0);
  const sumXY = x.reduce((a, b, idx) => a + b * y[idx], 0);

  const num = n * sumXY - sumX * sumY;
  const den = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  if (den === 0) return 0;
  return num / den;
}

async function runBenchmark() {
  const csvPath = path.join(process.cwd(), 'evals', 'human_scores.csv');
  const csvText = fs.readFileSync(csvPath, 'utf8');
  const items = parseCSV(csvText);

  console.log(`Loaded ${items.length} human-scored benchmark submissions.`);

  const humanScores = [];
  const predictedScores = [];
  let absoluteErrorSum = 0;

  console.log('\n--- EVALUATION BENCHMARK RESULTS ---');
  console.log('ID | Title                     | Human | LLM Score | Diff | Provider');
  console.log('---|---------------------------|-------|-----------|------|---------');

  for (const item of items) {
    const result = await evaluateCode({
      description: item.description,
      code: item.code,
      language: item.language,
    });

    const diff = Math.abs(result.score - item.human_score);
    humanScores.push(item.human_score);
    predictedScores.push(result.score);
    absoluteErrorSum += diff;

    const titlePadded = item.title.padEnd(25, ' ');
    console.log(
      `${String(item.id).padStart(2, ' ')} | ${titlePadded} | ${String(item.human_score).padStart(5, ' ')} | ${String(result.score).padStart(9, ' ')} | ${String(diff).padStart(4, ' ')} | ${result.provider_used}`
    );
  }

  const mae = (absoluteErrorSum / items.length).toFixed(2);
  const pearsonR = calculatePearsonCorrelation(humanScores, predictedScores).toFixed(3);

  console.log('\n--- BENCHMARK SUMMARY ---');
  console.log(`Total Submissions Evaluated: ${items.length}`);
  console.log(`Mean Absolute Error (MAE):   ${mae} points`);
  console.log(`Pearson Correlation (r):     ${pearsonR}`);
  console.log(`Human Agreement Status:      ${pearsonR >= 0.75 ? 'HIGH AGREEMENT (r >= 0.75)' : 'MODERATE AGREEMENT'}`);
}

runBenchmark().catch(console.error);