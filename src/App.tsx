import { useEffect, useId, useState, type FormEvent } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import './App.css'

const YOUTUBE = 'https://www.youtube.com/@cheryloutten8100'
const BOOK = 'https://www.cherylbay.com/'
const CONTACT_EMAIL = 'fellowship@thebranches.ca'
const CHANNEL_AVATAR =
  'https://yt3.googleusercontent.com/zBiM0uBWTSGM37dGfC-AePG-HolN4OdJRPSgXy3Dgf-Qf03sPz-B7eKNZxEkxUOPQBPyhtpCwQ=s900-c-k-c0x00ffffff-no-rj'

const VIDEOS = [
  {
    id: '0n2rBHGGJYY',
    title: 'How do you respond to stress',
  },
  {
    id: 'i1xwT8xnk_Q',
    title: 'Finding release during brokenness and pain',
  },
  {
    id: 'cjD9VWG-iKo',
    title: 'The destruction of jealousy',
  },
  {
    id: 'HN853kgLK40',
    title: 'Twisted or acceptable? How do your conversations rank before the Lord?',
  },
] as const

const FAQ = [
  {
    q: 'When do you meet?',
    a: 'We gather on Saturdays — in homes around Calgary, and online with friends joining from Africa and North America.',
  },
  {
    q: 'Where do you meet in Calgary?',
    a: 'We rotate through each other’s homes. After you reach out, we’ll share the next gathering details and help you find your place at the table.',
  },
  {
    q: 'Can I join online from another country?',
    a: 'Yes. Believers already join from across Africa and North America. Tell us where you are and we’ll send the online connection for the next Saturday.',
  },
  {
    q: 'What should I expect as a first-time guest?',
    a: 'Warm welcome, open Bibles, shared prayer, and honest conversation. No stage performance — just fellowship in the way of Acts.',
  },
  {
    q: 'Do I need to commit before I come?',
    a: 'No. Come once, listen, pray with us, and see if The Branches feels like home. Belonging grows naturally.',
  },
] as const

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
}

