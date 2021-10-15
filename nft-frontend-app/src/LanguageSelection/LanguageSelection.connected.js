import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import LanguageSelection from "./LanguageSelection";

export default function LanguageSelectionConnected() {
  const [isChoosingLanguage, setIsChoosingLanguage] = useState(false);

  const { i18n } = useTranslation();

  const handleClickOutside = event => {
    if (event.target.name !== "flagButton") {
      setIsChoosingLanguage(false);
    }
  };

  //This useEffect will enable that, every time the user does a click, if the language selector is opened, it will close automatically
  useEffect(() => {
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  });

  //It changes currentLanguage
  function changeLanguage(event) {
    event.preventDefault();
    i18n.changeLanguage(event.target.value);
    setIsChoosingLanguage(false);
  }

  //This function is used to determine which are all the languages available (without taking into account the current one)
  //It is used to mantain the same distribution when displaying possibleLanguages
  function possibleLanguages() {
    const totalLanguages = [ "en", "es", "ca"];
    const indexCurrent = totalLanguages.indexOf(i18n.languages[0]);
    totalLanguages.splice(indexCurrent, 1);
    return totalLanguages;
  }

  return (
    <LanguageSelection
      changeLanguage={changeLanguage}
      currentLanguage={i18n.languages[0]}
      possibleLanguages={possibleLanguages()}
      isChoosingLanguage={isChoosingLanguage}
      setIsChoosingLanguage={setIsChoosingLanguage}
    />
  );
}
