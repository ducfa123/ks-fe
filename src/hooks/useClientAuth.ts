import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "./index";
import { useNavigate, useLocation } from "react-router-dom";
import { RouterLink } from "../routers/routers";
import { APIServices } from "../utils";
import { updateClientInfo } from "../redux/auth-client/auth-client.slice";
import { RootState } from "../redux/store";

export const useClientAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const token = useAppSelector((state: RootState) => state.authClient.token);
  const redirectAttempted = useRef(false);
  
  // Add a state to track if we're on a survey page
  const isSurveyPage = location.pathname.includes('/khao-sat/');

  useEffect(() => {
    // CRITICAL FIX: Reset the redirect attempt ref when the location changes
    // This prevents the component from getting stuck in a state where it can't redirect
    if (location.pathname !== RouterLink.CLIENT_LOGIN && !isSurveyPage) {
      redirectAttempted.current = false;
    }

    // If we're on a survey page, never redirect
    if (isSurveyPage) {
      console.log("On survey page, skipping authentication redirect");
      return;
    }
    
    // For other pages, handle normal auth flow
    if (token) {
      const fetchUserInfo = async () => {
        try {
          const response = await APIServices.Auth.getPermission();
          if (response.data) {
            dispatch(updateClientInfo(response.data));
          } else if (!redirectAttempted.current && location.pathname !== RouterLink.CLIENT_LOGIN) {
            redirectAttempted.current = true;
            navigate(RouterLink.CLIENT_LOGIN);
          }
        } catch (error) {
          console.error("Error fetching user info:", error);
          if (!redirectAttempted.current && location.pathname !== RouterLink.CLIENT_LOGIN) {
            redirectAttempted.current = true;
            navigate(RouterLink.CLIENT_LOGIN);
          }
        }
      };

      fetchUserInfo();
    } else if (
      location.pathname !== RouterLink.CLIENT_LOGIN && 
      !redirectAttempted.current && 
      !isSurveyPage
    ) {
      redirectAttempted.current = true;
      navigate(RouterLink.CLIENT_LOGIN);
    }
  }, [dispatch, navigate, token, location.pathname, isSurveyPage]);
};
