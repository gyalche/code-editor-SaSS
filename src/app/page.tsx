import { SignInButton } from "@clerk/nextjs"

export default function Home() {
  return (
    <div>
      <SignInButton>
        <button>SIGNUP</button>
      </SignInButton>
    </div>
  );
}
