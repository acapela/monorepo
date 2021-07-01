export interface AutocompleteNodeProps<D> {
  data: D;
}

export interface AutocompletePickerProps<D> {
  keyword: string;
  onSelect: (item: D) => void;
}
