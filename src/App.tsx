import { useEffect, useState, type FormEvent } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import './App.css'

const YOUTUBE = 'https://www.youtube.com/@spiritualguidecheryl2682'
const BOOK = 'https://www.cherylbay.com/'
const CONTACT_EMAIL = 'fellowship@thebranches.ca'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
}

function App() {
  const reduceMotion = useReducedMotion()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const motionProps = reduceMotion
    ? {}
    : {
        initial: 'hidden' as const,
        whileInView: 'show' as const,
        viewport: { once: true, amount: 0.25 },
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
        variants: fadeUp,
      }

  function handleContact(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const name = String(data.get('name') || '').trim()
    const email = String(data.get('email') || '').trim()
    const place = String(data.get('place') || '').trim()
    const message = String(data.get('message') || '').trim()
    const subject = encodeURIComponent(`The Branches — hello from ${name || 'a friend'}`)
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nJoining from: ${place}\n\n${message}`,
    )
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
    setSent(true)
  }

  return (
    <div className="site">
      <a className="skip" href="#main">
        Skip to content
      </a>

      <header className={`nav ${scrolled ? 'nav--solid' : ''}`}>
        <div className="nav__inner">
          <a className="nav__brand" href="#top" aria-label="The Branches home">
            <BranchMark />
            <span>The Branches</span>
          </a>
          <nav className="nav__links" aria-label="Primary">
            <a href="#gather">Gather</a>
            <a href="#pastor">Pastor Cheryl</a>
            <a href="#teachings">Teachings</a>
            <a href="#join" className="nav__cta">
              Join us
            </a>
          </nav>
          <button
            type="button"
            className={`nav__toggle ${menuOpen ? 'is-open' : ''}`}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
        <div
          id="mobile-menu"
          className={`nav__drawer ${menuOpen ? 'is-open' : ''}`}
          hidden={!menuOpen}
        >
          <a href="#gather" onClick={() => setMenuOpen(false)}>
            Gather
          </a>
          <a href="#pastor" onClick={() => setMenuOpen(false)}>
            Pastor Cheryl
          </a>
          <a href="#teachings" onClick={() => setMenuOpen(false)}>
            Teachings
          </a>
          <a href="#join" className="nav__cta" onClick={() => setMenuOpen(false)}>
            Join us
          </a>
        </div>
      </header>

      <main id="main">
        <section id="top" className="hero">
          <div className="hero__media" aria-hidden="true">
            <img
              src="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2400&q=80"
              alt=""
              className="hero__img"
            />
            <div className="hero__veil" />
            <div className="hero__grain" />
          </div>
          <div className="hero__content">
            <motion.p
              className="hero__eyebrow"
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              Calgary · Africa · North America
            </motion.p>
            <motion.h1
              className="hero__title"
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              The Branches
            </motion.h1>
            <motion.p
              className="hero__lede"
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4 }}
            >
              A fellowship of believers meeting in homes on Saturdays — reading
              the Bible, praying, and living as they did in the book of Acts.
            </motion.p>
            <motion.div
              className="hero__actions"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.55 }}
            >
              <a className="btn btn--gold" href="#join">
                Come this Saturday
              </a>
              <a className="btn btn--ghost" href={YOUTUBE} target="_blank" rel="noreferrer">
                Watch on YouTube
              </a>
            </motion.div>
          </div>
          <p className="hero__verse">
            <span>“I am the vine; you are the branches.”</span>
            <cite>John 15:5</cite>
          </p>
        </section>

        <section id="gather" className="section gather">
          <div className="wrap">
            <motion.div className="section__intro" {...motionProps}>
              <p className="kicker">How we gather</p>
              <h2>Church as a living room</h2>
              <p className="section__lede">
                We started with a few believers and a simple conviction: do what
                the early church did. Open homes. Open Bibles. Shared prayer.
              </p>
            </motion.div>

            <div className="gather__grid">
              <motion.article
                className="gather__panel gather__panel--feature"
                {...motionProps}
                transition={{ duration: 0.75, delay: 0.05 }}
              >
                <img
                  src="https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1400&q=80"
                  alt="Warm light in a quiet living room"
                />
                <div className="gather__panel-copy">
                  <h3>Saturdays in each other’s homes</h3>
                  <p>
                    No stage. No program to impress. Just believers gathered
                    around the Word — listening, responding, and caring for one
                    another.
                  </p>
                </div>
              </motion.article>

              <motion.article
                className="gather__panel"
                {...motionProps}
                transition={{ duration: 0.75, delay: 0.12 }}
              >
                <h3>Scripture &amp; prayer</h3>
                <p>
                  We read the Bible together and bring our lives before God —
                  thankfulness, needs, healing, and bold faith.
                </p>
              </motion.article>

              <motion.article
                className="gather__panel"
                {...motionProps}
                transition={{ duration: 0.75, delay: 0.18 }}
              >
                <h3>The way of Acts</h3>
                <p>
                  Devoted to the apostles’ teaching, fellowship, breaking bread,
                  and prayer — growing as one body, branch by branch.
                </p>
              </motion.article>
            </div>
          </div>
        </section>

        <section className="section reach" aria-labelledby="reach-title">
          <div className="wrap reach__inner">
            <motion.div {...motionProps}>
              <p className="kicker kicker--on-dark">Near and far</p>
              <h2 id="reach-title">One fellowship, many rooms</h2>
              <p className="section__lede section__lede--on-dark">
                Some of us sit together in Calgary. Others join online from
                across Africa and North America. Distance does not divide the
                table.
              </p>
            </motion.div>
            <motion.ul className="reach__list" {...motionProps}>
              <li>
                <span className="reach__place">Calgary</span>
                <span className="reach__note">On the ground, in homes across Alberta</span>
              </li>
              <li>
                <span className="reach__place">Online</span>
                <span className="reach__note">Believers joining from Africa &amp; North America</span>
              </li>
              <li>
                <span className="reach__place">Saturdays</span>
                <span className="reach__note">Our weekly rhythm of Word and prayer</span>
              </li>
            </motion.ul>
          </div>
        </section>

        <section id="pastor" className="section pastor">
          <div className="wrap pastor__grid">
            <motion.div className="pastor__portrait" {...motionProps}>
              <div className="pastor__frame">
                <img
                  src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1200&q=80"
                  alt="Open Bible resting in soft window light"
                />
              </div>
            </motion.div>
            <motion.div className="pastor__copy" {...motionProps}>
              <p className="kicker">Leadership</p>
              <h2>Pastor Cheryl Outten</h2>
              <p>
                Cheryl shepherds The Branches with a heart for honest faith,
                inner healing, and walking with people through real life. Her
                teaching is raw, warm, and rooted in Scripture — whether you are
                in the room or joining from afar.
              </p>
              <p>
                Through her YouTube channel and her writing, she helps believers
                approach God with courage and care for the wounded with wisdom.
              </p>
              <div className="pastor__links">
                <a className="text-link" href={YOUTUBE} target="_blank" rel="noreferrer">
                  Spiritual Guide Cheryl on YouTube
                </a>
                <a className="text-link" href={BOOK} target="_blank" rel="noreferrer">
                  Read about her book
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="teachings" className="section teachings">
          <div className="wrap">
            <motion.div className="section__intro" {...motionProps}>
              <p className="kicker">Teachings &amp; writing</p>
              <h2>Grow with us between Saturdays</h2>
              <p className="section__lede">
                Watch Pastor Cheryl’s messages and sit with her book on grief,
                presence, and walking with the wounded.
              </p>
            </motion.div>

            <div className="teachings__row">
              <motion.a
                className="teach-card teach-card--video"
                href={YOUTUBE}
                target="_blank"
                rel="noreferrer"
                {...motionProps}
              >
                <div className="teach-card__media">
                  <img
                    src="https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=1200&q=80"
                    alt=""
                  />
                  <span className="play" aria-hidden="true">
                    ▶
                  </span>
                </div>
                <div className="teach-card__body">
                  <p className="kicker">YouTube</p>
                  <h3>Spiritual Guide Cheryl</h3>
                  <p>
                    Teaching on trust, spiritual growth, prayer, and healing —
                    available wherever you are.
                  </p>
                </div>
              </motion.a>

              <motion.a
                className="teach-card teach-card--book"
                href={BOOK}
                target="_blank"
                rel="noreferrer"
                {...motionProps}
                transition={{ duration: 0.75, delay: 0.1 }}
              >
                <div className="teach-card__body">
                  <p className="kicker">The book</p>
                  <h3>What Not to Say</h3>
                  <p className="teach-card__subtitle">How to Walk With The Wounded</p>
                  <p>
                    A raw and honest look at what is needed in seasons of grief
                    and pain — for those who hurt, and those learning how to
                    walk beside them.
                  </p>
                  <span className="text-link">Visit the book site</span>
                </div>
              </motion.a>
            </div>
          </div>
        </section>

        <section id="join" className="section join">
          <div className="wrap join__grid">
            <motion.div {...motionProps}>
              <p className="kicker">Come sit with us</p>
              <h2>There is a place for you</h2>
              <p className="section__lede">
                Whether you are in Calgary or joining online, tell us a little
                about yourself. We will help you find your way into a Saturday
                gathering.
              </p>
              <ul className="join__bullets">
                <li>Saturday home fellowships in Calgary</li>
                <li>Online connection for friends across continents</li>
                <li>Bible reading, prayer, and genuine community</li>
              </ul>
            </motion.div>

            <motion.form className="join__form" onSubmit={handleContact} {...motionProps}>
              <label>
                Name
                <input name="name" type="text" autoComplete="name" required />
              </label>
              <label>
                Email
                <input name="email" type="email" autoComplete="email" required />
              </label>
              <label>
                Where are you joining from?
                <select name="place" defaultValue="Calgary (in person)" required>
                  <option>Calgary (in person)</option>
                  <option>Elsewhere in Alberta</option>
                  <option>North America (online)</option>
                  <option>Africa (online)</option>
                  <option>Other</option>
                </select>
              </label>
              <label>
                Message
                <textarea
                  name="message"
                  rows={4}
                  placeholder="I’d love to join this Saturday…"
                  required
                />
              </label>
              <button className="btn btn--gold btn--block" type="submit">
                Send a note
              </button>
              {sent ? (
                <p className="form-note" role="status">
                  Your email app should open with the message ready. If it does
                  not, write us at {CONTACT_EMAIL}.
                </p>
              ) : (
                <p className="form-note">
                  This sends a note to {CONTACT_EMAIL}. We look forward to
                  welcoming you.
                </p>
              )}
            </motion.form>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap footer__inner">
          <div className="footer__brand">
            <BranchMark />
            <div>
              <strong>The Branches</strong>
              <p>Fellowship in the way of Acts</p>
            </div>
          </div>
          <div className="footer__meta">
            <p>Led by Pastor Cheryl Outten · Alberta, Canada</p>
            <p>
              <a href={YOUTUBE} target="_blank" rel="noreferrer">
                YouTube
              </a>
              <span aria-hidden="true"> · </span>
              <a href={BOOK} target="_blank" rel="noreferrer">
                Book
              </a>
              <span aria-hidden="true"> · </span>
              <a href={`mailto:${CONTACT_EMAIL}`}>Email</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function BranchMark() {
  return (
    <svg className="mark" viewBox="0 0 40 40" aria-hidden="true">
      <path
        d="M20 34V8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M20 16c-6-4.5-10.5-3-13.5 1.5 4.5.8 9 3 13.5 7.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M20 20c6-4.5 10.5-3 13.5 1.5-4.5.8-9 3-13.5 7.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="20" cy="7" r="2" fill="currentColor" />
    </svg>
  )
}

export default App
