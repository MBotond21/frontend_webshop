import { Navi } from "../components/Navi";

export default function Register() {
    return <>
        <Navi />
        <div className="container mt-5">
        <div className="row justify-content-center">
            <div className="col-md-6">
                <h1 className="text-center mb-4">Regisztráció</h1>
                <form>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email cím</label>
                        <input type="email" className="form-control" id="email" placeholder="Add meg az email címed" required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Felhasználónév</label>
                        <input type="text" className="form-control" id="username" placeholder="Válassz egy felhasználónevet" required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Jelszó</label>
                        <input type="password" className="form-control" id="password" placeholder="Válassz egy jelszót" required />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Regisztráció</button>
                </form>
            </div>
        </div>
    </div>
    </>
}