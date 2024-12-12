import React from "react";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import styled from "styled-components";
import { PageLayout } from "./components/PageLayout";
import MainTable from "./components/MainTable";

/**
 * If a user is authenticated, the ProfileContent component above is rendered. Otherwise, a message indicating a user is not authenticated is rendered.
 */
const MainContent = () => {
  return (
    <div>
      <AuthenticatedTemplate>
        <MainTable />
      </AuthenticatedTemplate>

      <UnauthenticatedTemplate>
        <CardTitle>Please sign-in to see your profile information.</CardTitle>
      </UnauthenticatedTemplate>
    </div>
  );
};

export default function App() {
  return (
    <PageLayout>
      <MainContent />
    </PageLayout>
  );
}

/**
 * Styled Components for better design
 */
const CardTitle = styled.h5`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 20px;
`;
