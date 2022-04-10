import ErrorMessage from "../errorMessage/ErrorMessage";
import { Link } from "react-router-dom";
import Helmet from "react-helmet";

const Page404 = () => {
  return (
    <>
      <Helmet>
        <meta
          name="description"
          content={"Error 404"}
        />
        <title>Error 404</title>
      </Helmet>
    <div>
      <ErrorMessage/>
      <p style={{textAlign: "center", fontSize: "32px"}}>Page doesn't exist</p>
      <Link style={{ display: 'block', textAlign: "center", fontSize: "32px", marginTop: '20px', textDecoration: 'underline dotted #9F0013'}} to="/">Back to main page</Link>
    </div>
    </>
  )
}

export default Page404;