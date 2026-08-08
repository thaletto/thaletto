// Duotone dock icons (18×18, currentColor with 30% fills)

function Base({ children }: { children: React.ReactNode }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" stroke="currentColor">
        {children}
      </g>
    </svg>
  )
}

export function WritingIcon() {
  return (
    <Base>
      <circle cx="5.5" cy="5.5" r="2.75" fill="currentColor" opacity=".3" strokeWidth="0" />
      <line x1="15.25" y1="11.75" x2="2.75" y2="11.75" />
      <line x1="9.25" y1="15.25" x2="2.75" y2="15.25" />
      <circle cx="5.5" cy="5.5" r="2.75" />
    </Base>
  )
}

export function ProjectsIcon() {
  return (
    <Base>
      <path d="M10.487 14.584L12.255 12.816" />
      <path d="M8.46698 12.563L11.798 15.894C12.189 16.285 12.822 16.285 13.212 15.894L15.894 13.212C16.285 12.821 16.285 12.188 15.894 11.798L14.685 10.589" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.1711 6.85988L11.1411 3.8299L3.766 11.205C2.82897 12.142 2.263 15.6755 2.25119 15.7498C2.2504 15.7499 2.25 15.75 2.25 15.75L2.251 15.751C2.251 15.751 2.25106 15.7506 2.25119 15.7498C2.32546 15.738 5.85897 15.172 6.796 14.235L14.1711 6.85988Z"
        fill="currentColor"
        fillOpacity="0.3"
        stroke="none"
      />
      <path d="M9.53299 5.43699L6.20199 2.10599C5.81099 1.71499 5.17799 1.71499 4.78799 2.10599L2.10599 4.78799C1.71499 5.17899 1.71499 5.81199 2.10599 6.20199L5.43699 9.53299" />
      <path d="M3.41599 7.513L5.18398 5.745" />
      <path d="M2.25 15.75C2.25 15.75 5.849 15.182 6.796 14.235C7.743 13.288 15.373 5.65799 15.373 5.65799C16.21 4.82099 16.21 3.46399 15.373 2.62799C14.536 1.79099 13.179 1.79099 12.343 2.62799C12.343 2.62799 4.713 10.258 3.766 11.205C2.819 12.152 2.251 15.751 2.251 15.751L2.25 15.75Z" />
      <path d="M11.121 3.84802L14.152 6.87902" />
    </Base>
  )
}

// Owner-dock icons, drawn in the same duotone grammar as the set above.

export function PreferencesIcon() {
  return (
    <Base>
      <path
        d="M11 7.5C12.2426 7.5 13.25 6.49264 13.25 5.25C13.25 4.00736 12.2426 3 11 3C9.75736 3 8.75 4.00736 8.75 5.25C8.75 6.49264 9.75736 7.5 11 7.5Z"
        fill="currentColor"
        fillOpacity="0.3"
        stroke="none"
      />
      <path
        d="M7 15C8.24264 15 9.25 13.9926 9.25 12.75C9.25 11.5074 8.24264 10.5 7 10.5C5.75736 10.5 4.75 11.5074 4.75 12.75C4.75 13.9926 5.75736 15 7 15Z"
        fill="currentColor"
        fillOpacity="0.3"
        stroke="none"
      />
      <path d="M13.25 5.25H16.25" />
      <path d="M1.75 5.25H8.75" />
      <path d="M11 7.5C12.2426 7.5 13.25 6.49264 13.25 5.25C13.25 4.00736 12.2426 3 11 3C9.75736 3 8.75 4.00736 8.75 5.25C8.75 6.49264 9.75736 7.5 11 7.5Z" />
      <path d="M4.75 12.75H1.75" />
      <path d="M16.25 12.75H9.25" />
      <path d="M7 15C8.24264 15 9.25 13.9926 9.25 12.75C9.25 11.5074 8.24264 10.5 7 10.5C5.75736 10.5 4.75 11.5074 4.75 12.75C4.75 13.9926 5.75736 15 7 15Z" />
    </Base>
  )
}
