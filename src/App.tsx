import { Footer } from './components/Footer';
import { Nav } from './components/Nav';
import { About } from './sections/About';
import { Contact } from './sections/Contact';
import { Experience } from './sections/Experience';
import { Hero } from './sections/Hero';
import { Outside } from './sections/Outside';
import { Projects } from './sections/Projects';
import { Skills } from './sections/Skills';

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Nav />

      <main id="main">
        <Hero />
        <About />
        <Projects />
        <Experience />
        <Skills />
        <Outside />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
