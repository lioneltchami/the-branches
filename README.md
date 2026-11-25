# The Branches

Home fellowship in Calgary homes every Saturday, 7–9 pm Mountain Time. People also join online. Led by Pastor Cheryl Outten.

[https://lioneltchami.github.io/the-branches/](https://lioneltchami.github.io/the-branches/)

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Notes

- Contact form (`src/App.tsx`): while `CONTACT_ENDPOINT` is `''`, it opens a `mailto:` draft to `CONTACT_EMAIL` (currently the placeholder `REPLACE-WITH-REAL-INBOX@example.com`) and says nothing was sent until the visitor presses send. Set `CONTACT_ENDPOINT` to any URL that accepts a JSON `POST` (a Formspree form URL, for example) and the form submits directly, shows "Message sent" only on a 2xx response, and falls back to the mail draft if the request fails. Update `CONTACT_EMAIL` when a real inbox exists.
- YouTube and book links are set in the same file (`YOUTUBE`, `BOOK`).
