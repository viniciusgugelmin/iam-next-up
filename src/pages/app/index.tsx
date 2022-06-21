import { NextPage } from "next";
import { useEffect, useState } from "react";
import IPageProps from "../../interfaces/IPageProps";
import { AppPage } from "../../front/components/Template/App/AppPage";
import { getProductsForSale } from "../../front/requests/productsForSale/getProductsForSale";
import { dispatchAlert } from "../../front/services/dispatchAlert";
import { IError } from "../../interfaces/IError";
import { PageLoading } from "../../front/components/Base/PageLoading";
import Img from "next/image";
import { dispatchConfirmBox } from "../../front/services/dispatchConfirmBox";

const App: NextPage<IPageProps> = ({ setPageSubtitle }: IPageProps) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [product, setProduct] = useState<any>(null);
  const [liters, setLiters] = useState(0);

  useEffect(() => {
    setPageSubtitle("App");

    loadProducts();
  }, []);

  function loadProducts() {
    setLoading(true);

    getProductsForSale({})
      .then((data) => {
        setProducts(data.productsForSale);
      })
      .catch((error) => {
        if (!error.response?.data) {
          dispatchAlert({
            message: "Server error",
            type: "error",
          });
        } else {
          dispatchAlert({
            message: (error as IError).response.data.message,
            type: "error",
          });
        }
      })
      .finally(() => setLoading(false));
  }

  function formatReal(value: number): string {
    return Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }

  function formatPromo(value: number): string {
    return (
      Intl.NumberFormat("pt-BR", {
        style: "decimal",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(value) + "%"
    );
  }

  function handleBuyProductForSale(p: any) {
    setProduct(p);
    setLiters(1);

    dispatchConfirmBox({
      title: "Buy product for sale",
      message: `Are you sure you want to buy "${p.product.name || p._id}"?`,
      onConfirm: async (available = false) => {
        if (!available) return;

        try {
          console.log("buy product for sale");
        } catch (error) {
          dispatchAlert({
            message: (error as IError).response.data.message,
            type: "error",
          });
        }
      },
    });
  }

  if (loading) {
    return <PageLoading />;
  }

  return (
    <AppPage>
      <section className="up-product-cards">
        {products.map((p) => (
          <div
            onClick={() => handleBuyProductForSale(p)}
            key={p._id}
            className="up-product-card"
          >
            <div className="up-product-card__image">
              <Img
                src={p.product.image}
                alt={p.product.name}
                layout="fill"
                priority={true}
              />
              <div className="up-product-card__content">
                <div className="up-product-card__title">{p.product.name}</div>
                {p._promo > 0 && (
                  <div className="up-product-card__promo">
                    {formatReal(p.pricePerLiter * (1 - p._promo / 100))}
                  </div>
                )}
                <div
                  className={
                    "up-product-card__price " +
                    (p._promo && "up-product-card__price--promo")
                  }
                >
                  {formatReal(p.pricePerLiter)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
    </AppPage>
  );
};

export default App;
