import { useEffect, useId, useRef, useState, type FormEvent, type MouseEvent } from 'react'
import './App.css'

const YOUTUBE = 'https://www.youtube.com/@cheryloutten8100'
const BOOK = 'https://www.cherylbay.com/'
const CONTACT_EMAIL = 'fellowship@thebranches.ca'
const CONTACT_ENDPOINT: string = ''
const ASK_LABEL = CONTACT_ENDPOINT ? 'Ask about Saturday' : 'Email us about Saturday'

type FormStatus = 'idle' | 'sending' | 'sent' | 'drafted' | 'failed'

const NAV = [
  { href: '#new-here', label: 'New here' },
  { href: '#gather', label: 'Gather' },
  { href: '#pastor', label: 'Cheryl' },
  { href: '#teachings', label: 'Teachings' },
  { href: '#faq', label: 'FAQ' },
  { href: '#join', label: 'Write to us' },
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
    a: 'Every Saturday, 7–9 pm Mountain Time. In homes around Calgary, and on Zoom.',
  },
  {
    q: 'Where do you meet in Calgary?',
    a: 'Hosting rotates between members’ homes. After you write, we send the next address. We don’t post it here.',
  },
  {
    q: 'Can I join online from another country?',
    a: 'Yes. Online is through Zoom. People already join from Africa and North America. Tell us where you are and we’ll send the Zoom link for the next Saturday.',
  },
  {
    q: 'How soon do you reply?',
    a: 'Within a day.',
  },
  {
    q: 'Is there a meal?',
    a: 'Yes. During the week members agree on what to cook, and each person brings their dish to the hosting home. On your first Saturday, ask us what to bring when you write.',
  },
  {
    q: 'What about parking, what to wear, and a Bible?',
    a: 'We don’t list those here. Ask in your message and we reply within a day.',
  },
  {
    q: 'What should I expect the first time?',
    a: 'People will say hello. We read the Bible, pray, and talk. There is no stage.',
  },
  {
    q: 'Do I need to commit before I come?',
    a: 'No. Come once. You don’t have to decide that night whether you’ll come back.',
  },
] as const

const GATHERING_PHOTO: { src: string; width: number; height: number; alt: string } | null = null

function readRequest(form: HTMLFormElement) {
  const data = new FormData(form)
  const get = (key: string) => String(data.get(key) || '').trim()
  return {
    name: get('name'),
    email: get('email'),
    joining: get('joining'),
    area: get('area'),
    adults: get('adults'),
    children: get('children'),
    message: get('message'),
  }
}

