self.onmessage = function (e) {
  const { code, testCases } = e.data;

  let solution;
  try {
    const wrapped = `${code}\nreturn typeof solution !== 'undefined' ? solution : null;`;
    solution = new Function(wrapped)();
  } catch (err) {
    self.postMessage({
      status: 'ERROR',
      error: 'Помилка синтаксису: ' + err.message,
      results: [],
    });
    return;
  }

  if (typeof solution !== 'function') {
    self.postMessage({
      status: 'ERROR',
      error: "Функція з назвою 'solution' не визначена. Переконайтеся, що ваш код описує функцію solution.",
      results: [],
    });
    return;
  }

  const results = [];
  let allPassed = true;

  for (const tc of testCases) {
    try {
      const args = JSON.parse(tc.input);
      const expected = JSON.parse(tc.expectedOutput);
      const actual = solution(...args);

      const passed = JSON.stringify(actual) === JSON.stringify(expected);
      if (!passed) allPassed = false;

      results.push({
        id: tc.id,
        passed,
        input: tc.input,
        expected: tc.expectedOutput,
        actual: safeStringify(actual),
        isHidden: tc.isHidden,
      });
    } catch (err) {
      allPassed = false;
      results.push({
        id: tc.id,
        passed: false,
        input: tc.input,
        expected: tc.expectedOutput,
        error: err.message,
        isHidden: tc.isHidden,
      });
    }
  }

  self.postMessage({
    status: allPassed ? 'PASSED' : 'FAILED',
    results,
  });
};

function safeStringify(value) {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}
