export function AmbientBackground() {
	return (
		<div aria-hidden className="ambient-background">
			<div className="paper-grain" />
			<div className="column-guides">
				<span />
				<span />
			</div>
			<div className="edge-fade edge-fade-top" />
			<div className="edge-fade edge-fade-bottom" />
		</div>
	);
}
