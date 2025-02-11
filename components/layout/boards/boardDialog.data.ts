export interface IBoardCretionFormItem {
  name: string;
  type?: string;
  placeholder: string;
  icon: string;
}

export const BOARD_CREATION_FORM_DATA: IBoardCretionFormItem[] = [
  {
    name: "name",
    type: "text",
    placeholder: "Board name...",
    icon: "mingcute:board-fill",
  },
  {
    name: "description",
    placeholder: "Board description...",
    icon: "fluent:text-description-20-filled",
  },
];
