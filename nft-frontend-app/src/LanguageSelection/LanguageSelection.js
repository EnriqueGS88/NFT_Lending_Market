import React from "react";
import { FlagButton } from "./LanguageSelection.elements";
import { Planet } from "react-planet";

export default function LanguageSelection({
  changeLanguage,
  currentLanguage,
  possibleLanguages,
  isChoosingLanguage,
  setIsChoosingLanguage,
}) {
  return (
    <>
      <Planet
        centerContent={
          <FlagButton
            value={currentLanguage}
            name="flagButton"
            className={currentLanguage}
            onClick={event => {
              event.preventDefault();
              setIsChoosingLanguage(!isChoosingLanguage);
            }}
          ></FlagButton>
        }
        hideOrbit
        open={isChoosingLanguage}
        orbitRadius={90}
        rotation={90}
        // the bounce direction is minimal visible
        // but on close it seems the button wobbling a bit to the bottom
        bounceDirection="BOTTOM"
      >
        <div />
        <div />
        <FlagButton
          onClick={changeLanguage}
          value={possibleLanguages[0]}
          className={possibleLanguages[0]}
          name="flagButton"
        ></FlagButton>
        <FlagButton
          onClick={changeLanguage}
          value={possibleLanguages[1]}
          className={possibleLanguages[1]}
          name="flagButton"
        ></FlagButton>
      </Planet>
    </>
  );
}
