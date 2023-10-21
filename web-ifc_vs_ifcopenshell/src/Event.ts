export class Event<T> {
  /**
   * Add a callback to this event instance.
   * @param handler - the callback to be added to this event.
   */
  add( handler: T extends void ? { (): void } : { ( data: T ): void } ): void {
    this.handlers.push( handler );
  }

  /**
   * Removes a callback from this event instance.
   * @param handler - the callback to be removed from this event.
   */
  remove( handler: T extends void ? { (): void } : { ( data: T ): void } ): void {
    this.handlers = this.handlers.filter( ( h ) => h !== handler );
  }

  /** Triggers all the callbacks assigned to this event. */
  trigger = async ( data?: T ) => {
    const handlers = this.handlers.slice( 0 );
    for ( const handler of handlers ) {
      await handler( data as any );
    }
  };

  /** Gets rid of all the suscribed events. */
  reset() {
    this.handlers.length = 0;
  }

  private handlers: ( T extends void ? { (): void } : { ( data: T ): void } )[] =
    [];
}