function draftHref(request: ReturnType<typeof readRequest>) {
  const lines = [
    `Name: ${request.name}`,
    `Email: ${request.email}`,
    `Joining: ${request.joining}`,
  ]
  if (request.area) lines.push(`Area or city: ${request.area}`)
  lines.push(`Adults: ${request.adults}`, `Children: ${request.children}`)
  if (request.message) lines.push('', request.message)
  const subject = encodeURIComponent(`The Branches: Saturday visit from ${request.name || 'a friend'}`)
  return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${encodeURIComponent(lines.join('\n'))}`
}

function asset(path: string) {
  return `${import.meta.env.BASE_URL}${path}`
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [status, setStatus] = useState<FormStatus>('idle')
  const [fallbackHref, setFallbackHref] = useState('')
  const sentRef = useRef<HTMLDivElement>(null)
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

  async function handleContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const request = readRequest(form)
    const href = draftHref(request)
    if (!CONTACT_ENDPOINT) {
      window.location.href = href
      setStatus('drafted')
      return
    }
    setStatus('sending')
    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...request,
          _subject: `The Branches: Saturday visit from ${request.name}`,
        }),
      })
      if (!response.ok) throw new Error(String(response.status))
      form.reset()
      setStatus('sent')
    } catch {
      setFallbackHref(href)
      setStatus('failed')
    }
  }

  useEffect(() => {
    if (status === 'sent') sentRef.current?.focus()
  }, [status])

  return (
    <div className="site">
      <div className="amb-grain" aria-hidden="true" />
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
                Home fellowship in Calgary. We read the Bible, pray, and talk. People also join
                online.
              </p>
              <p className="verse">
                <span>“I am the vine; you are the branches.”</span>
                <cite>John 15:5</cite>
              </p>
              <SaturdayCard />
              <div className="hero__actions">
                <a className="btn" href="#join">
                  {ASK_LABEL}
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
            <p>Write to us. We send the next address or the online link.</p>
            <ol className="steps">
              <li>
                <h3>Say who you are</h3>
                <p>Your name, whether you’re coming to a Calgary home or joining on Zoom, and how many adults and children.</p>
              </li>
              <li>
                <h3>Get the next gathering</h3>
                <p>We reply with the address or the link. Neither one is posted here. Ask what to bring, if anything.</p>
              </li>
              <li>
                <h3>Come that Saturday</h3>
                <p>We read, pray, and talk. One visit is enough; you decide later about returning.</p>
              </li>
            </ol>
          </div>
        </section>

        <section id="gather" className="section section--paper gather">
          <div className="wrap gather__grid">
            <div className="gather__intro">
              <h2 id="gather-title" tabIndex={-1}>
                When we are together
              </h2>
              <p>
                Saturday, 7 to 9 pm, in a member’s home in Calgary or on Zoom. There is no stage.
                Here is what goes into the evening. Write to us and we can tell you how it runs.
              </p>
              <dl className="parts">
                <div>
                  <dt>Hello</dt>
                  <dd>People will say hello.</dd>
                </div>
                <div>
                  <dt>The meal</dt>
                  <dd>Members agree on a menu during the week. Each brings a dish to the home.</dd>
                </div>
                <div>
                  <dt>Scripture and prayer</dt>
                  <dd>We read the Bible, talk about it, and pray. Pastor Cheryl leads.</dd>
                </div>
                <div>
                  <dt>Zoom</dt>
                  <dd>Online is through Zoom. Ask for the link and we send it for the next Saturday.</dd>
                </div>
              </dl>
            </div>
            <aside className="children" aria-labelledby="children-title">
              <h3 id="children-title">Children come too</h3>
              <p>
                Children have their own interactive sessions on the same topic being studied, so
                everyone is on the same page.
              </p>
              <p>Put the number of children in your note when you write.</p>
            </aside>
          </div>
          {GATHERING_PHOTO && (
            <figure className="wrap gather__photo">
              <img
                src={asset(GATHERING_PHOTO.src)}
                width={GATHERING_PHOTO.width}
                height={GATHERING_PHOTO.height}
                alt={GATHERING_PHOTO.alt}
              />
            </figure>
          )}
        </section>

        <section id="pastor" className="section">
          <div className="wrap narrow">
            <h2 id="pastor-title" tabIndex={-1}>
              Pastor Cheryl Outten
            </h2>
            <p>
              Walking into a home you have not been to before can feel like a lot. Cheryl leads
              The Branches and teaches from Scripture. Her recent messages are below, so you can
              hear her teach before you come. More are on her YouTube channel.
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
              <p>What people ask before they write.</p>
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
              <p className="join__note">
                Tell us whether you are coming to a Calgary home or joining on Zoom, and how many
                adults and children. We reply within a day with the address or the Zoom link.
              </p>
            </div>
            {status === 'sent' ? (
              <div className="form form--done" ref={sentRef} tabIndex={-1} role="status">
                <h3>Message sent</h3>
                <p>
                  We have it. We reply within a day with Saturday’s address or the Zoom link.
                </p>
                <button className="text-link" type="button" onClick={() => setStatus('idle')}>
                  Send another
                </button>
              </div>
            ) : (
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
                  How will you join?
                  <select name="joining" required defaultValue="">
                    <option value="" disabled>
                      Choose one
                    </option>
                    <option>In person in Calgary</option>
                    <option>On Zoom</option>
                  </select>
                </label>
                <label>
                  Area of Calgary, or city and country on Zoom (optional)
                  <input name="area" type="text" autoComplete="off" />
                </label>
                <div className="form__row">
                  <label>
                    Adults
                    <input name="adults" type="number" inputMode="numeric" min={1} max={20} defaultValue={1} required />
                  </label>
                  <label>
                    Children
                    <input name="children" type="number" inputMode="numeric" min={0} max={20} defaultValue={0} required />
                  </label>
                </div>
                <label>
                  Message (optional)
                  <textarea name="message" rows={4} placeholder="I’d like to come this Saturday. Questions are welcome." />
                </label>
                <button className="btn btn--block" type="submit" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending…' : CONTACT_ENDPOINT ? 'Send my request' : ASK_LABEL}
                </button>
                {status === 'drafted' && (
                  <p className="form-note" role="status">
                    Your mail app should open with the note drafted. Nothing is sent until you press
                    send there. If nothing opened, write to{' '}
                    <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
                  </p>
                )}
                {status === 'failed' && (
                  <p className="form-note form-note--error" role="alert">
                    That did not send. <a href={fallbackHref}>Open an email draft instead</a>, or
                    write to <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
                  </p>
                )}
                {!CONTACT_ENDPOINT && status !== 'drafted' && (
                  <p className="form-note">
                    This opens a draft to <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
                    Your mail app sends it, not this page.
                  </p>
                )}
              </form>
            )}
          </div>
        </section>

        <section id="book" className="section book">
          <div className="wrap narrow">
            <h2 id="book-title" tabIndex={-1}>
              What Not to Say
            </h2>
            <p className="book__sub">How to Walk With The Wounded</p>
            <p>
              Cheryl wrote this for people in grief, and for the friends walking with them: what
              to say, and what to leave unsaid.
            </p>
            <p>
              <a className="text-link" href={BOOK} target="_blank" rel="noreferrer">
                Read about the book on cherylbay.com
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
      <div className="saturday__head">
        <BranchMark />
        <p className="saturday__day">Every Saturday</p>
      </div>
      <p className="saturday__time">7–9 pm Mountain Time</p>
      <ul>
        <li>Calgary homes; hosting rotates</li>
        <li>Online on Zoom</li>
        <li>Shared meal, planned during the week</li>
        <li>Children join on the same study topic</li>
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
