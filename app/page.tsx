type Project = {
  name: string;
  label: string;
  summary: string;
  problem: string;
  built: string;
  tools: string[];
  status: string;
  lesson: string;
  note?: string;
  link: {
    label: string;
    href: string;
  };
};

type LinkItem = {
  label: string;
  value: string;
  href?: string;
  note?: string;
};

const projects: Project[] = [
  {
    name: "CallCatch AI",
    label: "AI SaaS product build",
    summary:
      "A missed-call and SMS follow-up assistant for small service businesses that need to capture leads even when the owner is busy.",
    problem:
      "Local service businesses often lose revenue because calls and messages arrive while the owner is on a job, driving, or with a customer.",
    built:
      "I built the product foundation: AI text reply logic, lead capture, customer detail extraction, owner notifications, dashboard views, lead status management, settings, Stripe checkout, Supabase data storage, and Vercel deployment.",
    tools: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Supabase",
      "OpenAI",
      "Twilio",
      "Stripe",
      "Vercel"
    ],
    status:
      "In development. The core architecture and product flow are built, with Twilio live messaging in final integration and compliance setup.",
    lesson:
      "It taught me how to scope an AI product around a real small-business workflow, connect the pieces across payments, data, and messaging, and stay honest about what is ready.",
    link: {
      label: "Visit CallCatch AI",
      href: "https://getcallcatchai.com"
    }
  },
  {
    name: "Zion Sermon BibleGraph",
    label: "Community knowledge system",
    summary:
      "An AI-powered sermon knowledge system that turns church teaching into searchable summaries, Bible references, speaker pages, topic pages, and series pages.",
    problem:
      "I had two years of sermon and Bible study notes, but the knowledge was hard to search, revisit, and share with other people.",
    built:
      "I created a public knowledge site using AI transcription and summarization, Obsidian-style Markdown, structured pages, Quartz publishing, GitHub, and Vercel.",
    tools: [
      "AI transcription",
      "AI summarization",
      "Markdown",
      "Quartz",
      "GitHub",
      "Vercel"
    ],
    status:
      "Live public site with structured sermon pages, topic navigation, speaker pages, series pages, and complete verse references where appropriate.",
    lesson:
      "It taught me that AI projects are strongest when they help a real community access something valuable, not just when they demonstrate a tool.",
    note:
      "This project started as an Obsidian-based Bible knowledge hub before becoming a public Quartz website.",
    link: {
      label: "View live site",
      href: "https://zion-sermon-biblegraph.vercel.app"
    }
  }
];

const businessExperience = [
  "Mobile detailing and local service work shaped how I think about customer expectations, communication, quality, and repeat business.",
  "Clothing and item resale gave me practice with pricing, positioning, negotiation, and follow-through.",
  "Small-business marketing help, including Facebook ad creatives, page setup, and an email campaign, taught me to connect practical offers with the people most likely to need them.",
  "Outdoor construction experience with decks, fences, barns, tools, estimating, and hands-on work helped me understand real operations, timelines, and jobsite problem solving."
];

const communityImpact = [
  {
    title: "Northland CAPS advocacy",
    description:
      "Spoke about the impact of the program and helped advocate for expanded support in front of school board and community stakeholders."
  },
  {
    title: "Church production and worship service",
    description:
      "Served around 500 hours supporting Sunday and Wednesday services through production, worship, setup, and reliable behind-the-scenes work."
  },
  {
    title: "Finance and community internships",
    description:
      "Built early professional experience through organizations including Clay County Economic Development Council and NKC Health, connecting finance, community service, and local institutions."
  }
];

const aiWorkflowParagraphs = [
  "I usually start with a concept in my head, then use AI to help turn it into something real. I use it to brainstorm different angles, make a plan, break the work into smaller steps, write and debug code, understand new tools, and improve how I explain ideas.",
  "My workflow is usually an LLM and a coding agent side-by-side. I use the LLM to think through the project, create detailed prompts for Codex, and break big ideas into small next steps. Then I use Codex to work directly in the codebase.",
  "When something breaks, I paste the error back in, ask what happened, and keep testing until it works. I do not treat AI like magic or blindly trust it. I test the code, ask questions, verify important details, and use my own judgment."
];

