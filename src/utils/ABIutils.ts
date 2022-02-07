import { ABIContract, ABIMethod } from "algosdk";

export const parseInputValue = (val: any, dataType: string) => {
  switch (dataType) {
    case "uint64":
    case "byte":
      return BigInt(val);
    case "bool":
      return Boolean(val);
    default:
      return val;
  }
};

export const parseReturnValue = (val: any, dataType: string) => {
  switch (dataType) {
    case "bool":
      return val.toString();
    case "uint64":
      return BigInt.asUintN(64, BigInt(val)).toString();
    default:
      return val;
  }
};

export const decorateDesc = (desc: string) => {
  return desc.replaceAll(/(_\w+)/g, "<code>$&</code>");
};

// Utility function to return an ABIMethod by its name
export const getMethodByName = (
  name: string,
  contract: ABIContract
): ABIMethod | undefined => {
  const m = contract.methods.find((mt: ABIMethod) => {
    return mt.name == name;
  });
  if (m === undefined) throw Error("Method undefined: " + name);
  return m;
};
