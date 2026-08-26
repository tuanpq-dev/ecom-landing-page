import { Form, type FormItemProps, type InputProps } from "antd";
import AntInput from "./AntInput";

export type FormInputProps = Omit<InputProps, "name"> & {
    label: string;
    fieldName: FormItemProps["name"];
    required?: boolean;
    rules?: FormItemProps["rules"];
    isPassword?: boolean;
    dependencies?: FormItemProps["dependencies"];
    hasFeedback?: boolean;
};

function FormInput({
    fieldName,
    label,
    rules = [],
    isPassword,
    dependencies,
    hasFeedback,
    placeholder,
    ...attrs
}: FormInputProps) {
    const defaultPlaceholder = placeholder || `Nhập ${label.toLocaleLowerCase()}`;
    return (
        <Form.Item
            name={fieldName}
            label={label}
            rules={rules}
            dependencies={dependencies}
            hasFeedback={hasFeedback}
        >
            <AntInput placeholder={defaultPlaceholder} isPassword={isPassword} {...attrs} />
        </Form.Item>
    );
}

export default FormInput;