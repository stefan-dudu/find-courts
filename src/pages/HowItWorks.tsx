import React from "react";
import "./HowItWorks.scss";
import { useTranslation } from "react-i18next";

type Props = {};

const HowItWorks = (props: Props) => {
  const { t } = useTranslation();

  return (
    <div className="howItWorksParent">
      <h1>{t("howItWorks.title")}</h1>
      <p>{t("howItWorks.p1")}</p>
      <p>{t("howItWorks.p2")}</p>
      <p>{t("howItWorks.p3")}</p>
      <p>{t("howItWorks.p4")}</p>
      <p>{t("howItWorks.p5")}</p>
    </div>
  );
};

export default HowItWorks;
