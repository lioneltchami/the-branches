import { useEffect, useId, useRef, useState, type FormEvent, type MouseEvent } from 'react'
import './App.css'

const YOUTUBE = 'https://www.youtube.com/@cheryloutten8100'
const BOOK = 'https://www.cherylbay.com/'
const CONTACT_EMAIL = 'fellowship@thebranches.ca'

const NAV = [
  { href: '#new-here', label: 'New here' },
  { href: '#gather', label: 'Gather' },
  { href: '#pastor', label: 'Cheryl' },
  { href: '#teachings', label: 'Teachings' },
  { href: '#faq', label: 'FAQ' },
  { href: '#join', label: 'Plan a visit' },
] as const

const VIDEOS = [
  {
    id: '0n2rBHGGJYY',
    title: 'How do you respond to stress',
    src: 'media/cheryl-teaching.jpg',
    width: 404,
    height: 720,
    portrait: true,
  },
  {
    id: 'i1xwT8xnk_Q',
    title: 'Finding release during brokenness and pain',
    src: 'media/release.jpg',
    width: 1080,
    height: 720,
    portrait: false,
  },
  {
    id: 'cjD9VWG-iKo',
    title: 'The destruction of Jealousy',
    src: 'media/jealousy.jpg',
    width: 1080,
    height: 720,
    portrait: false,
  },
  {
    id: 'HN853kgLK40',
    title: 'Twisted or Acceptable! How do your conversations rank before the Lord?',
    src: 'media/conversations.jpg',
    width: 1080,
    height: 720,
    portrait: false,
  },
] as const

const FAQ = [
  {
    q: 'When do you meet?',
    a: 'Every Saturday, 7–9 pm Mountain Time. In homes around Calgary, and online.',
  },
  {
    q: 'Where do you meet in Calgary?',
    a: 'We move between homes. After you write, we send the next address. We don’t post it on this page.',
  },
  {
    q: 'Can I join online from another country?',
    a: 'Yes. People already join from Africa and North America. Tell us where you are and we’ll send the online connection for the next Saturday.',
  },
  {
    q: 'What should I expect the first time?',
    a: 'People will say hello. We read the Bible, pray, and talk. There isn’t a stage.',
  },
  {
    q: 'Do I need to commit before I come?',
    a: 'No. Come once. You don’t have to decide that night whether you’ll come back.',
  },
] as const

