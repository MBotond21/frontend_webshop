import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../contexts/AuthContext"

export default function Account(){
    const { user, validate } = useContext(AuthContext);

    const [ lin, setLin ] = useState<boolean>(false);

    useEffect(() => {
        const validateUser = async () => {
          await validate();
          setLin(!!user?.userName);
        };
        validateUser();
      }, [user?.userName, validate]);

    return <>
        <div className="container">
            {
                lin? (
                    <>
                        <h1>Welcome {user?.userName}</h1>
                        <h3>Additional</h3>
                        <p>Email: {user?.email}</p>
                    </>
                ): (
                    <h1>Unautharized</h1>
                )
            }
        </div>
    </>
}