function App() {
  const reduceMotion = useReducedMotion()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [sent, setSent] = useState(false)
  const [openFaq, setOpenFaq] = useState(0)
  const faqId = useId()

  const [showSticky, setShowSticky] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 24)
      setShowSticky(y > window.innerHeight * 0.65)
    }
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
        viewport: { once: true, amount: 0.2 },
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
        variants: fadeUp,
      }

  function closeMenu() {
    setMenuOpen(false)
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
            <a href="#new-here">New here</a>
            <a href="#gather">Gather</a>
            <a href="#teachings">Teachings</a>
            <a href="#join" className="nav__cta">
              Plan a visit
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
          <a href="#new-here" onClick={closeMenu}>
            New here
          </a>
          <a href="#gather" onClick={closeMenu}>
            Gather
          </a>
          <a href="#pastor" onClick={closeMenu}>
            Pastor Cheryl
          </a>
          <a href="#teachings" onClick={closeMenu}>
            Teachings
          </a>
          <a href="#faq" onClick={closeMenu}>
            FAQ
          </a>
          <a href="#join" className="nav__cta" onClick={closeMenu}>
            Plan a visit
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
              Home fellowship in Calgary · Online worldwide
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
              Believers meeting in homes on Saturdays — reading the Bible,
              praying, and living as they did in the book of Acts.
            </motion.p>
            <motion.div
              className="hero__actions"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.55 }}
            >
              <a className="btn btn--gold" href="#join">
                Plan a Saturday visit
              </a>
              <a className="btn btn--ghost" href={YOUTUBE} target="_blank" rel="noreferrer">
                Watch Cheryl on YouTube
              </a>
            </motion.div>
          </div>
          <p className="hero__verse">
            <span>“I am the vine; you are the branches.”</span>
            <cite>John 15:5</cite>
          </p>
        </section>

        <div className="whenbar" aria-label="When and where we gather">
          <div className="wrap whenbar__inner">
            <p>
              <strong>Saturdays</strong>
              <span>Weekly rhythm</span>
            </p>
            <p>
              <strong>Calgary homes</strong>
              <span>Alberta, in person</span>
            </p>
            <p>
              <strong>Also online</strong>
              <span>Africa &amp; North America</span>
            </p>
            <a className="whenbar__link" href="#join">
              Get this week’s details →
            </a>
          </div>
        </div>

        <section id="new-here" className="section expect">
          <div className="wrap">
            <motion.div className="section__intro" {...motionProps}>
              <p className="kicker">New here</p>
              <h2>What to expect</h2>
              <p className="section__lede">
                First-time guests often ask the same things. Here is the simple
                path into fellowship with us.
              </p>
            </motion.div>

            <ol className="expect__steps">
              <motion.li {...motionProps} transition={{ duration: 0.7, delay: 0.05 }}>
                <span className="expect__num">01</span>
                <div>
                  <h3>Say hello</h3>
                  <p>Tell us your name and whether you are joining in Calgary or online.</p>
                </div>
              </motion.li>
              <motion.li {...motionProps} transition={{ duration: 0.7, delay: 0.1 }}>
                <span className="expect__num">02</span>
                <div>
                  <h3>Receive the next gathering details</h3>
                  <p>
                    We share the Saturday home location or online link — never
                    posted publicly for privacy.
                  </p>
                </div>
              </motion.li>
              <motion.li {...motionProps} transition={{ duration: 0.7, delay: 0.15 }}>
                <span className="expect__num">03</span>
                <div>
                  <h3>Come as you are</h3>
                  <p>
                    Scripture, prayer, and real conversation. Stay as long as
                    you need. Belonging can grow slowly.
                  </p>
                </div>
              </motion.li>
            </ol>

            <motion.div className="expect__cta" {...motionProps}>
              <a className="btn btn--gold" href="#join">
                Plan a visit
              </a>
              <a className="text-link" href="#faq">
                Read common questions
              </a>
            </motion.div>
          </div>
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
              >
                <img
                  src="https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1400&q=80"
                  alt="Warm light in a quiet living room"
                />
                <div className="gather__panel-copy">
                  <h3>Saturdays in each other’s homes</h3>
                  <p>
                    No stage. No program to impress. Believers gathered around
                    the Word — listening, responding, and caring for one another.
                  </p>
                </div>
              </motion.article>

              <motion.article
                className="gather__panel"
                {...motionProps}
                transition={{ duration: 0.75, delay: 0.08 }}
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
                transition={{ duration: 0.75, delay: 0.14 }}
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
              <a className="btn btn--gold reach__cta" href="#join">
                Join from where you are
              </a>
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
              <div className="pastor__frame pastor__frame--avatar">
                <img src={CHANNEL_AVATAR} alt="Pastor Cheryl Outten" />
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
                Watch her messages on YouTube, and sit with her writing on
                grief, presence, and walking with the wounded.
              </p>
              <div className="pastor__links">
                <a className="text-link" href={YOUTUBE} target="_blank" rel="noreferrer">
                  youtube.com/@cheryloutten8100
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
            <motion.div className="section__intro section__intro--split" {...motionProps}>
              <div>
                <p className="kicker">Teachings &amp; writing</p>
                <h2>Grow between Saturdays</h2>
                <p className="section__lede">
                  Recent messages from Pastor Cheryl — plus her book for those
                  learning how to walk with the wounded.
                </p>
              </div>
              <a className="btn btn--outline" href={YOUTUBE} target="_blank" rel="noreferrer">
                Open YouTube channel
              </a>
            </motion.div>

            <div className="video-grid">
              {VIDEOS.map((video, i) => (
                <motion.a
                  key={video.id}
                  className="video-card"
                  href={`https://www.youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noreferrer"
                  {...motionProps}
                  transition={{ duration: 0.65, delay: 0.05 * i }}
                >
                  <div className="video-card__thumb">
                    <img
                      src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                      alt=""
                      loading="lazy"
                    />
                    <span className="play" aria-hidden="true">
                      ▶
                    </span>
                  </div>
                  <h3>{video.title}</h3>
                </motion.a>
              ))}
            </div>

            <motion.a
              className="book-banner"
              href={BOOK}
              target="_blank"
              rel="noreferrer"
              {...motionProps}
            >
              <div>
                <p className="kicker kicker--on-dark">The book</p>
                <h3>What Not to Say</h3>
                <p className="book-banner__sub">How to Walk With The Wounded</p>
                <p>
                  A raw and honest look at what is needed in seasons of grief
                  and pain — for those who hurt, and those learning how to walk
                  beside them.
                </p>
              </div>
              <span className="btn btn--gold">Visit the book site</span>
            </motion.a>
          </div>
        </section>

        <section id="faq" className="section faq">
          <div className="wrap faq__grid">
            <motion.div {...motionProps}>
              <p className="kicker">Questions</p>
              <h2>Before you come</h2>
              <p className="section__lede">
                What people often ask before a first Saturday. Anything else —
                just write us.
              </p>
              <a className="text-link" href="#join">
                Still unsure? Plan a visit
              </a>
            </motion.div>

            <div className="faq__list">
              {FAQ.map((item, index) => {
                const open = openFaq === index
                const panelId = `${faqId}-panel-${index}`
                const buttonId = `${faqId}-button-${index}`
                return (
                  <motion.div className="faq__item" key={item.q} {...motionProps}>
                    <h3>
                      <button
                        type="button"
                        id={buttonId}
                        className="faq__q"
                        aria-expanded={open}
                        aria-controls={panelId}
                        onClick={() => setOpenFaq(open ? -1 : index)}
                      >
                        <span>{item.q}</span>
                        <span className="faq__icon" aria-hidden="true">
                          {open ? '−' : '+'}
                        </span>
                      </button>
                    </h3>
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      hidden={!open}
                      className="faq__a"
                    >
                      <p>{item.a}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        <section id="join" className="section join">
          <div className="wrap join__grid">
            <motion.div {...motionProps}>
              <p className="kicker">Plan a visit</p>
              <h2>There is a place for you</h2>
              <p className="section__lede">
                Whether you are in Calgary or joining online, tell us a little
                about yourself. We will reply with the next Saturday details.
              </p>
              <ul className="join__bullets">
                <li>Saturday home fellowships in Calgary</li>
                <li>Online connection across continents</li>
                <li>Bible reading, prayer, and genuine community</li>
              </ul>
              <div className="join__next">
                <h3>What happens next</h3>
                <p>
                  Someone from The Branches will follow up, share gathering
                  details privately, and welcome you in.
                </p>
              </div>
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
                Send my visit request
              </button>
              {sent ? (
                <p className="form-note" role="status">
                  Your email app should open with the message ready. If it does
                  not, write us at {CONTACT_EMAIL}.
                </p>
              ) : (
                <p className="form-note">
                  Opens your email to {CONTACT_EMAIL}. We look forward to
                  welcoming you.
                </p>
              )}
            </motion.form>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap footer__grid">
          <div className="footer__brand">
            <BranchMark />
            <div>
              <strong>The Branches</strong>
              <p>Fellowship in the way of Acts</p>
            </div>
          </div>
          <div className="footer__when">
            <p>
              <strong>When</strong> Saturdays
            </p>
            <p>
              <strong>Where</strong> Homes in Calgary · Online worldwide
            </p>
            <p>
              <strong>Led by</strong> Pastor Cheryl Outten
            </p>
          </div>
          <div className="footer__meta">
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
              <span aria-hidden="true"> · </span>
              <a href="#faq">FAQ</a>
            </p>
          </div>
        </div>
      </footer>

      <a
        className={`sticky-cta ${showSticky ? 'is-visible' : ''}`}
        href="#join"
      >
        Plan a Saturday visit
      </a>
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
