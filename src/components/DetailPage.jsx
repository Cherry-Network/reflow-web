import FormContainer from "./forms/FormContainer";

const formConfig = [
  {
    type: "serialNumber",
    name: "serialNumber",
    label: "Serial Number", // Label for Serial Number
    props: {},
  },
  {
    type: "activationCode",
    name: "activationCode",
    label: "Activation Code", // Label for Activation Code
    props: {},
  },
  {
    type: "dropdown",
    name: "dropdownValue",
    label: "Product Series", // Label for Dropdown
    props: {
      options: [
        { label: "Option 1", value: "1" },
        { label: "Option 2", value: "2" },
      ],
    },
  },
];

export default function DetailPage() {
  return (
    <>
      <p className="text-black">Navbar SideBar</p>
      <div className="p-8">
        <div className="max-w-lg mx-auto">
          <h1 className="text-black text-3xl font-bold mb-8 text-left">
            Fill the details
          </h1>
          <FormContainer config={formConfig} />
        </div>
      </div>
    </>
  );
}
