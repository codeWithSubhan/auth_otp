import { Link } from "react-router-dom";

function Footer({ text, subText, to }) {
  return (
    <div className="text-center py-4">
      <span className="text-gray-500">
        {text}?{" "}
        <Link className="text-red-500 underline" to={to}>
          {subText}
        </Link>
      </span>
    </div>
  );
}

export default Footer;
