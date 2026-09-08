"use client";

import { useEffect, useId, useRef, useState } from "react";

type Option = { value: string; label: string };
type Props = {
  name: string;
  options: Array<Option | string>;
  defaultValue?: string;
  ariaLabel?: string;
  placeholder?: string;
  required?: boolean;
  allowCustom?: boolean;
};

export function GlassSelect({ name, options, defaultValue, ariaLabel, placeholder, required, allowCustom = false }: Props) {
  const items = options.map(option => typeof option === "string" ? { value: option, label: option } : option);
  const initial = defaultValue ?? (allowCustom ? "" : items[0]?.value ?? "");
  if (initial && !items.some(item => item.value === initial)) items.unshift({ value: initial, label: initial });
  const [value, setValue] = useState(initial);
  const [query, setQuery] = useState(items.find(item => item.value === initial)?.label ?? initial);
  const [open, setOpen] = useState(false);
  const [filtering, setFiltering] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const id = useId();
  const visible = filtering ? items.filter(item => `${item.label} ${item.value}`.toLowerCase().includes(query.toLowerCase())) : items;
  function close() {
    setOpen(false);
    if (!allowCustom) setQuery(items.find(item => item.value === value)?.label ?? value);
  }
  function choose(item: Option) {
    setValue(item.value);
    setQuery(item.label);
    setOpen(false);
    setFiltering(false);
  }
  useEffect(() => {
    if (open) document.getElementById(`${id}-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [active, open, id]);

  return <div className="glass-select" ref={root} onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget)) close();
  }}>
    {!allowCustom && <input type="hidden" name={name} value={value} />}
    <div className="glass-combobox-field">
      <input
        className="glass-select-trigger"
        name={allowCustom ? name : undefined}
        value={query}
        role="combobox"
        aria-label={ariaLabel || name}
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-autocomplete="list"
        aria-activedescendant={open && visible[active] ? `${id}-${active}` : undefined}
        autoComplete="off"
        required={required}
        placeholder={placeholder || "Search or select"}
        onFocus={() => { setOpen(true); setFiltering(false); setActive(0); }}
        onClick={() => setOpen(true)}
        onChange={event => { setQuery(event.target.value); if (allowCustom) setValue(event.target.value); setFiltering(true); setActive(0); setOpen(true); }}
        onKeyDown={event => {
          if (event.key === "Escape") { event.preventDefault(); close(); }
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault(); setOpen(true);
            setActive(index => Math.max(0, Math.min(visible.length - 1, index + (event.key === "ArrowDown" ? 1 : -1))));
          }
          if (event.key === "Enter" && open) {
            event.preventDefault(); if (visible[active]) choose(visible[active]); else close();
          }
        }}
      />
      <svg className="glass-combobox-chevron" viewBox="0 0 20 20" aria-hidden="true"><path d="m6 8 4 4 4-4" /></svg>
    </div>
    {open && <ul id={`${id}-list`} className="glass-select-list" role="listbox" aria-label={ariaLabel || name}>
      {visible.map((item, index) => <li key={item.value} id={`${id}-${index}`} role="option" aria-selected={value === item.value} data-active={active === index || undefined}
        onPointerDown={event => event.preventDefault()} onClick={() => choose(item)} onPointerMove={() => setActive(index)}>
        <span>{item.label}</span>{value === item.value && <span aria-hidden="true">✓</span>}
      </li>)}
      {!visible.length && <li role="option" aria-selected={false} aria-disabled="true">{allowCustom ? "Use your typed value" : "No matching options"}</li>}
    </ul>}
  </div>;
}
