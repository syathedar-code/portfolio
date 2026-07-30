import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  const lineRef = useRef<HTMLDivElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const text = "$ oops this page didn`t pass the quality checks.";
    const el = lineRef.current!;
    const link = linkRef.current!;

    let i = 0;
    el.innerHTML = "";
    link.classList.remove("visible");

    function typeChar() {
      if (i < text.length) {
        const char = text.charAt(i);
        // Clean line break on mobile screens
        if (window.innerWidth <= 600 && i === 23) {
          el.innerHTML += "<br />";
        }
        el.innerHTML += char === ' ' ? '&nbsp;' : char;
        i++;
        let delay = 60 + Math.random() * 60;
        if (text.charAt(i - 1) === " ") delay += 60;
        setTimeout(typeChar, delay);
      } else {
        link.classList.add("visible");
      }
    }

    const timer = setTimeout(typeChar, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');

        .notfound-page {
          margin: 0;
          padding: 0;
          width: 100vw;
          height: 100dvh;
          background: #000;
          overflow: hidden;
          font-family: 'IBM Plex Mono', ui-monospace, 'SF Mono', monospace;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 9999;
        }

        .notfound-page * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .notfound-page .stage {
          position: relative;
          width: 100%;
          height: 100dvh;
          display: flex;
          justify-content: center;
          align-items: center;
          perspective: 1000px;
          overflow: hidden;
        }

        .notfound-page div {
          transform-style: preserve-3d;
        }

        .notfound-page .rail {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          transform: rotateX(-30deg) rotateY(-30deg) translate3d(-30px, -40px, 0);
          z-index: 1;
          pointer-events: none;
        }

        .notfound-page .rail .stamp {
          position: absolute;
          width: 200px;
          height: 200px;
          display: flex;
          justify-content: center;
          align-items: center;
          background: rgba(20, 20, 20, 1);
          color: #ff1205;
          font-size: 7rem;
          font-family: 'IBM Plex Mono', ui-monospace, 'SF Mono', monospace;
        }

        .notfound-page .rail .stamp:nth-child(1) { animation: nf-stampSlide 40000ms -2300ms linear infinite; }
        .notfound-page .rail .stamp:nth-child(2) { animation: nf-stampSlide 40000ms -4300ms linear infinite; }
        .notfound-page .rail .stamp:nth-child(3) { animation: nf-stampSlide 40000ms -6300ms linear infinite; }
        .notfound-page .rail .stamp:nth-child(4) { animation: nf-stampSlide 40000ms -8300ms linear infinite; }
        .notfound-page .rail .stamp:nth-child(5) { animation: nf-stampSlide 40000ms -10300ms linear infinite; }
        .notfound-page .rail .stamp:nth-child(6) { animation: nf-stampSlide 40000ms -12300ms linear infinite; }
        .notfound-page .rail .stamp:nth-child(7) { animation: nf-stampSlide 40000ms -14300ms linear infinite; }
        .notfound-page .rail .stamp:nth-child(8) { animation: nf-stampSlide 40000ms -16300ms linear infinite; }
        .notfound-page .rail .stamp:nth-child(9) { animation: nf-stampSlide 40000ms -18300ms linear infinite; }
        .notfound-page .rail .stamp:nth-child(10) { animation: nf-stampSlide 40000ms -20300ms linear infinite; }
        .notfound-page .rail .stamp:nth-child(11) { animation: nf-stampSlide 40000ms -22300ms linear infinite; }
        .notfound-page .rail .stamp:nth-child(12) { animation: nf-stampSlide 40000ms -24300ms linear infinite; }
        .notfound-page .rail .stamp:nth-child(13) { animation: nf-stampSlide 40000ms -26300ms linear infinite; }
        .notfound-page .rail .stamp:nth-child(14) { animation: nf-stampSlide 40000ms -28300ms linear infinite; }
        .notfound-page .rail .stamp:nth-child(15) { animation: nf-stampSlide 40000ms -30300ms linear infinite; }
        .notfound-page .rail .stamp:nth-child(16) { animation: nf-stampSlide 40000ms -32300ms linear infinite; }
        .notfound-page .rail .stamp:nth-child(17) { animation: nf-stampSlide 40000ms -34300ms linear infinite; }
        .notfound-page .rail .stamp:nth-child(18) { animation: nf-stampSlide 40000ms -36300ms linear infinite; }
        .notfound-page .rail .stamp:nth-child(19) { animation: nf-stampSlide 40000ms -38300ms linear infinite; }
        .notfound-page .rail .stamp:nth-child(20) { animation: nf-stampSlide 40000ms -40300ms linear infinite; }

        @keyframes nf-stampSlide {
          0% {
            transform: rotateX(90deg) rotateZ(-90deg) translateZ(-200px) translateY(130px);
          }
          100% {
            transform: rotateX(90deg) rotateZ(-90deg) translateZ(-200px) translateY(-3870px);
          }
        }

        .notfound-page .world {
          position: relative;
          z-index: 1;
          transform: rotateX(-30deg) rotateY(-30deg) translate3d(-30px, -40px, 0);
          pointer-events: none;
        }

        .notfound-page .world .forward {
          position: absolute;
          animation: nf-slide 2000ms linear infinite;
        }

        .notfound-page .world .box {
          width: 200px;
          height: 200px;
          transform-origin: 100% 100%;
          animation: nf-roll 2000ms cubic-bezier(1.000, 0.010, 1.000, 1.000) infinite;
        }

        .notfound-page .world .box .wall {
          position: absolute;
          width: 200px;
          height: 200px;
          background: rgba(10, 10, 10, 0.8);
          border: 1px solid rgba(250, 250, 250, 1);
          box-sizing: border-box;
        }

        .notfound-page .world .box .wall::before {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #fff;
          font-size: 7rem;
          font-family: 'IBM Plex Mono', ui-monospace, 'SF Mono', monospace;
        }

        .notfound-page .world .box .wall:nth-child(1) { transform: translateZ(100px); }
        .notfound-page .world .box .wall:nth-child(2) { transform: rotateX(180deg) translateZ(100px); }
        .notfound-page .world .box .wall:nth-child(3) { transform: rotateX(90deg) translateZ(100px); }
        .notfound-page .world .box .wall:nth-child(3)::before {
          transform: rotateX(180deg) rotateZ(90deg) translateZ(-1px);
          animation: nf-zeroFour 4000ms -2000ms linear infinite;
        }
        .notfound-page .world .box .wall:nth-child(4) { transform: rotateX(-90deg) translateZ(100px); }
        .notfound-page .world .box .wall:nth-child(4)::before {
          transform: rotateX(180deg) rotateZ(-90deg) translateZ(-1px);
          animation: nf-zeroFour 4000ms -2000ms linear infinite;
        }
        .notfound-page .world .box .wall:nth-child(5) { transform: rotateY(90deg) translateZ(100px); }
        .notfound-page .world .box .wall:nth-child(5)::before {
          transform: rotateX(180deg) translateZ(-1px);
          animation: nf-zeroFour 4000ms linear infinite;
        }
        .notfound-page .world .box .wall:nth-child(6) { transform: rotateY(-90deg) translateZ(100px); }
        .notfound-page .world .box .wall:nth-child(6)::before {
          transform: rotateX(180deg) rotateZ(180deg) translateZ(-1px);
          animation: nf-zeroFour 4000ms linear infinite;
        }

        @keyframes nf-zeroFour {
          0% { content: '4'; }
          100% { content: '0'; }
        }

        @keyframes nf-roll {
          0% { transform: rotateZ(0deg); }
          85% { transform: rotateZ(90deg); }
          87% { transform: rotateZ(88deg); }
          90% { transform: rotateZ(90deg); }
          100% { transform: rotateZ(90deg); }
        }

        @keyframes nf-slide {
          0% { transform: translateX(0); }
          100% { transform: translateX(-200px); }
        }

        .notfound-page .terminal-text {
          position: absolute;
          top: 30px;
          right: 30px;
          text-align: right;
          font-family: 'IBM Plex Mono', ui-monospace, 'SF Mono', monospace;
          color: #fff;
          z-index: 100;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .notfound-page .terminal-text .line {
          font-size: 1rem;
          letter-spacing: 0.5px;
          line-height: 1.5;
        }

        .notfound-page .terminal-text .line::after {
          content: '_';
          animation: nf-blink 1s step-end infinite;
        }

        @keyframes nf-blink {
          50% { opacity: 0; }
        }

        .notfound-page .terminal-text a.home-link {
          display: inline-block;
          margin-top: 1rem;
          font-family: 'IBM Plex Mono', ui-monospace, 'SF Mono', monospace;
          font-size: 0.9rem;
          color: #fff;
          text-decoration: none;
          border: 1px solid #fff;
          padding: 6px 14px;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.6s ease, background 0.2s ease, color 0.2s ease;
        }

        .notfound-page .terminal-text a.home-link.visible {
          opacity: 1;
          pointer-events: auto;
        }

        .notfound-page .terminal-text a.home-link:hover {
          background: #fff;
          color: #000;
        }

        .notfound-page .terminal-text a.home-link::before {
          content: '> ';
        }

        /* ── Mobile Optimization (≤600px) ── */
        @media (max-width: 600px) {
          .notfound-page .rail,
          .notfound-page .world {
            transform: rotateX(-30deg) rotateY(-30deg) translate3d(0, 80px, 0) scale3d(0.65, 0.65, 0.65);
          }

          .notfound-page .terminal-text {
            top: 20px;
            right: 20px;
            left: 20px;
            width: calc(100% - 40px);
          }

          .notfound-page .terminal-text .line {
            font-size: 0.85rem;
          }

          .notfound-page .terminal-text a.home-link {
            font-size: 0.8rem;
            padding: 5px 12px;
            margin-top: 0.8rem;
          }
        }
      `}</style>

      <div className="notfound-page">
        <div className="stage">
          <div className="rail">
            <div className="stamp four">4</div>
            <div className="stamp zero">0</div>
            <div className="stamp four">4</div>
            <div className="stamp zero">0</div>
            <div className="stamp four">4</div>
            <div className="stamp zero">0</div>
            <div className="stamp four">4</div>
            <div className="stamp zero">0</div>
            <div className="stamp four">4</div>
            <div className="stamp zero">0</div>
            <div className="stamp four">4</div>
            <div className="stamp zero">0</div>
            <div className="stamp four">4</div>
            <div className="stamp zero">0</div>
            <div className="stamp four">4</div>
            <div className="stamp zero">0</div>
            <div className="stamp four">4</div>
            <div className="stamp zero">0</div>
            <div className="stamp four">4</div>
            <div className="stamp zero">0</div>
          </div>

          <div className="world">
            <div className="forward">
              <div className="box">
                <div className="wall"></div>
                <div className="wall"></div>
                <div className="wall"></div>
                <div className="wall"></div>
                <div className="wall"></div>
                <div className="wall"></div>
              </div>
            </div>
          </div>

          <div className="terminal-text">
            <div className="line" ref={lineRef}></div>
            <Link to="/" className="home-link" ref={linkRef}>
              back to home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}