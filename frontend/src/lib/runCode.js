import CodeRunner from './codeRunner.js?worker';

const TIMEOUT_MS = 5000;

export function runCode(code, testCases) {
  return new Promise((resolve) => {
    const worker = new CodeRunner();
    const timer = setTimeout(() => {
      worker.terminate();
      resolve({
        status: 'ERROR',
        error: `Перевищено максимальний час виконання (${TIMEOUT_MS / 1000} с). Можливо, у коді є нескінченний цикл.`,
        results: [],
      });
    }, TIMEOUT_MS);

    worker.onmessage = (e) => {
      clearTimeout(timer);
      worker.terminate();
      resolve(e.data);
    };

    worker.onerror = (e) => {
      clearTimeout(timer);
      worker.terminate();
      resolve({
        status: 'ERROR',
        error: e.message || 'Помилка виконання',
        results: [],
      });
    };

    worker.postMessage({ code, testCases });
  });
}
