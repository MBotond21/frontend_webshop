import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router";

export default function Account() {
  const { user, validate } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateUser = async () => {
      try {
        await validate();
        if (!user?.userName) {
          navigate("/login");
        }
      } catch (error) {
        console.error("Validation error:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    validateUser();
  }, [user, validate, navigate]);

  if (loading) {
    return (
      <div className="container">
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div className="container">
      {user?.userName ? (
        <>
          <h1>Welcome {user.userName}</h1>
          <h3>Additional</h3>
          <p>Email: {user.email}</p>
        </>
      ) : (
        <h1>Unauthorized</h1>
      )}
    </div>
  );
}