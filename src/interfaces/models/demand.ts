import IProduct from './product';

export default interface IDemand {
  id?: number;
  name: string;
  products: IProduct[];
}
