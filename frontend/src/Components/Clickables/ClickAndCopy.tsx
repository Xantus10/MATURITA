import { Anchor } from "@mantine/core";

/**
 * Display copyable text
 */
function ClickAndCopy({ display, copy }: { display: string, copy: string }) {

  return (
    <>
      <Anchor onClick={async () => await navigator.clipboard.writeText(copy)}>{display}</Anchor>
    </>
  );
}

export default ClickAndCopy;