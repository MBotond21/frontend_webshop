import { useCallback, useContext, useEffect, useState } from "react";
import { Kartya } from "../components/Kartya";
import { Product } from "../product";
import { CartContext } from "../contexts/CartContext";

export default function Products() {
    const [cart, addNewProduct] = useContext(CartContext)
    const [products, setProducts] = useState<Product[]>([]);
    const [mid, setMid] = useState<Product[]>([]);
    const [filtered, setFiltered] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState(null);
    const [errorServer, setErrorServer] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Product; direction: string } | null>({key: 'dft' as keyof Product, direction: 'asc'});
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

    const handelDirectionChanged = useCallback((direction: string) => {
        const key = sortConfig?.key || ('dft' as keyof Product);
        setSortConfig({ key, direction });
    }, [sortConfig]);
    
    const handelOrderChanged = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const key = e.target.value as keyof Product;
        const direction = sortConfig?.direction || 'asc';
        setSortConfig({ key, direction });
    }, [sortConfig]); 

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
        setTotalPages(Math.ceil(filteredP.length / elementsPerPage));
    }, [products]);

    useEffect(() => {
        const startIndex = (currentPage - 1) * elementsPerPage;
        const endIndex = currentPage * elementsPerPage;
        let updatedProducts = mid;
    
        if (sortConfig && sortConfig.key !== ('dft' as keyof Product)) {
            updatedProducts = [...updatedProducts].sort((a, b) => {
                const { key, direction } = sortConfig;
                if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
                if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        updatedProducts = updatedProducts.slice(startIndex, endIndex);
    
        setFiltered(updatedProducts);
    }, [currentPage, mid, sortConfig, elementsPerPage]);
    

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

                <div className='box right'>
                    <button className='btn' onClick={() => handelDirectionChanged('asc')}>&#8593;</button>
                    <button className='btn' onClick={() => handelDirectionChanged('desc')}>&#8595;</button>
                    <select name="sort" onChange={(e) => handelOrderChanged(e)}>
                        <option value="dft">Alapértelmezett</option>
                        <option value="price">Ár</option>
                        <option value="name">Név</option>
                        <option value="quantity">Darabszám</option>
                    </select>
                </div>

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