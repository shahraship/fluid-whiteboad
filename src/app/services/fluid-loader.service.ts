import { Injectable } from '@angular/core';
import { getTinyliciousContainer } from '@fluidframework/get-tinylicious-container';
import { getDefaultObjectFromContainer } from '@fluidframework/aqueduct';

@Injectable({
  providedIn: 'root'
})
export class FluidLoaderService {

  documentId: string;
  createNew = false;

  constructor() {
    if (window.location.hash.length === 0) {
      this.createNew = true;
      window.location.hash = Date.now().toString();
    }
    this.documentId = window.location.hash.substring(1);
  }

  async loadDataObject<T>(factory: any): Promise<T> {
    const container = await getTinyliciousContainer(this.documentId, factory, this.createNew);
    return await getDefaultObjectFromContainer<T>(container);
  }

}
