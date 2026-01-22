import { Anchor } from "@mantine/core";
import { showNotification } from "../../Util/notifications";

import { useTranslation } from "react-i18next";


/**
 * Display copyable text
 */
function ClickAndCopy({ display, copy }: { display: string, copy: string }) {
  const { t } = useTranslation();

  async function copyfunc() {
    await navigator.clipboard.writeText(copy);
    showNotification({title: t('copied'), message: "", icon: 'INFO'})
  }

  return (
    <>
      <Anchor onClick={copyfunc}>{display}</Anchor>
    </>
  );
}

export default ClickAndCopy;