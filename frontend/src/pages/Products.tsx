import { useCallback, useEffect, useState } from "react";
import { Navi } from "../components/Navi";
import { Kartya } from "../components/Kartya";
import { Product } from "../product";

export default function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [mid, setMid] = useState<Product[]>([]);
    const [filtered, setFiltered] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState(null);
    const [errorServer, setErrorServer] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const elementsPerPage = 10;

    useEffect(() => {
        fetch("http://localhost:3000/products")
            .then((response) => {
                if (response.status === 404) {
                    setErrorServer('A kért erőforrás nem található (404)!');
                }
                if (!response.ok) {
                    setErrorServer(`Server responded with status ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setProducts(data);
                setMid(data);
                setTotalPages(Math.ceil(data.length / elementsPerPage));
                setFiltered(data.slice(0, elementsPerPage));
                setLoading(false);
            })
            .catch((error) => {
                console.error(error.message);
                setError(error.message);
            });
    }, []);

    const handleSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentPage(1);
        const term = event.target.value.toLowerCase();
        setSearchTerm(term);

        const filteredP = products.filter(
            (product) =>
                product.name.toLowerCase().includes(term) ||
                product.description.toLowerCase().includes(term)
        );
        setMid(filteredP);
    }, [products]);

    useEffect(() => {
        setTotalPages(Math.ceil(mid.length / elementsPerPage));
        setFiltered(mid.slice((currentPage - 1) * elementsPerPage, currentPage * elementsPerPage));
    }, [currentPage, mid]);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    if (errorServer) return <p>{errorServer}</p>;
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Hiba történt: {error}.</p>;

    return (
        <>
            <Navi />
            <div className="container">
                <h1>Termékek</h1>
                <form>
                    <label className="form-label">
                        Keresés:
                        <input
                            type="text"
                            className="form-control"
                            value={searchTerm}
                            onChange={handleSearch}
                            placeholder="Név, vagy leírás..."
                        />
                    </label>
                </form>
                <div className="box">
                    {filtered.map((product) => (
                        <Kartya product={product} key={product.id} />
                    ))}
                </div>
                <div>
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="page-change-button small"
                    >
                        Előző
                    </button>
                    <span>
                        Oldal {currentPage} / {totalPages}
                    </span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="page-change-button small"
                    >
                        Következő
                    </button>
                </div>
            </div>
        </>
    );
}