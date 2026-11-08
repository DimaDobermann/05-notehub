import css from "./SearchBox.module.css";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
}

function SearchBox({ value, onChange }: SearchBoxProps) {
  return (
    <input
      className={css.input}
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Search notes"
      aria-label="Search notes"
    />
  );
}

export default SearchBox;
