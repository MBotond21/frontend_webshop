import { useEffect, useState } from "react"
import { Navi } from "../components/Navi";
import { Kartya } from "../components/Kartya";
import { Product } from "../product";

export default function Products() {

    const [products, setProducts] = useState<Product[]>([]);
    const [filtered, setFiltered] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState(null);
    const [errorServer, setErrorServer] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Product; direction: string } | null>({key: 'dft' as keyof Product, direction: 'asc'});
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetch("http://localhost:3000/products")
            .then((response) => {
                if (response.status === 404) {
                    setErrorServer('A kért erőforrás nem található (404)!');
                    //throw new Error('A kért erőforrás nem található (404)!');
                }
                if (!response.ok) {
                    setErrorServer(`Server responded with status ${response.status}`);
                    //throw new Error(`Server responded with status ${response.status}`);
                }
                return response.json()
            })
            .then((data) => {
                setProducts(data);
                setFiltered(data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error.message)
                setError(error.message);
            })
    }, [])

    if (errorServer) {
        return <p>{errorServer}</p>
    }
    if (loading) {
        return <p>Loading...</p>
    }
    if (error) {
        return <p>Hiba történt: {error}.</p>
    }
    return <>
        <Navi />
        <h1>Termékek</h1>
        <div className="box">
            {
                products.map((product) => (
                    <Kartya product={product} />
                ))
            }
        </div>
    </>
}