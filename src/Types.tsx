export interface LoginInterface {
  email: string;
  password: string;
}

export interface RegistrationInterface {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  addressLine1: string;
  city: string;
  country: string;
  postalCode: string;
  contactNumber: string;
}

export interface UserInterface {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userRole: string;
  imageUrl: string;
  addressLine1: string;
  city: string;
  country: string;
  postalCode: string;
  contactNumber: string;
}

export interface ProductInterface {
  id: string;
  barcode: string;
  productName: string;
  productImage: string;
  description: string;
  isAd: string;
  productVariationsList: [
    {
      variationName: string;
      price: number;
      imgUrl: string;
      quantity: number;
      description: string;
      sold: number;
    }
  ];
  totalSold: number;
}

export interface OrderProductInterface {
  product: {
    id: string;
    barcode: string;
    productName: string;
    productImage: string;
    description: string;
    isAd: string;
    productVariationsList: [
      {
        variationName: string;
        price: number;
        imgUrl: string;
        quantity: number;
        description: string;
        sold: number;
      }
    ];
  };
  variationIndex: number;
  quantity: number;
}

export interface ProductVarianceInteface {
  variationName: string;
  price: number;
  imgUrl: string;
  quantity: number;
  description: string;
  sold: number;
}

export interface OrderInterface {
  id: string;
  email: string;
  totalPrice: string;
  orderList: string;
  status: string;
  paymentMethod: string;
  receipt: string;
  contactNumber: string;
  address: string;
  orderDate: string;
}

export interface SingleOrderItemInterface {
  id: string;
  productName: string;
  productImage: string;
  description: string;
  price: number;
  quantity: number;
  // sold: number;
}

export interface ITopFiveCustomerInterface {
  email: string;
  orderCount: number;
}

export interface ConversationInterface {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  messages: IMessage[];
}

export interface IMessage {
  id: string;
  name: string;
  message: string;
  isUser: boolean;
  createdAt: Date;
  isUserReadTheMessage: boolean;
  isAdminReadTheMessage: boolean;
}

export interface IAppointment {
  id: string;
  appointmentDate: string;
  appointmentTime: string;
  service: string;
  email: string;
  contactNumber: string;
  createdAt: string;
  status: string;
  // userMarkAsRead: boolean;
  // userNotification: boolean;
}

// reusable transition effect only
import React from "react";
import { TransitionProps } from "@mui/material/transitions";
import { Slide } from "@mui/material";

export const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const maxNumber = 1;
