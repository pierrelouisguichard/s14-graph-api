import React from "react";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
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
        <h1> Please Sign In </h1>
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
