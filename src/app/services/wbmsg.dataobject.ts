import { DataObject, DataObjectFactory } from '@fluidframework/aqueduct';
import { SharedObjectSequence } from '@fluidframework/sequence';
import { IFluidHandle } from '@fluidframework/core-interfaces';
import { IValueChanged } from '@fluidframework/map';
import { ISocketMessage } from '../models/socket-message';

export class WbMsg extends DataObject {
    public static get Name(): string {
        return 'whiteboard-messages';
    }
    private static readonly factory = new DataObjectFactory(
        WbMsg.Name,
        WbMsg,
        [
            SharedObjectSequence.getFactory(),
        ],
        {},
    );
    dataObj: SharedObjectSequence<ISocketMessage> | undefined;

    private readonly key = 'wbmsgKey';

    public static getFactory(): DataObjectFactory<WbMsg, object, undefined, any> {
        return this.factory;
    }

    protected async initializingFirstTime(): Promise<void> {
        const myObj = SharedObjectSequence.create(this.runtime);
        this.root.set(this.key, myObj.handle);
    }

    protected async hasInitialized(): Promise<void> {
        this.dataObj = await this.root.get<IFluidHandle<SharedObjectSequence<ISocketMessage>>>(this.key).get();
        this.root.on('valueChanged', (valueChanged: IValueChanged) => {
            console.log('root value changed', valueChanged);
        });
    }
}
export const WbInstantiationFactory = WbMsg.getFactory();
