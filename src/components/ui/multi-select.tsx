import { useEffect, useRef, useState } from 'react'

interface MultiSelectProps<Value extends string | number> {
  id: string
  label: string
  options: { value: Value; label: string }[]
  selectedValues: Value[]
  onChange: (values: Value[]) => void
  emptyMessage?: string
}

/** Controlled multi-select dropdown. Only the panel's open state is local. */
export function MultiSelect<Value extends string | number>({
  id,
  label,
  options,
  selectedValues,
  onChange,
  emptyMessage = 'No options available.',
}: MultiSelectProps<Value>) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLFieldSetElement>(null)

  useEffect(() => {
    if (!open) return
    panelRef.current?.querySelector('input')?.focus()
    function closeOnOutsideClick(event: PointerEvent) {
      if (event.target instanceof Node && !containerRef.current?.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('pointerdown', closeOnOutsideClick)
    return () => document.removeEventListener('pointerdown', closeOnOutsideClick)
  }, [open])

  return (
    <div
      ref={containerRef}
      className="relative w-full min-w-0 sm:w-72"
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
      }}
      onKeyDown={event => {
        if (event.key === 'Escape' && open) {
          event.preventDefault()
          setOpen(false)
          buttonRef.current?.focus()
        }
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(current => !current)}
        onKeyDown={event => {
          if (event.key === 'ArrowDown') {
            event.preventDefault()
            setOpen(true)
          }
        }}
        className="flex w-full items-center justify-between gap-2 rounded-md border bg-background px-3 py-2 text-left text-sm font-medium hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
      >
        <span>{label}{selectedValues.length > 0 && ` (${selectedValues.length} selected)`}</span>
        <span aria-hidden="true" className={`mr-1 size-2 shrink-0 border-r-2 border-b-2 border-current ${open ? '-rotate-135' : 'rotate-45'}`} />
      </button>
      {open && (
        <fieldset
          id={id}
          ref={panelRef}
          className="absolute inset-x-0 top-full z-20 mt-1 max-h-64 overflow-y-auto rounded-md border bg-background p-1 shadow-md"
        >
          <legend className="sr-only">{label}</legend>
          {options.map(option => (
            <label key={option.value} className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm hover:bg-muted focus-within:bg-muted">
              <input
                type="checkbox"
                checked={selectedValues.includes(option.value)}
                onChange={event => onChange(event.currentTarget.checked
                  ? [...selectedValues, option.value]
                  : selectedValues.filter(value => value !== option.value))}
                className="size-4 shrink-0 accent-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
              />
              <span className="[overflow-wrap:anywhere]">{option.label}</span>
            </label>
          ))}
          {options.length === 0 && <p className="p-2 text-sm text-muted-foreground">{emptyMessage}</p>}
        </fieldset>
      )}
    </div>
  )
}
