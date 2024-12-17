import { useContext, useEffect } from "react";
import { Kartya } from "../components/Kartya";
import { CartContext } from "../contexts/CartContext";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router";

export default function Cart() {
    const { cart, removeProduct } = useContext(CartContext);

    const { user } = useContext(AuthContext);
    const loggedin = !!user?.userName;

    const navigate = useNavigate();
  
    useEffect(() => {
      if(!loggedin){
        navigate('/login');
      }
    }, [user, navigate]);

    return <>
        <div className="container">
            <h1>Kosár</h1>
            {cart.map((product) => (
                loggedin? (
                    <Kartya product={product} key={product.id} btn={<button className='del' onClick={() => { removeProduct(product.id) }}>Törlés</button>} />
                ):(
                    <Kartya product={product} key={product.id} />
                )
            ))}
        </div>
    </>
}