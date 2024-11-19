function Header({ heading, text }) {
  return (
    <div className="title flex flex-col items-center">
      <h4 className="text-2xl font-bold">{heading}</h4>
      <span className="py-4  w-2/3 text-center text-gray-500">{text}</span>
    </div>
  );
}

export default Header;
