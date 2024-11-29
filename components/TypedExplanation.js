import { useEffect, useRef } from 'react';
import Typed from 'typed.js';

export default function TypedExplanation({ text }) {
  const el = useRef(null);

  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: [text],
      typeSpeed: 30,
      showCursor: true,
      cursorChar: '|',
      autoInsertCss: true,
    });

    return () => {
      typed.destroy();
    };
  }, [text]);

  return (
    <h2 ref={el} className="text-4xl font-semibold mb-8" style={{ color: '#2D2D2D' }}></h2>
  );
}