const links: LinkItem[] = [
  {
    label: "GitHub",
    value: "Add GitHub URL",
    note: "Placeholder"
  },
  {
    label: "LinkedIn",
    value: "Add LinkedIn URL",
    note: "Placeholder"
  },
  {
    label: "Email",
    value: "Add preferred email",
    note: "Placeholder"
  },
  {
    label: "Resume",
    value: "Add resume PDF",
    note: "Placeholder"
  },
  {
    label: "Zion Sermon BibleGraph",
    value: "Live site",
    href: "https://zion-sermon-biblegraph.vercel.app"
  },
  {
    label: "CallCatch AI",
    value: "Live site",
    href: "https://getcallcatchai.com"
  }
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <section
        id="projects"
        className="border-y border-[var(--border)] bg-[var(--surface)]"
      >
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
          <SectionIntro
            eyebrow="Featured projects"
            title="Practical AI builds with real audiences in mind."
            description="These projects are built around service businesses, churches, and communities rather than abstract demos."
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project.name} project={project} />
            ))}
          </div>
        </div>
      </section>
      <section id="operator" className="bg-[var(--background)]">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:py-20">
          <SectionIntro
            eyebrow="Practical business experience"
            title="Learning business by doing."
            description="Side hustles, local service work, resale, marketing help, and construction taught me how real customers, timing, service quality, and follow-through actually work."
          />
          <div className="grid gap-3">
            {businessExperience.map((item) => (
              <div
                key={item}
                className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5"
              >
                <p className="text-sm leading-6 text-[var(--ink-soft)]">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section
        id="community"
        className="border-y border-[var(--border)] bg-[var(--surface-strong)]"
      >
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
          <SectionIntro
            eyebrow="Community impact"
            title="Service and leadership have shaped the kind of builder I want to become."
            description="I care about tools that help real people, and that comes from work in school, church, and community environments."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {communityImpact.map((item) => (
              <article
                key={item.title}
                className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5"
              >
                <h3 className="text-base font-semibold text-[var(--foreground)]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section id="ai-workflow" className="bg-[var(--background)]">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:py-20">
          <SectionIntro
            eyebrow="How I work with AI"
            title="I use AI to help bring ideas to life, then I test what it builds."
            description="AI helps me move faster, learn new tools, understand code, design systems, test ideas, and take action on ideas that would have stayed stuck in my head."
          />
          <div className="grid gap-4">
            <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
              <div className="grid gap-4">
                {aiWorkflowParagraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-sm leading-6 text-[var(--ink-soft)]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            <p className="rounded-lg border border-[var(--border)] bg-[var(--surface-strong)] p-5 text-sm font-medium leading-6 text-[var(--accent-dark)]">
              CallCatch AI and Zion Sermon BibleGraph are both projects I could
              not have built at this level without Codex and AI-assisted
              development.
            </p>
          </div>
        </div>
      </section>
      <section
        id="links"
        className="border-t border-[var(--border)] bg-[var(--foreground)] text-[var(--surface)]"
      >
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#b8d6d4]">
                Links and contact
              </p>
              <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl">
                The next step is simple: connect the real links and keep the
                story current.
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-6 text-[#d8d1c5]">
                I am looking for environments where I can keep building,
                learning quickly, serving people well, and turning AI into
                practical tools.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {links.map((item) => (
                <LinkPill key={item.label} item={item} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[rgba(247,245,240,0.9)] backdrop-blur">
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8"
      >
        <a href="#top" className="text-sm font-semibold">
          Cameron Wansing
        </a>
        <div className="hidden items-center gap-5 text-sm text-[var(--muted)] sm:flex">
          <a className="transition hover:text-[var(--foreground)]" href="#projects">
            Projects
          </a>
          <a className="transition hover:text-[var(--foreground)]" href="#operator">
            Experience
          </a>
          <a className="transition hover:text-[var(--foreground)]" href="#community">
            Impact
          </a>
          <a className="transition hover:text-[var(--foreground)]" href="#links">
            Contact
          </a>
        </div>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="bg-[var(--background)]">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 pb-16 pt-14 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:pb-20 lg:pt-20">
        <div>
          <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] text-[var(--foreground)] sm:text-6xl lg:text-7xl">
            Cameron Wansing
          </h1>
          <p className="mt-5 text-xl font-medium leading-8 text-[var(--ink-soft)] sm:text-2xl">
            AI Builder · Community Problem Solver · Hands-On Business
            Experience
          </p>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
            I build practical AI tools and knowledge systems that help small
            businesses, churches, and communities solve real problems.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#projects"
              className="rounded-md bg-[#141414] px-5 py-3 text-center text-sm font-semibold !text-[#fffdf8] transition hover:bg-[var(--accent-dark)] hover:!text-[#fffdf8]"
            >
              View Projects
            </a>
            <a
              href="#links"
              className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-5 py-3 text-center text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)]"
            >
              Contact
            </a>
            <span className="rounded-md border border-dashed border-[var(--border)] px-5 py-3 text-center text-sm font-semibold text-[var(--muted)]">
              GitHub URL needed
            </span>
          </div>
        </div>
        <aside className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 lg:self-end">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent-dark)]">
            Focus
          </p>
          <div className="mt-5 grid gap-4">
            <StatLine label="Building" value="AI tools for real workflows" />
            <StatLine label="Serving" value="Church, school, and community" />
            <StatLine label="Learning" value="Fast, practical, and coachable" />
          </div>
        </aside>
      </div>
    </section>
  );
}

function SectionIntro({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent-dark)]">
        {eyebrow}
      </p>
      <h2 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight text-[var(--foreground)] sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]">
        {description}
      </p>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-[var(--border)] bg-[var(--background)] p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--accent-dark)]">
            {project.label}
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
            {project.name}
          </h3>
        </div>
        <a
          href={project.link.href}
          target="_blank"
          rel="noreferrer"
          className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-center text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)]"
        >
          {project.link.label}
        </a>
      </div>
      <p className="mt-5 text-sm leading-6 text-[var(--ink-soft)]">
        {project.summary}
      </p>
      <div className="mt-6 grid gap-4">
        <ProjectDetail label="Problem" value={project.problem} />
        <ProjectDetail label="What I built" value={project.built} />
        <ProjectDetail label="Current status" value={project.status} />
        <ProjectDetail label="What it taught me" value={project.lesson} />
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {project.tools.map((tool) => (
          <span
            key={tool}
            className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--muted)]"
          >
            {tool}
          </span>
        ))}
      </div>
      {project.note ? (
        <p className="mt-6 border-t border-[var(--border)] pt-5 text-sm leading-6 text-[var(--muted)]">
          {project.note}
        </p>
      ) : null}
    </article>
  );
}

