import { NativeSelect } from "@mantine/core";
import i18next from "i18next";


export const SUPPORTED_LANGUAGES = ['cs', 'en'];

/**
 * Select to change language
 */
function LangSwitch() {
  return (
    <>
      <NativeSelect data={SUPPORTED_LANGUAGES} value={i18next.language} onChange={(e) => i18next.changeLanguage(e.currentTarget.value)} />
    </>
  );
}

export default LangSwitch;
