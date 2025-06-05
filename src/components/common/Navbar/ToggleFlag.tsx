import React, { useState } from "react";
import ReactFlagsSelect from "react-flags-select";

const ToggleFlag = () => {
  const [selected, setSelected] = useState("US"); // Set default to "US" for English flag

  return (
    <ReactFlagsSelect
      selected={selected}
      onSelect={(code) => setSelected(code)}
      countries={["US", "FR", "RW"]}
      showSelectedLabel={false} // Hide the selected country label
      showOptionLabel={false}   // Hide the country labels in the dropdown
    />
  );
};

export default ToggleFlag;