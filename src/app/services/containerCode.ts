import { ContainerRuntimeFactoryWithDefaultDataStore } from '@fluidframework/aqueduct';
import { WbInstantiationFactory } from './wbmsg.dataobject';

export const WbContainerRuntimeFactory = new ContainerRuntimeFactoryWithDefaultDataStore(
    WbInstantiationFactory,
    new Map([
        WbInstantiationFactory.registryEntry,
    ])
);
