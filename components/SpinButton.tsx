export default function SpinButton({ spinning, disabled, onClick }: { spinning: boolean; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || spinning}
      className="group relative w-full overflow-hidden rounded-2xl bg-sauce px-6 py-4 font-display text-2xl font-bold text-white shadow-[0_6px_0_rgb(0_0_0/0.25)] transition active:translate-y-1 active:shadow-[0_2px_0_rgb(0_0_0/0.25)] disabled:cursor-not-allowed disabled:opacity-60 enabled:hover:brightness-110"
    >
      <span className="relative z-10 inline-flex items-center gap-3">
        <svg aria-hidden viewBox="0 0 24 24" className={`h-7 w-7 ${spinning ? 'animate-spin' : 'transition-transform duration-500 group-hover:rotate-180'}`} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12a9 9 0 1 1-2.64-6.36" />
          <path d="M21 3v6h-6" />
        </svg>
        {spinning ? 'Finding a spot…' : 'Pick for me'}
      </span>
    </button>
  )
}
