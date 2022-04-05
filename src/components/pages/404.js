import ErrorMessage from "../errorMessage/ErrorMessage";
import { Link } from "react-router-dom"

const Page404 = () => {
  return (
    <div>
      <ErrorMessage/>
      <p style={{textAlign: "center", fontSize: "32px"}}>Page doesn't exist</p>
      <Link style={{ display: 'block', textAlign: "center", fontSize: "32px", marginTop: '20px', textDecoration: 'underline dotted #9F0013'}} to="/">Back to main page</Link>
    </div>
  )
}

export default Page404;