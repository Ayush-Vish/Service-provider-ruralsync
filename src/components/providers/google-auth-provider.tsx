import { GoogleOAuthProvider } from "@react-oauth/google";

export const GoogleOAuthWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ""}>
            {children}
        </GoogleOAuthProvider>
    );
};
