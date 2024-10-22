export interface Transaction {
  id: number;
  transactionId?: string;
  date?: string;
  amount?: number;
  status?: string;
  createdDate?: string;
  description?: string;
  originAccount?: string;
  destinationAccount?: string;
  category?: string;
  type?: string;
  currency?: string;
}
