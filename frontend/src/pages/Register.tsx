import { useState } from "react";
import { useNavigate } from "react-router";

export default function Register() {
    const [email, setEmail] = useState<string>('');
    const [userName, setUsername] = useState<string>('');
    const [password, setPsw] = useState<string>('');
    const navigate = useNavigate();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const newUser = {
            email: email,
            userName: userName,
            password: password
        };
        try {
            const response = await fetch(`http://localhost:3000/users/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser),
                //credentials: 'include',
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Registration failed');
            }
            const data = await response.json();
            console.log('User registered successfully:', data);
        } catch (error: any) {
            alert(error.message);
        }
        navigate('../login');
    };
    

    return <>
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h1 className="text-center mb-4">Regisztráció</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email cím</label>
                            <input type="email" onChange={(e) => { setEmail(e.target.value) }} className="form-control" id="email" placeholder="Add meg az email címed" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Felhasználónév</label>
                            <input type="text" onChange={(e) => { setUsername(e.target.value) }} className="form-control" id="username" placeholder="Válassz egy felhasználónevet" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Jelszó</label>
                            <input type="password" onChange={(e) => { setPsw(e.target.value) }} className="form-control" id="password" placeholder="Válassz egy jelszót" required />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Regisztráció</button>
                    </form>
                </div>
            </div>
        </div>
    </>
}