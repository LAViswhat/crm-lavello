export interface IRegisterFormItem {
  name: string;
  type: string;
  placeholder: string;
  icon: string;
  description?: string;
}

export const REGISTER_FORM_DATA: IRegisterFormItem[] = [
  {
    name: "email",
    type: "email",
    placeholder: "Email...",
    icon: "mdi:email",
  },
  {
    name: "password",
    type: "password",
    placeholder: "Passward...",
    icon: "solar:lock-password-unlocked-bold",
  },
  {
    name: "username",
    type: "text",
    placeholder: "User name...",
    icon: "octicon:feed-person-16",
    description: " This is your public display name.",
  },
];
