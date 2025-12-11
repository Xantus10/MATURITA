import { Anchor } from "@mantine/core";
import { showNotification } from "../../Util/notifications";


/**
 * Display copyable text
 */
function ClickAndCopy({ display, copy }: { display: string, copy: string }) {
  async function copyfunc() {
    await navigator.clipboard.writeText(copy);
    showNotification({title: "Copied!", message: "", icon: 'INFO'})
  }

  return (
    <>
      <Anchor onClick={copyfunc}>{display}</Anchor>
    </>
  );
}

export default ClickAndCopy;