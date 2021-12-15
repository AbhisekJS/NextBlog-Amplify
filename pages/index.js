import { useState, useEffect } from 'react'
import Link from 'next/link'
import { API, Storage } from 'aws-amplify'
import { listPosts } from '../graphql/queries'

export default function Home() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    const postData = await API.graphql({
      query: listPosts
    })
    const { items } = postData.data.listPosts

    // Fetch images from S3 for posts that contain a cover image
    const postsWithImages = await Promise.all(items.map(async post => {
      if (post.coverImage) {
        post.coverImage = await Storage.get(post.coverImage)
      }
      return post
    }))
    setPosts(postsWithImages)
  }
  
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-wide mt-6 mb-8">Posts</h1>
      <div className=" flex-column sm:flex">
      { posts.map((post, index) => (
        <Link key={index} href={`/posts/${post.id}`}><a>
          <div className="max-w-sm rounded overflow-hidden shadow-lg mr-5 mt-5">
          <img className="w-full" src={post.coverImage} alt={post.title}/>
          <div className="px-6 py-4">
        <div className="font-bold text-l mb-2">{post.title}</div>
        <p className="text-gray-700 text-base">Author: <span className="italic">{post?.username?.toUpperCase()}</span></p>
        <p className="text-gray-700 text-base truncate max-w-md">{post.content}</p>
        </div>
          </div>
        </a></Link>)
        )
      }
      </div>
      
    </div>



    // <div>
    //   <h1 className="text-3xl font-semibold tracking-wide mt-6 mb-8">Posts</h1>
    //   <div className="flex w-50">
    //   {posts.map((post, index) => (
    //     <Link key={index} href={`/posts/${post.id}`}>
    //       <a><div className="my-6 pb-6 	">
    //         {
    //           post.coverImage && <img src={post.coverImage} className="w-56" />
    //         }
    //         <div className="cursor-pointer mt-2 border-2">
    //           <h2 className="text-xl font-semibold">{post.title}</h2>
    //           <p className="text-gray-500 mt-2">Author: {post.username}</p>
    //         </div>
    //       </div>
    //       </a>
    //     </Link>)
    //     )
    //   }
    //   </div>
    // </div>
  )
}