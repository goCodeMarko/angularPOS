export interface ITransaction {
    _id: string;
    products: any[];
    user: object;
    vatableSales: number;
    vatAmount: number;
    discount: number;
    grandTotal: number;
    cash: number;
    changed: number;
    dateCreated: string;
}