import style from "../style/signin.module.css";
function Button({ children, onClick }) {
  return (
    <button onClick={onClick} className={style.btn} type="submit">
      {children}
    </button>
  );
}

export default Button;
