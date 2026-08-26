import { Form, Input, type FormItemProps } from "antd";

const { TextArea } = Input;

type InputTextAreaProps = {
    fieldName: FormItemProps["name"];
    label: string;
    rows?: number;
    placeholder?: string;
    rules?: FormItemProps["rules"];
};

function AntInputTextArea({
    fieldName,
    label,
    rows = 4,
    placeholder = `Nhập ${label.toLocaleLowerCase()}`,
    rules = [],
}: InputTextAreaProps) {
    return (
        <Form.Item name={fieldName} label={label} rules={rules}>
            <TextArea
                rows={rows}
                placeholder={placeholder}
            />
        </Form.Item>
    );
}

export default AntInputTextArea;