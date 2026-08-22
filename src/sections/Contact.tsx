import { useState } from 'react';
import { Reveal } from '../components/Reveal';
import { SectionHeader } from '../components/SectionHeader';
import { contact, profile } from '../data/profile';
import './Contact.css';

type Errors = Partial<Record<'name' | 'email' | 'message', string>>;

export function Contact() {
  const [values, setValues] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const set = (field: keyof typeof values) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): Errors => {
    const next: Errors = {};
    if (!values.name.trim()) next.name = 'Please add your name.';
    if (!values.email.trim()) next.email = 'Please add an email address.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
      next.email = 'That email address does not look right.';
    if (values.message.trim().length < 10)
      next.message = 'A little more detail would help, 10 characters minimum.';
    return next;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) return;

    // No backend here by design — this hands the message to the visitor's own
    // mail client. Swap in a form service (Formspree, Resend, an API route)
    // when you have one.
    const subject = encodeURIComponent(`Portfolio enquiry from ${values.name}`);
    const body = encodeURIComponent(
      `${values.message}\n\n— ${values.name}\n${values.email}`,
    );
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <section className="section" id="contact" aria-labelledby="contact-title">
      <div className="shell">
        <SectionHeader sector="06" title={contact.title} id="contact-title" />

        <div className="contact">
          <div className="contact__aside">
            <Reveal>
              <p className="contact__message">{contact.message}</p>
            </Reveal>

            <Reveal delay={80}>
              <ul className="contact__links">
                <li>
                  <span className="label">Email</span>
                  <a className="link" href={`mailto:${profile.email}`}>
                    {profile.email}
                  </a>
                </li>
                <li>
                  <span className="label">GitHub</span>
                  <a
                    className="link"
                    href={profile.links.github}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {profile.links.github.replace('https://', '')}
                    <span aria-hidden="true">↗</span>
                  </a>
                </li>
                <li>
                  <span className="label">LinkedIn</span>
                  <a
                    className="link"
                    href={profile.links.linkedin}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {profile.links.linkedin.replace('https://www.', '')}
                    <span aria-hidden="true">↗</span>
                  </a>
                </li>
              </ul>
            </Reveal>
          </div>

          <Reveal delay={120} className="contact__form-wrap">
            <form className="form" onSubmit={onSubmit} noValidate>
              <div className="form__row">
                <label htmlFor="cf-name">Name</label>
                <input
                  id="cf-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={values.name}
                  onChange={set('name')}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'cf-name-err' : undefined}
                />
                {errors.name ? (
                  <p className="form__err" id="cf-name-err">
                    {errors.name}
                  </p>
                ) : null}
              </div>

              <div className="form__row">
                <label htmlFor="cf-email">Email</label>
                <input
                  id="cf-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={set('email')}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'cf-email-err' : undefined}
                />
                {errors.email ? (
                  <p className="form__err" id="cf-email-err">
                    {errors.email}
                  </p>
                ) : null}
              </div>

              <div className="form__row">
                <label htmlFor="cf-message">Message</label>
                <textarea
                  id="cf-message"
                  name="message"
                  rows={5}
                  value={values.message}
                  onChange={set('message')}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'cf-message-err' : undefined}
                />
                {errors.message ? (
                  <p className="form__err" id="cf-message-err">
                    {errors.message}
                  </p>
                ) : null}
              </div>

              <div className="form__actions">
                <button type="submit" className="btn btn--primary">
                  Send message
                  <span aria-hidden="true">→</span>
                </button>
                <p className="form__note" role="status">
                  {sent
                    ? 'Opening your mail client…'
                    : 'Opens in your mail client.'}
                </p>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
