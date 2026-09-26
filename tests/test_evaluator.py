import json
import subprocess
import os
import pytest

def run_node_evaluator(js_code):
    cmd = ["node", "-e", js_code]
    env = os.environ.copy()
    env["EVALUATOR_PROVIDER"] = "mock"
    result = subprocess.run(cmd, capture_output=True, text=True, cwd="D:\\Antigravity_ECG\\ai-task-evaluator", env=env)
    assert result.returncode == 0, f"Node execution failed: {result.stderr}"
    return json.loads(result.stdout.strip())

def test_mock_evaluator_schema_validity():
    js = """
    import('./app/lib/evaluator.js').then(async (m) => {
      const res = await m.evaluateCode({
        description: 'Test task',
        code: 'function add(a, b) { return a + b; }',
        language: 'javascript'
      });
      const validation = m.validateEvaluationSchema(res);
      console.log(JSON.stringify({ res, validation }));
    });
    """
    output = run_node_evaluator(js)
    assert output["validation"]["valid"] is True, f"Validation error: {output['validation'].get('error')}"
    
    res = output["res"]
    assert 0 <= res["score"] <= 100
    assert "criteria" in res
    for crit in ["correctness", "readability", "efficiency", "security_edge_cases"]:
        assert crit in res["criteria"]
        assert 1 <= res["criteria"][crit]["score"] <= 5
        assert isinstance(res["criteria"][crit]["justification"], str)
    
    assert len(res["strengths"]) > 0
    assert len(res["improvements"]) > 0
    assert isinstance(res["refactored_code"], str)

def test_schema_validator_rejects_missing_fields():
    js = """
    import('./app/lib/evaluator.js').then((m) => {
      const invalidData = { score: 80 }; // missing criteria, strengths, etc.
      const validation = m.validateEvaluationSchema(invalidData);
      console.log(JSON.stringify({ validation }));
    });
    """
    output = run_node_evaluator(js)
    assert output["validation"]["valid"] is False
    assert "error" in output["validation"]

def test_schema_validator_rejects_out_of_bounds_score():
    js = """
    import('./app/lib/evaluator.js').then((m) => {
      const invalidData = {
        score: 150,
        criteria: {
          correctness: { score: 4, justification: 'ok' },
          readability: { score: 4, justification: 'ok' },
          efficiency: { score: 4, justification: 'ok' },
          security_edge_cases: { score: 4, justification: 'ok' }
        },
        strengths: ['a'],
        improvements: ['b'],
        refactored_code: 'code'
      };
      const validation = m.validateEvaluationSchema(invalidData);
      console.log(JSON.stringify({ validation }));
    });
    """
    output = run_node_evaluator(js)
    assert output["validation"]["valid"] is False
    assert "score" in output["validation"]["error"]