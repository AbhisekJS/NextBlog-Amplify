import { API, Storage } from 'aws-amplify'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import ReactMarkdown from 'react-markdown'
import { listPosts, getPost } from '../../graphql/queries'
import Link from 'next/link'

export default function Post({ post }) {
  const [coverImage, setCoverImage] = useState(null)

  useEffect(() => {
    updateCoverImage()
    //eslint-disable-next-line import/no-extraneous-dependencies
  }, [])

  async function updateCoverImage() {
    if (post.coverImage) {
      const imageKey = await Storage.get(post.coverImage)
      setCoverImage(imageKey)
    }
  }
  console.log('post: ', post)
  const router = useRouter()
  if (router.isFallback) {
    return <div>Loading...</div>
  }
  return (
    <div className="max-w-md flex-column items-center justify-center">
      <h1 className="text-3xl mt-4 font-semibold tracking-wide">{post.title}</h1>
      {
        coverImage && <img src={coverImage} className="mt-4" alt={post.title}/>
      }
      <p className="text-sm font-light my-4">by {post.username}</p>
      <div className="mt-8">
        <ReactMarkdown className='prose'>{post.content}</ReactMarkdown>
      </div>
      <br/>
      <Link href="/"><a className="font-semibold my-4">Back to Home</a></Link>
    </div>
  )
}

export async function getStaticPaths() {
  const postData = await API.graphql({
    query: listPosts
  })
  const paths = postData.data.listPosts.items.map(post => ({ params: { id: post.id }}))
  return {
    paths,
    fallback: true
  }
}

export async function getStaticProps ({ params }) {
  const { id } = params
  const postData = await API.graphql({
    query: getPost, variables: { id }
  })
  return {
    props: {
      post: postData.data.getPost
    }
  }
}