import styled from "styled-components";

export const FlagButton = styled.button`
  cursor: pointer;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  border: 2px solid #4a547d;

  &.ca {
    background: url(/images/flags/ca.png);
    background-position: center;
    background-size: cover;
  }

  &.es {
    background: url(/images/flags/es.png);
    background-position: center;
    background-size: cover;
  }

  &.en {
    background: url(/images/flags/en.png);
    background-position: center;
    background-size: cover;
  }
`;
