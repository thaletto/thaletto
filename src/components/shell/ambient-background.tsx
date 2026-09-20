// Paper grain per the design language: the page reads as a sheet of
// working paper, not a void. The layer is inert and tuned to be noticed
// on the second visit, not the first.
export function AmbientBackground() {
  return (
    <>
      <div aria-hidden className="paper-grain" />
      <div aria-hidden className="viewport-edge-fade viewport-edge-fade-top" />
      <div aria-hidden className="viewport-edge-fade viewport-edge-fade-bottom" />
    </>
  )
}
