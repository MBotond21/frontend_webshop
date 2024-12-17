import { useContext, useState } from "react"
import { AuthContext } from "../contexts/AuthContext"

export default function Login() {
    const { login } = useContext(AuthContext);

    const [email, setEmail] = useState<string>('');
    const [password, setPsw] = useState<string>('');

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        await login(email, password);
    }

    return <>
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h1 className="text-center mb-4">Bejelentkezés</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email cím</label>
                            <input type="email" className="form-control" onChange={(e) => { setEmail(e.target.value) }} id="email" placeholder="Add meg az email címed" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Jelszó</label>
                            <input type="password" className="form-control" onChange={(e) => { setPsw(e.target.value) }} id="password" placeholder="Add meg a jelszavad" required />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Bejelentkezés</button>
                    </form>
                </div>
            </div>
        </div>
    </>
}