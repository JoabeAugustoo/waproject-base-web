import IDemand from 'interfaces/models/demand';
import IProduct from 'interfaces/models/product';
import { IPaginationParams, IPaginationResponse } from 'interfaces/pagination';
import { Observable } from 'rxjs';

import apiService, { ApiService } from './api';

export class DemandService {
  constructor(private apiService: ApiService) {}

  public list(params: IPaginationParams): Observable<IPaginationResponse<IDemand>> {
    return this.apiService.get('/demand', params);
  }

  public findByProducts(demandId: number): Observable<IProduct[]> {
    return this.apiService.get(`/demand/${demandId}/products`);
  }

  public save(model: Partial<IDemand>): Observable<IDemand> {
    return this.apiService.post('/demand', model);
  }

  public saveAllProducts(model: Partial<Array<IProduct>>): Observable<Array<IProduct>> {
    return this.apiService.post('/demand/products', model);
  }
}

const demandService = new DemandService(apiService);
export default demandService;
