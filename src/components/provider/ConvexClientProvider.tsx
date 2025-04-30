"use client"
import React from 'react'
import { ClerkProvider, useAuth } from '@clerk/nextjs'
import { ConvexReactClient } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'

const ConvexClientProvider = ({children} : {children: React.ReactNode}) => {
  const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL! as string);

  return (
   <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!} >
      <ConvexProviderWithClerk
        client={convex}
        useAuth={useAuth}
      >
        {children}
      </ConvexProviderWithClerk>
   </ClerkProvider>
  )
}

export default ConvexClientProvider;
