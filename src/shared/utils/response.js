export function response(res) {
  if (!res) return null;

  let output = res.data;

  while (
    typeof output === "object" &&
    output !== null &&
    "data" in output &&
    Object.keys(output).length === 1
  ) {
    output = output.data;
  }

  return output;
}