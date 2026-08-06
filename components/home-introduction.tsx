import { HomeIntroReplay } from '~/components/home-intro-replay'
import {
  EmailCard,
  GitHubCard,
  type GitHubSnapshot,
  type SocialSnapshot,
  XCard,
} from '~/components/social-cards'

function DetailsMark() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      aria-hidden="true"
      focusable="false"
      className="home-details-mark"
    >
      <g
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        stroke="currentColor"
      >
        <ellipse
          cx="9"
          cy="9"
          rx="7.4439"
          ry="4.7786"
          transform="translate(-3.7279 9) rotate(-45)"
          fill="currentColor"
          opacity="0.3"
          strokeWidth="0"
        />
        <path
          d="m14.659,12.9899-1.263-.421-.421-1.2629c-.137-.408-.812-.408-.949,0l-.421,1.2629-1.263.421c-.204.068-.342.259-.342.474s.138.406.342.474l1.263.421.421,1.263c.068.204.26.342.475.342s.406-.138.475-.342l.421-1.263,1.263-.421c.204-.068.342-.259.342-.474s-.139-.406-.343-.474Z"
          strokeWidth="0"
          fill="currentColor"
        />
        <path d="m5.5,2.25.671,2.579,2.579.671-2.579.671-.671,2.579-.671-2.579-2.579-.671,2.579-.671.671-2.579Z" fill="currentColor" />
        <path d="m8.1994,14.9708c-1.7641.5243-3.419.3232-4.4562-.714-.9464-.9464-1.1967-2.4072-.8349-3.9959" />
        <path d="m10.261,2.9083c1.5887-.3618,3.0494-.1114,3.9958.8349,1.2963,1.2963,1.2866,3.5575.187,5.7907" />
        <path
          d="m9.75,10c.4142,0,.75-.3358.75-.75s-.3358-.75-.75-.75-.75.3358-.75.75.3358.75.75.75Z"
          strokeWidth="0"
          fill="currentColor"
        />
      </g>
    </svg>
  )
}

function DetailsPhrase({ children }: { children: React.ReactNode }) {
  return (
    <HomeIntroReplay>
      <DetailsMark />
      {children}
    </HomeIntroReplay>
  )
}

function HomeContact({ social, github }: { social: SocialSnapshot; github: GitHubSnapshot }) {
  return (
    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
      Find me at <XCard data={social} trigger="@thaletto" triggerClassName="home-contact-link" />, on GitHub as{' '}
      <GitHubCard data={github} trigger="thaletto" triggerClassName="home-contact-link" />, or email me at{' '}
      <EmailCard address="krlaxman03@gmail.com" trigger="krlaxman03@gmail.com" triggerClassName="home-contact-link" />
    </p>
  )
}

export function HomeIntroduction({ social, github }: { social: SocialSnapshot; github: GitHubSnapshot }) {
  return (
    <div className="home-introduction">
      <p className="text-sm leading-relaxed text-muted-foreground">
        I’m Laxman, a full-stack developer who enjoys building modern, well-structured apps where things{' '}
        <DetailsPhrase>
          <span className="home-detail-units home-detail-words">
            <span className="home-detail-unit">just</span>
            {' '}
            <span className="home-detail-unit">feel</span>
            {' '}
            <span className="home-detail-unit">right</span>
          </span>
        </DetailsPhrase>
        {" "}from how the UI looks to how the code is organized under the hood.
      </p>
      <HomeContact social={social} github={github} />
    </div>
  )
}
