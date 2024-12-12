import React from "react";
import styled from "styled-components";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";

/**
 * Renders a sign-in button using redirect
 */
export const SignInButton = () => {
  const { instance } = useMsal();

  const handleRedirectLogin = () => {
    instance.loginRedirect(loginRequest).catch((e) => {
      console.error(e);
    });
  };

  return <ButtonStyled onClick={handleRedirectLogin}>Sign In</ButtonStyled>;
};

/**
 * Renders a sign-out button using redirect
 */
export const SignOutButton = () => {
  const { instance } = useMsal();

  const handleRedirectLogout = () => {
    instance
      .logoutRedirect({
        postLogoutRedirectUri: "/",
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return <ButtonStyled onClick={handleRedirectLogout}>Sign Out</ButtonStyled>;
};

const ButtonStyled = styled.button`
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 1rem;
  margin-left: 0.5rem;

  &:hover {
    background-color: #5a6268;
  }
`;
