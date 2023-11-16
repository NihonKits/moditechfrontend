import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ProductInterface } from "../Types";

interface CartStore {
  items: {
    product: ProductInterface;
    variationIndex: number;
    quantity: number;
  }[];
  total: number;
  addItem: (
    product: ProductInterface,
    variationIndex: number,
    quantity: number
  ) => void;
  increaseItem: (index: number) => void;
  decreaseItem: (index: number) => void;
  removeItem: (index: number) => void;
}

export const useCartStore = create<CartStore>(
  persist(
    (set) => ({
      items: [],
      total: 0,
      addItem: async (
        product: ProductInterface,
        variationIndex: number,
        quantity: number = 1
      ) => {
        try {
          const selectedVariation =
            product.productVariationsList[variationIndex];
          const productQuantity = selectedVariation.quantity;

          set((state: any) => {
            const index = state.items.findIndex(
              (item: any) =>
                item.product.id === product.id &&
                item.variationIndex === variationIndex
            );

            if (index === -1) {
              if (quantity > productQuantity) {
                quantity = productQuantity;
              }
              return {
                items: [...state.items, { product, variationIndex, quantity }],
                total: state.total + selectedVariation.price * quantity,
              };
            } else {
              const newQuantity = state.items[index].quantity + quantity;
              if (newQuantity > productQuantity) {
                quantity = productQuantity - state.items[index].quantity;
              }
              const newItems = [...state.items];
              newItems[index].quantity += quantity;
              return {
                items: newItems,
                total: state.total + selectedVariation.price * quantity,
              };
            }
          });
        } catch (error) {
          console.error(error);
        }
      },
      increaseItem: (index: number) => {
        set((state: any) => {
          const cartItem = state.items[index];
          const productQuantity =
            cartItem.product.productVariationsList[cartItem.variationIndex]
              .quantity;

          if (productQuantity > cartItem.quantity) {
            return {
              items: state.items.map((item: any, i: number) =>
                i === index ? { ...item, quantity: item.quantity + 1 } : item
              ),
              total:
                state.total +
                cartItem.product.productVariationsList[cartItem.variationIndex]
                  .price,
            };
          } else {
            alert("You can't add more items to the cart.");
            return state;
          }
        });
      },
      decreaseItem: (index: number) => {
        set((state: any) => {
          const cartItem = state.items[index];

          if (cartItem.quantity === 1) {
            const newItems = state.items.filter(
              (_: any, i: number) => i !== index
            );
            return {
              items: newItems,
              total:
                state.total -
                cartItem.product.productVariationsList[cartItem.variationIndex]
                  .price,
            };
          } else {
            const newItems = state.items.map((item: any, i: number) =>
              i === index ? { ...item, quantity: item.quantity - 1 } : item
            );
            return {
              items: newItems,
              total:
                state.total -
                cartItem.product.productVariationsList[cartItem.variationIndex]
                  .price,
            };
          }
        });
      },
      removeItem: () => {
        set((state: any) => {
          const cartItem = state.items[0];
          return {
            items: state.items.filter((item: any) => item !== cartItem),
            total:
              state.total -
              cartItem.product.productVariationsList[cartItem.variationIndex]
                .price *
                cartItem.quantity,
          };
        });
      },
    }),
    { name: "cart-storage" }
  ) as any
);
