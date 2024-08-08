export interface Transaction {
  amount: number;
  currency: string;
  userId: string;
  paymentAccountId: string;
  toAddress: string;
  status: "pending" | "success" | "failed";
}
