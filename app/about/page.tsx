"use client";

import React from "react";
import {
  TrophyIcon,
  LockClosedIcon,
  MagnifyingGlassIcon
} from "@heroicons/react/20/solid";
import { useTranslation } from "react-i18next";

const About = () => {
  const { t, i18n } = useTranslation();

  const features = [
    {
      name: t("howItWorks.step1Title"),
      description: t("howItWorks.step1Subtitle"),
      icon: MagnifyingGlassIcon,
    },
    {
      name: t("howItWorks.step2Title"),
      description: t("howItWorks.step2Subtitle"),
      icon: LockClosedIcon,
    },
    {
      name: t("howItWorks.step3Title"),
      description: t("howItWorks.step3Subtitle"),
      icon: TrophyIcon,
    },
  ];

  return (
    <div className="overflow-hidden bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pt-4 lg:pr-8">
            <div className="lg:max-w-lg">
              <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-white sm:text-5xl">
                {t("howItWorks.title")}
              </p>
              <p className="mt-6 text-lg/8 text-gray-300">
                {t("howItWorks.subtitle")}
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base/7 text-gray-400 lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold text-white">
                      <feature.icon
                        aria-hidden="true"
                        className="absolute top-1 left-1 size-5 text-indigo-400"
                      />
                      {feature.name}
                    </dt>{" "}
                    <dd>{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <img
            alt="Product screenshot"
            src="/mapSS.png"
            width={2432}
            height={1442}
            className="w-3xl max-w-none rounded-xl shadow-xl ring-1 ring-white/10 sm:w-228 md:-ml-4 lg:-ml-0"
          />
        </div>
      </div>
    </div>
  );
};

export default About;
