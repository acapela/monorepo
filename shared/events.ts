interface AnyEvent {
  stopPropagation: () => void;
}

export function handleWithStopPropagation<E extends AnyEvent>(handler?: () => void) {
  return function handle(event?: E) {
    event?.stopPropagation?.();
    handler?.();
  };
}
