import style from "../style/signin.module.css";
function Button({ children }) {
  return (
    <button className={style.btn} type="submit">
      {children}
    </button>
  );
}

export default Button;
