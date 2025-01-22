import React from "react";
import "./HowItWorks.scss";
import { useTranslation } from "react-i18next";

type Props = {};

const HowItWorks = (props: Props) => {
  const { t } = useTranslation();

  return (
    <div className="howItWorksParent">
      <h1>{t("howItWorks.title")}</h1>
      <ul>
        <li>
          <p>{t("howItWorks.p1")}</p>
        </li>
        <li>
          <p>{t("howItWorks.p2")}</p>
        </li>
        <li>
          <p>{t("howItWorks.p3")}</p>
        </li>
        <li>
          <p>{t("howItWorks.p4")}</p>
        </li>
        <li>
          <p>{t("howItWorks.p5")}</p>
        </li>
      </ul>
    </div>
  );
};

export default HowItWorks;
