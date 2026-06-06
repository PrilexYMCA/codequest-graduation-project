import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';

export default function CodeEditor({ value, onChange, height = '320px' }) {
  return (
    <CodeMirror
      value={value}
      onChange={onChange}
      extensions={[javascript()]}
      theme={oneDark}
      height={height}
      basicSetup={{
        lineNumbers: true,
        highlightActiveLine: true,
        foldGutter: false,
        indentOnInput: true,
      }}
      style={{ fontSize: 14, fontFamily: '"JetBrains Mono", monospace' }}
    />
  );
}