function ProjectDetail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent-dark)]">
        {label}
      </h4>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{value}</p>
    </div>
  );
}

function StatLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-[var(--border)] pt-4 first:border-t-0 first:pt-0">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
        {label}
      </p>
      <p className="mt-1 text-base font-semibold text-[var(--foreground)]">
        {value}
      </p>
    </div>
  );
}

function LinkPill({ item }: { item: LinkItem }) {
  const content = (
    <>
      <span className="text-sm font-semibold">{item.label}</span>
      <span className="text-sm text-[#d8d1c5]">{item.value}</span>
      {item.note ? (
        <span className="text-xs font-medium uppercase tracking-[0.16em] text-[#9cc7c4]">
          {item.note}
        </span>
      ) : null}
    </>
  );

  if (item.href) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noreferrer"
        className="flex min-h-28 flex-col justify-between rounded-lg border border-[#4a4944] bg-[#23231f] p-5 !text-[#fffdf8] transition hover:border-[#9cc7c4] hover:!text-[#fffdf8]"
      >
        {content}
      </a>
    );
  }

  return (
    <div className="flex min-h-28 flex-col justify-between rounded-lg border border-dashed border-[#4a4944] bg-[#20201d] p-5 !text-[#fffdf8]">
      {content}
    </div>
  );
}
