/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import styles from "./select.module.css";

import useClickOutside from "../hooks/useClickOutside";

export type SelectOption = {
  label: string;
  value: string | number;
};

type MultipleSelectProps = {
  multiple: true;
  value: SelectOption[];
  onChange: (value: SelectOption[]) => void;
};

type SingleSelectProps = {
  multiple?: false;
  onChange: (value: SelectOption | undefined) => void;
  value?: SelectOption;
};

type SelectProps = {
  options: SelectOption[];
} & (SingleSelectProps | MultipleSelectProps);

export default function Select({
  multiple,
  options,
  onChange,
  value,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setIsOpen(false));

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target != containerRef.current) return;

      switch (e.code) {
        case "Enter":
        case "Space":
          if (!isOpen) {
            setIsOpen(true);
            break;
          }
          // if (!multiple) setIsOpen(false);

          if (isOpen) selectOption(options[highlightedIndex]);
          break;
        case "ArrowUp":
        case "ArrowDown": {
          // open the dropdown if not currently open
          if (!isOpen) {
            setIsOpen(true);
            break;
          }

          const newIndex = highlightedIndex + (e.code === "ArrowDown" ? 1 : -1);
          if (newIndex >= 0 && newIndex < options.length) {
            setHighlightedIndex(newIndex);
          }
          break;
        }
        case "Escape":
          setIsOpen(false);
          break;
      }
    };

    containerRef.current?.addEventListener("keydown", handler);

    return () => containerRef.current?.removeEventListener("keydown", handler);
  }, [isOpen, highlightedIndex, options]);

  function selectOption(option: SelectOption) {
    if (multiple) {
      if (value?.includes(option)) {
        onChange(value.filter((o) => o !== option));
        containerRef.current?.focus();
      } else {
        onChange([...value, option]);
      }
    } else {
      if (option !== value) onChange(option);
      setIsOpen(false);
    }
  }

  function clearOptions() {
    multiple ? onChange([]) : onChange(undefined);
  }

  function isOptionSelected(option: SelectOption) {
    return multiple ? value.includes(option) : option === value;
  }

  return (
    <div
      className={styles.container}
      tabIndex={0}
      onClick={() => setIsOpen((prev) => !prev)}
      ref={containerRef}
      // onBlur={(e) => {
      //   if (e.currentTarget.contains(e.relatedTarget)) return;
      //   setIsOpen(false);
      // }}
    >
      <div className={styles.values}>
        {multiple
          ? value.map((v) => (
              <button
                key={v.value}
                onClick={(e) => {
                  e.stopPropagation();
                  selectOption(v);
                }}
                className={styles.optionBadge}
              >
                {v.label}
              </button>
            ))
          : value?.label}
      </div>
      <button
        className={styles.clearBtn}
        onClick={(e) => {
          e.stopPropagation();
          clearOptions();
        }}
      >
        &times;
      </button>
      <div className={styles.dividor}></div>
      <span aria-hidden className={styles.caret}></span>
      <ul className={`${styles.options} ${isOpen ? styles.open : ""}`}>
        {options.map((option, index) => (
          <li
            className={`${styles.option} ${
              isOptionSelected(option) ? styles.selected : ""
            } ${index === highlightedIndex ? styles.highlighted : ""}`}
            key={option.value}
            onClick={(e) => {
              e.stopPropagation();
              selectOption(option);
            }}
            onMouseEnter={() => setHighlightedIndex(index)}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
