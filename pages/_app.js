import '../styles/globals.css'
import '../configureAmplify'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Auth, Hub } from 'aws-amplify'

function MyApp({ Component, pageProps }) {
  const [signedInUser, setSignedInUser] = useState(false)

  useEffect(()=>{
    authListener()
  })
  async function authListener(){
    Hub.listen('auth',(data)=>{
      switch(data.payload.event){
        case 'signIn':
          return setSignedInUser(true)
        case 'signout':
          return setSignedInUser(false)
      }
    })
    try {
      await Auth.currentAuthenticatedUser()
      setSignedInUser(true)
    } catch (err) {}

  }

  return (
  <div>
  <nav className="p-6 border-b border-gray-300 text-white bg-blue-700">
    <Link href="/">
      <a><span className="mr-6 cursor-pointer">Home</span></a>
    </Link>
    <Link href="/create-post">
      <a><span className="mr-6 cursor-pointer">Create Post</span></a>
    </Link>
    <Link href="/profile">
      <a><span className="mr-6 cursor-pointer">Profile</span></a>
    </Link>
    {
    signedInUser && (
    <Link href="/my-posts">
    <a><span className="mr-6 cursor-pointer">My Posts</span></a>
    </Link>
    )
    }
    
  </nav>
  <div className="py-8 px-16">
    <Component {...pageProps} />
  </div>
  
</div>
)
}

export default MyApp