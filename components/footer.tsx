export function Footer() {
  return (
    <footer className="mt-24 px-0 py-4">
      <div className="flex h-auto flex-row items-center justify-between">
        <a href="https://github.com/a-developer-company" target="_blank">
          <span className="flex items-center gap-2 text-sm text-zinc-500">
            © {new Date().getFullYear()}
            <p>Laxman K R</p>
          </span>
        </a>
      </div>
    </footer>
  );
}
