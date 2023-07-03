import ProductForm from "@/components/ProductForm";
import Layout from "@/components/layout";


export default function NewProduct() {
    return(
        <Layout>
            <h1>Nuevo Producto</h1>
            <ProductForm/>
        </Layout>
    );
}