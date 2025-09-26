import { useState } from "react"
import '../index.css'

const Blog = ({ blog }) => {
  const [moreDetails, setMoreDetails] = useState(false)

  return (
    <div className="blog">
      {blog.title} | {blog.author}{' '}
      <button onClick={() => setMoreDetails(!moreDetails)}>
        {moreDetails ? 'hide' : 'view'}
      </button>

      {moreDetails && (
        <div>
          <p>Url: {blog.url}</p>
          <p>Likes: {blog.likes}</p>
          <p>Added by user: {blog.user.name}</p>
        </div>
      )}
    </div>
  ) 
}

export default Blog