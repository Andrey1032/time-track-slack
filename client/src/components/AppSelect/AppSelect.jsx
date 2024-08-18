import React from "react";
import Select from "react-select";

export default function AppSelect({ options, currentOption, setCurrentOption, placeholder }) {
  const getValue = () => {
    return currentOption ? options?.find((c) => c.value === currentOption) : "";
  };

  const onChange = (newValue) => {
    setCurrentOption(newValue.value);
  };

  return (
      <Select
          classNamePrefix="custom_select"
          onChange={onChange}
          value={getValue()}
          options={options}
          placeholder={placeholder}
      />
  );
}
