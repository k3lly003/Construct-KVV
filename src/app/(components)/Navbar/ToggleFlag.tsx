import React, { useState } from "react";
import ReactFlagsSelect from "react-flags-select";

const ToggleFlag = () => {
  const [selected, setSelected] = useState("US");

  return (
    <ReactFlagsSelect
      selected={selected}
      onSelect={(code) => setSelected(code)}
      countries={["US", "FR", "RW"]}
      showSelectedLabel={false}
      showOptionLabel={false} 
    />
  );
};

export default ToggleFlag;