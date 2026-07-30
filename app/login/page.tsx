import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  const oauthEnabled = {
    google: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    facebook: Boolean(process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET),
    linkedin: Boolean(process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET),
  };

  return <LoginForm oauthEnabled={oauthEnabled} />;
}
