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
import { postSale } from "../../front/requests/sales/postSale";

const App: NextPage<IPageProps> = ({ setPageSubtitle }: IPageProps) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

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
    if (p.storageLiters === 0) {
      return;
    }

    if (p.product.isAlcoholic) {
      return dispatchAlert({
        message: "You must log in to buy alcohol",
        type: "error",
      });
    }

    dispatchConfirmBox({
      title: "Buy product for sale",
      message: `Are you sure you want to buy "${p.product.name || p._id}"?`,
      onConfirm: async (available = false) => {
        if (!available) return;

        try {
          await postSale({
            sale: {
              productForSaleId: p._id,
              customersDocument: "00000000000",
              liters: 1,
            },
          });

          dispatchAlert({
            message: `You bought "${
              p.product.name || p._id
            }", wait a little bit to get it...`,
            type: "success",
          });

          loadProducts();
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
        {products.length === 0 && (
          <p className="up-product-cards__empty">
            There are no products for sale at this moment :(
          </p>
        )}
        {products.map((p) => (
          <div
            onClick={() => handleBuyProductForSale(p)}
            key={p._id}
            className="up-product-card"
          >
            <div
              className={
                "up-product-card__image " +
                (p.storageLiters <= 0 && "up-product-card__image--out-of-stock")
              }
            >
              <Img
                src={p.product.image}
                alt={p.product.name}
                layout="fill"
                priority={true}
              />
              <div className="up-product-card__content">
                <div className="up-product-card__title">{p.product.name}</div>
                {p._promo > 0 && p.storageLiters > 0 && (
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
