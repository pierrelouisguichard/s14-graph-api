import React from "react";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import { PageLayout } from "./components/PageLayout";
import MainTable from "./components/MainTable";
import styled from "styled-components";

/**
 * If a user is authenticated, the ProfileContent component above is rendered. Otherwise, a message indicating a user is not authenticated is rendered.
 */
const MainContent = () => {
  return (
    <CenteredContainer>
      <AuthenticatedTemplate>
        <MainTable />
      </AuthenticatedTemplate>

      <UnauthenticatedTemplate>
        <h1> Please Sign In </h1>
      </UnauthenticatedTemplate>
    </CenteredContainer>
  );
};

export default function App() {
  return (
    <PageLayout>
      <MainContent />
    </PageLayout>
  );
}

const CenteredContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-right: 50px;
  flex-direction: column; /* Center vertically */
  text-align: center; /* Ensure the text is centered */
  font-size: 15px;
`;
