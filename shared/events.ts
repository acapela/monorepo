interface AnyEvent {
  stopPropagation: () => void;
  preventDefault: () => void;
}

export function handleWithStopPropagation<E extends AnyEvent>(handler?: () => void) {
  return function handle(event?: E) {
    event?.stopPropagation?.();
    handler?.();
  };
}

export function handleWithPreventDefault<E extends AnyEvent>(handler?: () => void) {
  return function handle(event?: E) {
    event?.preventDefault?.();
    handler?.();
  };
}
