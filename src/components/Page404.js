import { Link } from "react-router-dom";
import image404 from "../images/404_error.png";

export default function Page404() {
  return (
    <>
      <Link to="/" className="page404">
        ← Back
      </Link>
      <img
        src={image404}
        alt="Страница не найдена"
        className="page404__image"
      />
    </>
  );
}
