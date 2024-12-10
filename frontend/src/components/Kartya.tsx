import 'bootstrap/dist/css/bootstrap.min.css';
import { ReactElement } from 'react';
import { Product } from '../product';

interface Props {
    product: Product;
    btn?: ReactElement
}

export function Kartya(props: Props) {
    const product = props.product

    return (
        <div className="card m-3" style={{ width: '18rem' }} key={product.id}>
            <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">Ár: {Intl.NumberFormat('fr-FR').format(product.price)} Ft</h6>
                <p className="card-text">
                    <strong>Elérhető: </strong> {product.quantity} <br />
                    {product.description}
                    {
                        props.btn? <><br />{props.btn}</>: <span></span>
                    }
                </p>
            </div>
        </div>
    );
};