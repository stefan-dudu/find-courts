import "react-i18next";
import roTranslation from "./translations/ro.json";

// Define the type structure of your translations
declare module "react-i18next" {
  interface CustomTypeOptions {
    // Define the resource type using the structure of your translations
    resources: typeof roTranslation;
  }
}
