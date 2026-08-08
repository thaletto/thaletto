import Link from 'next/link'


// The two doorways, greeting visitors who never look at the dock:
// analog vignettes on soft neumorphic cards — manuscript pages for
// writing, blueprint paper for projects.
export function NavCards({
  postCount,
  projectCount,
}: {
  postCount: number
  projectCount: number
}) {
  return (
    <div className="nav-cards">
      <Link
        href='/blog'
        className="nav-card enter-swing"
        style={{ '--enter-delay': '140ms' } as React.CSSProperties}
      >
        <span className="nc-vignette nc-sheets" aria-hidden>
          <span />
          <span />
          <span />
        </span>
        <span className="nc-label">Writing</span>
        <span className="nc-sub">{postCount} posts</span>
      </Link>

      <Link
        href='/projects'
        className="nav-card enter-swing"
        style={{ '--enter-delay': '190ms' } as React.CSSProperties}
      >
        <span className="nc-vignette" aria-hidden>
          <span className="nc-project-icon">
            <svg className="nc-construction-guides" viewBox="0 0 52 52" preserveAspectRatio="xMidYMid meet">
              <g className="nc-guide-solid" fill="none">
                <path d="M26 0V52M0 26H52M0 0L52 52M52 0L0 52" />
                <circle cx="26" cy="26" r="21" />
              </g>
            </svg>
            {/* grouped so hover pulls the tools apart — an exploded diagram */}
            <svg className="nc-project-mark" viewBox="0 0 18 18" width="30" height="30">
              <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" stroke="currentColor">
                <g className="nc-explode-a">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M14.1711 6.85988L11.1411 3.8299L3.766 11.205C2.82897 12.142 2.263 15.6755 2.25119 15.7498C2.2504 15.7499 2.25 15.75 2.25 15.75L2.251 15.751C2.251 15.751 2.25106 15.7506 2.25119 15.7498C2.32546 15.738 5.85897 15.172 6.796 14.235L14.1711 6.85988Z"
                    fill="currentColor"
                    fillOpacity="0.3"
                    stroke="none"
                  />
                  <path d="M2.25 15.75C2.25 15.75 5.849 15.182 6.796 14.235C7.743 13.288 15.373 5.65799 15.373 5.65799C16.21 4.82099 16.21 3.46399 15.373 2.62799C14.536 1.79099 13.179 1.79099 12.343 2.62799C12.343 2.62799 4.713 10.258 3.766 11.205C2.819 12.152 2.251 15.751 2.251 15.751L2.25 15.75Z" />
                  <path d="M11.121 3.84802L14.152 6.87902" />
                </g>
                <g className="nc-explode-b">
                  <path d="M9.53299 5.43699L6.20199 2.10599C5.81099 1.71499 5.17799 1.71499 4.78799 2.10599L2.10599 4.78799C1.71499 5.17899 1.71499 5.81199 2.10599 6.20199L5.43699 9.53299" />
                  <path d="M3.41599 7.513L5.18398 5.745" />
                </g>
                <g className="nc-explode-c">
                  <path d="M10.487 14.584L12.255 12.816" />
                  <path d="M8.46698 12.563L11.798 15.894C12.189 16.285 12.822 16.285 13.212 15.894L15.894 13.212C16.285 12.821 16.285 12.188 15.894 11.798L14.685 10.589" />
                </g>
              </g>
            </svg>
          </span>
        </span>
        <span className="nc-label">Projects</span>
        <span className="nc-sub">{projectCount} projects</span>
      </Link>
    </div>
  )
}
