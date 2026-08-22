import { Reveal } from '../components/Reveal';
import { SectionHeader } from '../components/SectionHeader';
import { projects, type Project } from '../data/profile';
import './Projects.css';

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <Reveal as="article" className="proj" delay={index * 80}>
      <div className="proj__rail" aria-hidden="true">
        <span className="proj__index mono">{project.index}</span>
        <span className="proj__rail-line" />
      </div>

      <div className="proj__main">
        <header className="proj__head">
          <p className="proj__cat mono">{project.category}</p>
          <h3 className="proj__name">{project.name}</h3>
          <p className="proj__summary">{project.summary}</p>
        </header>

        <div className="proj__grid">
          <div className="proj__block">
            <p className="label">Problem</p>
            <p>{project.problem}</p>
          </div>
          <div className="proj__block">
            <p className="label">Solution</p>
            <p>{project.solution}</p>
          </div>
          <div className="proj__block proj__block--wide">
            <p className="label">Engineering</p>
            <p>{project.engineering}</p>
          </div>
          {project.result ? (
            <div className="proj__block proj__block--wide">
              <p className="label">Result</p>
              <p>{project.result}</p>
            </div>
          ) : null}
        </div>

        <div className="proj__tech">
          <p className="label">Technologies</p>
          <ul>
            {project.tech.map((t) => (
              <li key={t} className="tag">
                {t}
              </li>
            ))}
          </ul>
        </div>

        <footer className="proj__foot">
          <div className="proj__links">
            {project.github ? (
              <a
                className="link"
                href={project.github}
                target="_blank"
                rel="noreferrer noopener"
              >
                GitHub
                <span aria-hidden="true">↗</span>
              </a>
            ) : null}
            {project.demo ? (
              <a
                className="link"
                href={project.demo}
                target="_blank"
                rel="noreferrer noopener"
              >
                Live demo
                <span aria-hidden="true">↗</span>
              </a>
            ) : (
              <span className="link link--muted">Demo · TODO</span>
            )}
          </div>

          {project.meta?.length ? (
            <ul className="proj__meta mono" aria-hidden="true">
              {project.meta.map((m) => (
                <li key={m.label}>
                  <span>{m.label}</span>
                  <b>{m.value}</b>
                </li>
              ))}
            </ul>
          ) : null}
        </footer>
      </div>

      {/* Telemetry-scan sweep on hover. Decorative only. */}
      <span className="proj__scan" aria-hidden="true" />
    </Reveal>
  );
}

export function Projects() {
  return (
    <section className="section" id="projects" aria-labelledby="projects-title">
      <div className="shell">
        <SectionHeader
          sector="02"
          title="Projects"
          id="projects-title"
          lede="A few things I have built end to end — what the problem was, what I decided, and what it cost."
        />

        <div className="projects">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
