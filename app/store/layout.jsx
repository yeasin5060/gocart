'use client'
import { useUser, SignIn } from "@clerk/nextjs";
import StoreLayout from "@/components/store/StoreLayout";


export default function RootAdminLayout({ children }) {
   const { isSignedIn, isLoaded } = useUser();
   

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SignIn routing="hash" fallbackRedirectUrl="/store" />
      </div>
    );
  }


    return (<StoreLayout>{children}</StoreLayout>)
}