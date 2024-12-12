import React from "react";
import styled from "styled-components";
import { useIsAuthenticated } from "@azure/msal-react";
import { SignInButton, SignOutButton } from "./SignInOutButtons";

export const PageLayout = (props) => {
  const isAuthenticated = useIsAuthenticated();

  return (
    <>
      <StyledNavbar>
        <NavbarContent>
          {isAuthenticated ? <SignOutButton /> : <SignInButton />}
        </NavbarContent>
      </StyledNavbar>
      {props.children}
    </>
  );
};

const StyledNavbar = styled.nav`
  background-color: #074352;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
`;

const NavbarContent = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;
