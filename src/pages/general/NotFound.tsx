import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="h-screen flex items-center justify-center flex-col gap-4 px-5">
      <h4 className="text-pryClr text-sm lg:text-xl text-center flex items-center font-medium">
        404 | The page you’re trying to visit doesn’t exist or has been moved.
      </h4>
      <button onClick={() => navigate("/")} className="underline text-primary cursor-pointer">
        Go to Login
      </button>
    </div>
  );
};

export default NotFound;
