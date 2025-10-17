import { NativeSelect } from "@mantine/core";
import i18next from "i18next";

/**
 * Select to change language
 */
function LangSwitch() {
  return (
    <>
      <NativeSelect data={Object.keys(i18next.store.data)} value={i18next.language} onChange={(e) => i18next.changeLanguage(e.currentTarget.value)} />
    </>
  );
}

export default LangSwitch;
