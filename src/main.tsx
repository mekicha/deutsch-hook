import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { accepts, phrases, scenes, readProgress, type Route } from "./game";
import "./style.css";
function Streets() {
  return (
    <div className="streets" aria-hidden="true">
      <div className="bunting">▼ ▽ ▼ ▽ ▼ ▽ ▼ ▽ ▼</div>
      <div className="moon">✦</div>
      <div className="house pink">
        <i />
        <i />
        <i />
        <i />
        <span>BLUMEN</span>
      </div>
      <div className="house yellow">
        <i />
        <i />
        <i />
        <i />
        <span>OTTO’S BÄCKEREI</span>
        <div className="awning" />
      </div>
      <div className="house sage">
        <i />
        <i />
        <i />
        <i />
        <span>KAFFEE</span>
      </div>
      <div className="pretzel">🥨</div>
      <div className="street-label">BERLIN · ONE PRETZEL. TWO WAYS IN.</div>
    </div>
  );
}
function App() {
  const [p, setP] = useState(readProgress);
  const [book, setBook] = useState(false);
  const [answer, setAnswer] = useState("");
  const [tries, setTries] = useState(0);
  const [hint, setHint] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [correct, setCorrect] = useState(false);
  const [storage, setStorage] = useState(true);
  const input = useRef<HTMLInputElement>(null);
  const bookButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    try {
      localStorage.setItem("deutsch-caper-v1", JSON.stringify(p));
    } catch {
      setStorage(false);
    }
  }, [p]);
  useEffect(() => {
    setAnswer("");
    setTries(0);
    setHint(0);
    setFeedback("");
    setCorrect(false);
    input.current?.focus();
  }, [p.step, p.route, p.screen]);
  useEffect(() => {
    if (book) closeButton.current?.focus();
  }, [book]);
  const route = p.route || "hook",
    scene = scenes[Math.floor(p.step / 2)],
    phrase = phrases[p.step];
  function choose(r: Route) {
    setP({ ...p, route: r, step: 0, screen: "play" });
  }
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!answer.trim()) return;
    if (accepts(p.step, answer)) {
      setCorrect(true);
      setFeedback("✓ Genau! That’s right. " + phrase.en);
      setP((s) => ({
        ...s,
        learned: Array.from(new Set([...s.learned, s.step])),
      }));
    } else {
      setTries(tries + 1);
      setFeedback("Not quite yet — " + phrase.tip + " Give it another go.");
      input.current?.focus();
    }
  }
  function next() {
    if (p.step === 5)
      setP({
        ...p,
        screen: "ending",
        completed: Array.from(new Set([...p.completed, route])),
      });
    else setP({ ...p, step: p.step + 1 });
  }
  function closeBook() {
    setBook(false);
    bookButton.current?.focus();
  }
  return (
    <>
      <header>
        <a
          className="brand"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setP({ ...p, screen: "title" });
          }}
        >
          <span>🥨</span> HOOK <em>or</em> CROOK <small>DEUTSCH!</small>
        </a>
        <button
          ref={bookButton}
          className="book-button"
          onClick={() => setBook(true)}
        >
          ▤ <span>Phrasebook</span> <b>{p.learned.length}/6</b>
        </button>
      </header>
      <main>
        {p.screen === "title" ? (
          <section className="hero">
            <div className="hero-copy">
              <div className="eyebrow">A LITTLE GERMAN. A LITTLE MISCHIEF.</div>
              <h1>
                By Hook
                <br />
                or Crook<span>: Deutsch!</span>
              </h1>
              <p className="lede">
                Big pretzel. Small crime.
                <br />
                Your first German adventure.
              </p>
              <p>
                Berlin’s golden pretzel has vanished. Charm your way in or
                follow the crumbs — and pick up a little German along the way.
              </p>
              <button
                className="primary"
                onClick={() =>
                  setP({
                    ...p,
                    screen:
                      p.route &&
                      p.learned.length > 0 &&
                      p.completed.length === 0
                        ? "play"
                        : "intro",
                  })
                }
              >
                {p.route && p.learned.length > 0 && p.completed.length === 0
                  ? "Continue Mission"
                  : "Start Mission"}{" "}
                <span>↗</span>
              </button>
              <div className="details">
                5–10 MINUTES <span>✦</span> ABSOLUTE BEGINNERS <span>✦</span> NO
                PRESSURE
              </div>
              {p.completed.length > 0 && (
                <p className="stamp">
                  ✓ Case solved via {p.completed.join(" & ")}. Another caper?
                </p>
              )}
            </div>
            <Streets />
            <div className="case-strip">
              <span className="case-number">CASE FILE 001</span>
              <h2>The Case of the Missing Golden Pretzel</h2>
              <span>
                Berlin needs a hero.
                <br />
                You’ll do nicely.
              </span>
            </div>
          </section>
        ) : p.screen === "intro" ? (
          <section className="intro">
            <div className="eyebrow">CASE FILE 001 · YOUR BRIEFING</div>
            <h1>A festival in a twist.</h1>
            <p className="lede">
              The centerpiece is missing. The mayor is stress-eating mustard.
            </p>
            <p>
              Find a lead, reach Otto’s bakery, and bring the golden pretzel
              home. You’ll type six useful German phrases. Mistakes are welcome;
              hints are on the house.
            </p>
            <h2>How will you crack the case?</h2>
            <div className="routes">
              {(["hook", "crook"] as Route[]).map((r) => (
                <button
                  key={r}
                  className="route-card"
                  onClick={() => choose(r)}
                >
                  <span className="route-icon">
                    {r === "hook" ? "🎩" : "🔎"}
                  </span>
                  <small>
                    {r === "hook" ? "THE GIFT OF THE GAB" : "FOLLOW THE CRUMBS"}
                  </small>
                  <h3>
                    The {r === "hook" ? "Hook" : "Crook"} <span>↗</span>
                  </h3>
                  <p>
                    {r === "hook"
                      ? "A little charm. Impeccable manners. Talk your way to the truth."
                      : "A curious eye. A quiet shortcut. Uncover a very floury trail."}
                  </p>
                </button>
              ))}
            </div>
            <p className="footnote">
              Two routes, the same six phrases. No German experience required.
            </p>
          </section>
        ) : p.screen === "play" ? (
          <section className="mission">
            <div className="mission-top">
              <div className="eyebrow">
                CASE FILE 001 · THE {route.toUpperCase()} ROUTE
              </div>
              <span>{Math.floor(p.step / 2) + 1} OF 3 SCENES</span>
            </div>
            <div className="progress">
              {scenes.map((s, i) => (
                <div
                  key={s.title}
                  className={i <= Math.floor(p.step / 2) ? "active" : ""}
                >
                  <span>0{i + 1}</span> {s.title}
                </div>
              ))}
            </div>
            <div className="scene-grid">
              <aside className="scene-art">
                <div className="eyebrow">{scene.place}</div>
                <div className="portrait" aria-hidden="true">
                  {scene.icon}
                </div>
                <h2>{scene.title}</h2>
                <p>{scene.character[route]}</p>
                <div className="speech">{scene.story[route]}</div>
                <span className="mini-mark">✦ BERLIN’S LEAST WANTED ✦</span>
              </aside>
              <div className="challenge">
                <div className="eyebrow">
                  YOUR OBJECTIVE · {(p.step % 2) + 1}/2
                </div>
                <h1>{scene.tasks[p.step % 2]}</h1>
                <p>
                  In German, say: <strong>“{phrase.en}”</strong>
                </p>
                <form onSubmit={submit}>
                  <label htmlFor="response">Your German response</label>
                  <input
                    ref={input}
                    id="response"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="A little German goes a long way…"
                    autoComplete="off"
                    spellCheck={false}
                    disabled={correct}
                  />
                  <div className="form-actions">
                    <button
                      className="primary"
                      disabled={correct || !answer.trim()}
                      type="submit"
                    >
                      Say it <span>→</span>
                    </button>
                    <button
                      type="button"
                      className="text-button"
                      onClick={() => setHint(Math.min(2, hint + 1))}
                    >
                      {hint ? "Reveal full phrase" : "✧ Need a hint?"}
                    </button>
                  </div>
                </form>
                {hint > 0 && (
                  <div className="hint">
                    <strong>
                      {hint === 1 ? "A little nudge" : "The full phrase"}
                    </strong>
                    <p lang="de">{hint === 1 ? phrase.hint : phrase.de}</p>
                    {hint === 2 && (
                      <small>
                        Type it above to practice. Copying is learning, too.
                      </small>
                    )}
                  </div>
                )}
                {feedback && (
                  <div
                    className={"feedback " + (correct ? "success" : "")}
                    role="status"
                  >
                    {feedback}
                    {!correct && tries >= 2 && (
                      <button
                        className="text-button"
                        onClick={() => setHint(2)}
                      >
                        Show me the phrase →
                      </button>
                    )}
                  </div>
                )}
                {correct && (
                  <div className="next">
                    <p>
                      {p.step % 2 === 1
                        ? scene.after[route]
                        : "Nicely done. One more phrase, then we’re on our way."}
                    </p>
                    <button className="primary" onClick={next}>
                      {p.step === 5
                        ? "Return the pretzel"
                        : p.step % 2 === 1
                          ? "Next scene"
                          : "Keep going"}{" "}
                      →
                    </button>
                  </div>
                )}
                <p className="footnote">
                  No lost lives. No lost progress. Just a little practice.
                  <br />
                  Tip: ä → ae, ö → oe, ü → ue also work.
                </p>
              </div>
            </div>
          </section>
        ) : (
          <section className="ending">
            <div className="eyebrow">
              CASE CLOSED · THE {route.toUpperCase()} ROUTE
            </div>
            <div className="trophy" aria-hidden="true">
              🥨
            </div>
            <h1>A golden little victory.</h1>
            <p className="lede">
              Festival saved. German spoken. Pigeon mildly impressed.
            </p>
            <p>{scenes[2].after[route]}</p>
            <div className="learned-summary">
              <h2>Six phrases. Yours to keep.</h2>
              {phrases.map((f) => (
                <div key={f.de}>
                  <strong lang="de">{f.de}</strong>
                  <span>{f.en}</span>
                </div>
              ))}
            </div>
            <button
              className="primary"
              onClick={() => choose(route === "hook" ? "crook" : "hook")}
            >
              Play the {route === "hook" ? "Crook" : "Hook"} route ↗
            </button>
            <p className="stamp">
              ✓ Completed routes: {p.completed.join(" & ")} ·{" "}
              {storage ? "Saved on this browser" : "Session only"}
            </p>
          </section>
        )}
        {!storage && (
          <p className="storage-warning" role="status">
            Browser storage is unavailable. You can play, but progress will only
            last for this session.
          </p>
        )}
      </main>
      <footer>
        <span>MADE OF MISCHIEF & A LITTLE MUSTARD.</span>
        <span>Berlin, with a twist. 🥨</span>
      </footer>
      {book && (
        <div className="modal-backdrop" onClick={closeBook}>
          <div
            className="phrasebook"
            role="dialog"
            aria-modal="true"
            aria-labelledby="book-title"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === "Escape") closeBook();
              if (e.key === "Tab") {
                e.preventDefault();
                closeButton.current?.focus();
              }
            }}
          >
            <button
              ref={closeButton}
              className="close"
              aria-label="Close phrasebook"
              onClick={closeBook}
            >
              ✕
            </button>
            <div className="eyebrow">YOUR POCKET ACCOMPLICE</div>
            <h2 id="book-title">A little phrasebook.</h2>
            <p>
              Try your own answer first, or borrow a phrase whenever you need
              one.
            </p>
            {phrases.map((f, i) => (
              <div className="phrase" key={f.de}>
                <span className="phrase-check">
                  {p.learned.includes(i) ? "✓" : "○"}
                </span>
                <div>
                  <strong lang="de">{f.de}</strong>
                  <p>{f.en}</p>
                </div>
              </div>
            ))}
            <small>
              {p.learned.length} of 6 practiced · Always here to help.
            </small>
          </div>
        </div>
      )}
    </>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
