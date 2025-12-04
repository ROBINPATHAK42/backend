export default function Logo() {
  return (
    <a href="/" className="flex items-center gap-2 font-bold text-lg">
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white shadow-soft">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 5v14l11-7L8 5z" fill="currentColor"></path>
        </svg>
      </span>
      <span><span className="text-primary">Viral</span>ClipCatch</span>
    </a>
  )
}
