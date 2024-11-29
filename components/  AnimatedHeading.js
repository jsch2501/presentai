import { useEffect, useRef } from 'react';
import Typed from 'typed.js';

export default function AnimatedHeading({ text }) {
  const el = useRef(null);

  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: [text],
      typeSpeed: 50,
      showCursor: false,
    });

    return () => {
      typed.destroy();
    };
  }, [text]);

  return <h1 ref={el} className="text-3xl font-bold text-primary mb-6"></h1>;
}

