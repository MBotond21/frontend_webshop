import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router";

export default function Account() {
  const { user, validate, update } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [modify, setModify] = useState(false);
  const [userName, setUserName] = useState<string>('');
  const [password, setPsw] = useState<string>('');

  useEffect(() => {
    const validateUser = async () => {
      if (user) {
        setLoading(false);
        return;
      }

      try {
        const isValidUser = await validate();
        if (!isValidUser) {
          console.log(isValidUser);
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

  useEffect(() => {

    setUserName('');
    setPsw('');

  }, [modify]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!userName && !password) {
      alert("No changes were set.");
      return;
    }
  
    const updateUserDto: any = {};
    if (userName) updateUserDto.userName = userName;
    if (password) updateUserDto.password = password;
  
    setModify(!modify);
    
    try {
      if (user) {
        await update(user.id!, updateUserDto.userName, updateUserDto.password);
      } else {
        console.error("User is not logged in.");
      }
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };
  

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
          <h1>Üdv: {user.userName}</h1>
          <h3>Fiók adatok</h3>
          <p>Email: {user.email}</p>
          <p>Felhasználónév: {user.userName}</p>
          {modify ? (
            <>
              <button className="btn btn-primary" onClick={() => setModify(!modify)}>Mégse</button>
              <div className="col-sm-4">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="userName" className="form-label">Felhasználónév</label>
                    <input
                      type="text"
                      className="form-control"
                      onChange={(e) => { setUserName(e.target.value); }}
                      id="userName"
                      placeholder="Add meg az új felhasználó neved"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Jelszó</label>
                    <input
                      type="password"
                      className="form-control"
                      onChange={(e) => { setPsw(e.target.value); }}
                      id="password"
                      placeholder="Add meg az új jelszavad"
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">Mentés</button>
                </form>
              </div>
            </>
          ) : (
            <button className="btn btn-primary" onClick={() => setModify(!modify)}>Módosítás</button>
          )}
        </>
      ) : (
        <h1>Unauthorized</h1>
      )}
    </div>
  );
}