function asset(path: string) {
  return `${import.meta.env.BASE_URL}${path}`
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [mailOpened, setMailOpened] = useState(false)
  const [openFaq, setOpenFaq] = useState(0)
  const faqId = useId()
  const toggleRef = useRef<HTMLButtonElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return
    const toggle = toggleRef.current
    const drawer = drawerRef.current
    if (!toggle || !drawer) return
    const links = [...drawer.querySelectorAll<HTMLAnchorElement>('a')]
    const first = links[0]
    const last = links[links.length - 1]
    first?.focus()

    function onKey(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        setMenuOpen(false)
        toggle?.focus()
        return
      }
      if (event.key !== 'Tab' || !first || !last || !toggle) return
      const active = document.activeElement
      if (event.shiftKey && (active === first || active === toggle)) {
        event.preventDefault()
        ;(active === first ? toggle : last).focus()
      } else if (!event.shiftKey && (active === last || active === toggle)) {
        event.preventDefault()
        ;(active === last ? toggle : first).focus()
      }
    }

    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menuOpen])

  useEffect(() => {
    const wide = window.matchMedia('(min-width: 55rem)')
    const closeIfWide = () => {
      if (wide.matches) setMenuOpen(false)
    }
    wide.addEventListener('change', closeIfWide)
    return () => wide.removeEventListener('change', closeIfWide)
  }, [])

  function goTo(event: MouseEvent<HTMLAnchorElement>, href: string) {
    event.preventDefault()
    document.body.style.overflow = ''
    setMenuOpen(false)
    const id = href.slice(1)
    window.history.pushState(null, '', href)
    window.requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ block: 'start' })
      document.getElementById(`${id}-title`)?.focus({ preventScroll: true })
    })
  }

  function handleContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') || '').trim()
    const email = String(data.get('email') || '').trim()
    const place = String(data.get('place') || '').trim()
    const city = String(data.get('city') || '').trim()
    const message = String(data.get('message') || '').trim()
    const lines = [`Name: ${name}`, `Email: ${email}`, `Joining from: ${place}`]
    if (city) lines.push(`City or country: ${city}`)
    lines.push('', message)
    const subject = encodeURIComponent(
      `The Branches — Saturday visit from ${name || 'a friend'}`,
    )
    const body = encodeURIComponent(lines.join('\n'))
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
    setMailOpened(true)
  }

  return (
    <div className="site">
      <a className="skip" href="#main">
        Skip to content
      </a>

      <header className="nav">
        <div className="nav__inner">
          <a className="nav__brand" href="#top" onClick={(event) => goTo(event, '#top')}>
            <BranchMark />
            <span>The Branches</span>
          </a>
          <nav className="nav__links" aria-label="Primary">
            {NAV.map((item) => (
              <a key={item.href} href={item.href} onClick={(event) => goTo(event, item.href)}>
                {item.label}
              </a>
            ))}
          </nav>
          <button
            ref={toggleRef}
            type="button"
            className={`nav__toggle ${menuOpen ? 'is-open' : ''}`}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
          </button>
        </div>
        <div
          ref={drawerRef}
          id="mobile-menu"
          className={`nav__drawer ${menuOpen ? 'is-open' : ''}`}
          hidden={!menuOpen}
        >
          <nav aria-label="Primary">
            {NAV.map((item) => (
              <a key={item.href} href={item.href} onClick={(event) => goTo(event, item.href)}>
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main id="main">
        <section id="top" className="hero">
          <div className="wrap hero__grid">
            <div className="hero__copy">
              <h1 id="top-title" tabIndex={-1}>
                The Branches
              </h1>
              <p className="lede">
                We meet in homes in Calgary to read the Bible and pray. People also join online.
              </p>
              <p className="verse">
                <span>“I am the vine; you are the branches.”</span>
                <cite>John 15:5</cite>
              </p>
              <SaturdayCard />
              <div className="hero__actions">
                <a className="btn" href="#join">
                  Email us about Saturday
                </a>
                <a className="text-link" href={YOUTUBE} target="_blank" rel="noreferrer">
                  Cheryl on YouTube
                  <span className="sr"> (opens in a new tab)</span>
                </a>
              </div>
            </div>
            <figure className="hero__figure">
              <img
                src={asset('media/cheryl-teaching.jpg')}
                width={404}
                height={720}
                alt="Pastor Cheryl Outten speaking, seated by a window."
              />
              <figcaption>From her teaching “How do you respond to stress”.</figcaption>
            </figure>
          </div>
        </section>

        <section id="new-here" className="section">
          <div className="wrap narrow">
            <h2 id="new-here-title" tabIndex={-1}>
              Coming for the first time
            </h2>
            <p>Write to us, and we’ll send what you need for the next Saturday.</p>
            <ol className="steps">
              <li>
                <h3>Say who you are</h3>
                <p>Tell us your name, and whether you’re coming to a home in Calgary or joining online.</p>
              </li>
              <li>
                <h3>Get the next gathering</h3>
                <p>We send the address or the online link. Neither one goes on this page.</p>
              </li>
              <li>
                <h3>Come and see</h3>
                <p>We read, pray, and talk. You can come once and decide later.</p>
              </li>
            </ol>
          </div>
        </section>

        <section id="gather" className="section section--paper">
          <div className="wrap narrow">
            <h2 id="gather-title" tabIndex={-1}>
              When we’re together
            </h2>
            <p>
              We read the Bible and pray, and we talk with each other. There isn’t a stage.
              If you want to come, write to us and we’ll send the home address or the online link.
            </p>
          </div>
        </section>

        <section id="pastor" className="section">
          <div className="wrap narrow">
            <h2 id="pastor-title" tabIndex={-1}>
              Pastor Cheryl Outten
            </h2>
            <p>
              Cheryl leads The Branches and teaches from Scripture. Recent messages are below,
              and the rest are on her YouTube channel.
            </p>
            <p>
              <a className="text-link" href={YOUTUBE} target="_blank" rel="noreferrer">
                Cheryl on YouTube
                <span className="sr"> (opens in a new tab)</span>
              </a>
            </p>
          </div>
        </section>

        <section id="teachings" className="section section--paper">
          <div className="wrap">
            <div className="section__head">
              <h2 id="teachings-title" tabIndex={-1}>
                Recent teachings
              </h2>
              <a className="text-link" href={YOUTUBE} target="_blank" rel="noreferrer">
                Cheryl on YouTube
                <span className="sr"> (opens in a new tab)</span>
              </a>
            </div>
            <div className="videos">
              {VIDEOS.map((video) => (
                <a
                  key={video.id}
                  className={`video ${video.portrait ? 'video--portrait' : ''}`}
                  href={`https://www.youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="video__frame">
                    <img
                      src={asset(video.src)}
                      width={video.width}
                      height={video.height}
                      alt=""
                    />
                    <span className="video__play" aria-hidden="true" />
                  </span>
                  <span className="video__title">{video.title}</span>
                  <span className="sr"> (opens in a new tab)</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="section">
          <div className="wrap faq">
            <div>
              <h2 id="faq-title" tabIndex={-1}>
                Questions
              </h2>
              <p>A few things people ask before a first Saturday.</p>
            </div>
            <div className="faq__list">
              {FAQ.map((item, index) => {
                const open = openFaq === index
                const panelId = `${faqId}-panel-${index}`
                const buttonId = `${faqId}-button-${index}`
                return (
                  <div className="faq__item" key={item.q}>
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
                          {open ? '–' : '+'}
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
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section id="join" className="section section--paper">
          <div className="wrap join">
            <div>
              <h2 id="join-title" tabIndex={-1}>
                Write to us
              </h2>
              <p>
                Send a note if you want the details for the next Saturday. Tell us whether you’re
                coming in Calgary or joining online.
              </p>
              <SaturdayCard />
            </div>
            <form className="form" onSubmit={handleContact}>
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
                <select name="place" required defaultValue="">
                  <option value="" disabled>
                    Choose one
                  </option>
                  <option>Calgary (in person)</option>
                  <option>Elsewhere in Alberta</option>
                  <option>North America (online)</option>
                  <option>Africa (online)</option>
                  <option>Other</option>
                </select>
              </label>
              <label>
                City or country (optional)
                <input name="city" type="text" autoComplete="address-level2" />
              </label>
              <label>
                Message
                <textarea name="message" rows={4} required placeholder="I’d like to come this Saturday." />
              </label>
              <button className="btn btn--block" type="submit">
                Email us about Saturday
              </button>
              {mailOpened ? (
                <p className="form-note" role="status">
                  Your email app should have opened with the note ready. Nothing has been sent yet.
                  If it didn’t open, write to <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
                </p>
              ) : (
                <p className="form-note">
                  This opens an email to <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
                  Nothing is sent until you send it from your mail app.
                </p>
              )}
            </form>
          </div>
        </section>

        <section id="book" className="section book">
          <div className="wrap narrow">
            <h2 id="book-title" tabIndex={-1}>
              What Not to Say
            </h2>
            <p className="book__sub">How to Walk With The Wounded</p>
            <p>
              Cheryl’s book about grief: what helps the person who is hurting, and what helps the
              person walking beside them.
            </p>
            <p>
              <a className="text-link" href={BOOK} target="_blank" rel="noreferrer">
                Read about the book
                <span className="sr"> (opens in a new tab)</span>
              </a>
            </p>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap footer__inner">
          <div className="footer__brand">
            <BranchMark />
            <div>
              <strong>The Branches</strong>
              <p>Led by Pastor Cheryl Outten</p>
            </div>
          </div>
          <p className="footer__links">
            <a href={YOUTUBE} target="_blank" rel="noreferrer">
              Cheryl on YouTube
            </a>
            <a href={BOOK} target="_blank" rel="noreferrer">
              Book
            </a>
            <a href={`mailto:${CONTACT_EMAIL}`}>Email</a>
            <a href="#faq" onClick={(event) => goTo(event, '#faq')}>
              FAQ
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}

function SaturdayCard() {
  return (
    <div className="saturday" role="group" aria-label="When we meet">
      <p className="saturday__day">Every Saturday</p>
      <p className="saturday__time">7–9 pm Mountain Time</p>
      <ul>
        <li>Homes in Calgary</li>
        <li>People also join online</li>
        <li>Pastor Cheryl Outten</li>
      </ul>
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
