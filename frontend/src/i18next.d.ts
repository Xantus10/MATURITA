import "i18next";

import components from "../public/locales/en/components.json"
import homepage from "../public/locales/en/homepage.json"
import loginpage from "../public/locales/en/loginpage.json"
import userpages from "../public/locales/en/userpages.json"

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: 'components';

    resources: {
      components: typeof components;
      homepage: typeof homepage;
      loginpage: typeof loginpage;
      userpages: typeof userpages;
    };
  }
}
