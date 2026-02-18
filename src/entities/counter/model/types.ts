export interface CounterState {
  counter: number;
}

export interface CounterActions {
  increase: () => void;
}

export type CounterStore = CounterState & CounterActions;
