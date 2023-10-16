import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { ProductInterface } from "../Types";

interface CartStore {
  items: ProductInterface[];
  total: number;
  addItem: (item: ProductInterface, quantity: number) => void;
  increaseItem: (id: string) => void;
  decreaseItem: (id: string) => void;
  removeItem: (id: string) => void;
}

export const useCartStore = create<CartStore>(
  persist(
    (set) => ({
      items: [],
      total: 0,
      addItem: async (item: ProductInterface, quantity: number = 1) => {
        try {
          const { data } = await axios.get(
            `${import.meta.env.VITE_APP_BASE_URL}/api/product/specificProduct/${
              item.id
            }`
          );
          const productQuantity = data.quantity;

          set((state: any) => {
            const index = state.items.findIndex(
              (i: ProductInterface) => i.id === item.id
            );

            if (index === -1) {
              if (quantity > productQuantity) {
                quantity = productQuantity;
              }
              return {
                items: [...state.items, { ...item, quantity }],
                total: state.total + item.price * quantity,
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
                total: state.total + item.price * quantity,
              };
            }
          });
        } catch (error) {
          console.error(error);
        }
      },
      increaseItem: async (id: string) => {
        const { data } = await axios.get(
          `${
            import.meta.env.VITE_APP_BASE_URL
          }/api/product/specificProduct/${id}`
        );
        const productQuantity = data.quantity;
        set((state: any) => {
          const item = state.items.find((item: any) => item.id === id)!;

          if (productQuantity > item.quantity) {
            return {
              items: state.items.map((item: any) =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
              ),
              total: state.total + item.price,
            };
          } else {
            alert("you can't add more item in the cart.");
            return state;
          }
        });
      },
      decreaseItem: (id: string) => {
        set((state: any) => {
          const item = state.items.find((item: any) => item.id === id)!;
          const newItems =
            item.quantity === 1
              ? state.items.filter((item: any) => item.id !== id)
              : state.items.map((item: any) =>
                  item.id === id
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
                );
          return {
            items: newItems,
            total: state.total - item.price,
          };
        });
      },
      removeItem: (id: string) => {
        set((state: any) => {
          const item = state.items.find((item: any) => item.id === id)!;
          return {
            items: state.items.filter((item: any) => item.id !== id),
            total: state.total - item.price * item.quantity,
          };
        });
      },
    }),
    { name: "cart-storage" }
  ) as any
);
