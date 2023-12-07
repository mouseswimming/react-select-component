import { useState } from "react";
import Select, { SelectOption } from "./components/Select";

const options = [
  { label: "First", value: 1 },
  { label: "Second", value: 2 },
  { label: "Third", value: 3 },
  { label: "Fourth", value: 4 },
  { label: "Fifth", value: 5 },
];

function App() {
  const [singleValue, setSingleValue] = useState<SelectOption | undefined>(
    options[0]
  );
  const [multiValue, setMultiValue] = useState<SelectOption[]>([]);
  return (
    <>
      <h1>React select component</h1>
      <h2>Single select</h2>
      <Select
        options={options}
        value={singleValue}
        onChange={(o) => setSingleValue(o)}
      />
      <h2>Multi select</h2>
      <Select
        multiple
        options={options}
        value={multiValue}
        onChange={(o) => setMultiValue(o)}
      />
    </>
  );
}

export default App;
