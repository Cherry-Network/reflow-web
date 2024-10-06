const Dropdown = ({ options, onChange, value, label, name }) => {
  return (
    <div className="flex flex-col">
      <label className="text-gray-500 mb-1 text-sm">{label}</label>
      <select
        name={name} // Ensure name is set
        className="p-2 border border-gray-300 rounded-xl bg-white text-sm focus:border-black focus:outline-none"
        onChange={onChange}
        value={value}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value} className="text-black">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

const SerialNumber = ({ value, onChange, name, label, pattern }) => (
  <div className="flex flex-col">
    <label className="text-gray-500 mb-1 text-base">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="p-2 border border-gray-300 rounded-md bg-white text-sm focus:border-black focus:outline-none"
    />
  </div>
);

const ActivationCode = ({ value, onChange, name, label, pattern }) => (
  <div className="flex flex-col">
    <label className="text-gray-500 mb-1">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="p-2 border border-gray-300 rounded-md bg-white text-sm focus:border-black focus:outline-none"
    />
  </div>
);

const InputField = ({ type, ...props }) => {
  switch (type) {
    case "deviceName":
      return <ActivationCode {...props} />;
    case "activationCode":
      return <ActivationCode {...props} />;
    case "dropdown":
      return <Dropdown {...props} />;
    case "serialNumber":
      return <SerialNumber {...props} />;
    default:
      return null;
  }
};

export { InputField };
