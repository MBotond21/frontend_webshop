import { Navi } from "../components/Navi";

export default function Login() {
    console.log("on login site")
    return <>
        <Navi />
        <div className="container mt-5">
        <div className="row justify-content-center">
            <div className="col-md-6">
                <h1 className="text-center mb-4">Bejelentkezés</h1>
                <form>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email cím</label>
                        <input type="email" className="form-control" id="email" placeholder="Add meg az email címed" required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Jelszó</label>
                        <input type="password" className="form-control" id="password" placeholder="Add meg a jelszavad" required />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Bejelentkezés</button>
                </form>
            </div>
        </div>
    </div>
    </>
}