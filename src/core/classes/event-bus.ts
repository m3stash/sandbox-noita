export class EventBus<DetailType = any> {
    private readonly eventTarget: EventTarget;
    private bufferEvent: Object = {};

    /**
     * @constructor
     * @param {string} prmDescription the name of your EventBus
     */
    constructor(prmDescription = '') {
        this.eventTarget = document.appendChild(document.createComment(prmDescription));
    }

    get _eventTarget(): Comment {
        return this.eventTarget as Comment;
    }

    /**
     * Add EventListener to specific event from the bus
     * @param {string} prmEventName name of your event
     * @param {CustomEvent} prmListener your CustomEvent that will received the emit event.
     */
    on(prmEventName: string, prmListener: (event: CustomEvent<DetailType>) => void) {
        const alreadyEmit = this.testIfEventAlreadyExist(prmEventName);
        if (alreadyEmit) {
            prmListener.call(this, alreadyEmit);
        }
        this.eventTarget.addEventListener(prmEventName,
            prmListener as (prmListener: Event) => void);
    }

    /**
     * Add EventListener once to specific event from the bus
     * @param {string} prmEventName name of your event
     * @param {CustomEvent} prmListener your CustomEvent that will received the emit event.
     */
    once(prmEventName: string, prmListener: (event: CustomEvent<DetailType>) => void) {
        const alreadyEmit = this.testIfEventAlreadyExist(prmEventName);
        if (alreadyEmit) {
            prmListener.call(this, alreadyEmit);
        } else {
            this.eventTarget.addEventListener(prmEventName,
                prmListener as (prmListener: Event) => void,
                { once: true });
        }
    }

    /**
     * Remove EventListener to specific event from the bus
     * @param {string} prmEventName name of your event
     * @param {CustomEvent} prmListener your CustomEvent that will be removed.
     */
    off(prmEventName: string, prmListener: (event: CustomEvent<DetailType>) => void) {
        this.eventTarget.removeEventListener(prmEventName,
            prmListener as (prmListener: Event) => void);
    }

    /**
     * 
     * @param {string} prmEventName name of your event
     * @param {CustomEvent<detail>} prmDetail data for your emitted event. 
     * @returns boolean
     */
    emit(prmEventName: string, prmDetail?: DetailType): boolean {
        const event = new CustomEvent(prmEventName, { detail: prmDetail });
        (this.bufferEvent as any)[prmEventName] = event;
        return this.eventTarget.dispatchEvent(event);
    }

    private testIfEventAlreadyExist(prmEventName: string): CustomEvent<DetailType> | undefined {
        if (Object.prototype.hasOwnProperty.call(this.bufferEvent, prmEventName)) {
            return (this.bufferEvent as any)[prmEventName];
        }
    }
}