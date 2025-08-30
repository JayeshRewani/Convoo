import React from "react";
import { Routes, Route, Navigate } from "react-router";

import { HomePage, SignUpPage, LoginPage, OnBoardingPage, NotificationPage, CallPage, ChatPage } from "./constants/importPage.js";
import { Toaster } from "react-hot-toast";
import PageLoader from "./components/PageLoader.jsx";
import useAuthUser from "./hooks/useAuthUser.js";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Layout from "./components/Layout.jsx";
import useThemeStore from "./store/useThemeStore.js";
import ResetPassword from "./pages/ResetPassword.jsx";

function App() {

  const {isLoading,authUser} = useAuthUser();
  const { theme } = useThemeStore()

  const isOnBoarded = authUser?.isOnBoarded;
  const isAuthenticated = Boolean(authUser)

  if (isLoading) {
    return (
      <PageLoader />
    )
  }

  return (
    <div data-theme={theme}>
      
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated && isOnBoarded ? (
              <Layout showSidebar>
                <HomePage />
              </Layout>
            ) : (
              <Navigate to={isAuthenticated ? "/onboarding" : "/login"} />
            )
          }
        />
        <Route
          path="/signup"
          element={!isAuthenticated ? <SignUpPage /> : <Navigate to={isOnBoarded ? "/" : "/onboarding"} />}
        />
        <Route
          path="/login"
          element={!isAuthenticated ? <LoginPage /> : <Navigate to={isOnBoarded ? "/" : "/onboarding"} />}
        />
        <Route 
          path="/forgot-password"
          element={!isAuthenticated ? <ForgotPassword /> : <Navigate to={isOnBoarded ? "/" : "/onboarding"} />}
          />

        <Route 
          path="/reset-password/:token"
          element={!isAuthenticated ? <ResetPassword /> : <Navigate to={isOnBoarded ? "/" : "/onboarding"} />}
          />

         <Route
          path="/onboarding"
          element={
            isAuthenticated ? (
              !isOnBoarded ? (
                <OnBoardingPage />
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/notifications"
          element={
            isAuthenticated && isOnBoarded ? (
              <Layout showSidebar>
                <NotificationPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/call/:id"
          element={
            isAuthenticated && isOnBoarded ? (
              <CallPage />
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/chat/:id"
          element={isAuthenticated ? <Layout><ChatPage /></Layout> : <Navigate to="/login" />}
        />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
