import { Input, type InputProps } from "antd";

type AntInputProps = InputProps & {
    isPassword?: boolean;
};

function AntInput({ isPassword, ...props }: AntInputProps) {
    if (isPassword) {
        return <Input.Password {...props} />;
    }
    return <Input {...props} />;
}

export default AntInput;