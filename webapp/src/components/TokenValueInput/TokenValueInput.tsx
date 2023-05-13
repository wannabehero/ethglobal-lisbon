import { Input, Button, Space } from 'antd';
import { useState } from 'react';

interface ContractValueInputProps {
  symbol: string;
  action: string;

  onAction: (value: string) => void;
}

const TokenValueInput = ({ symbol, action, onAction }: ContractValueInputProps) => {
  const [value, setValue] = useState<string>('');

  return (
    <Space>
      <Input
        placeholder={'100'}
        onChange={(e) => setValue(e.target.value)}
        value={value}
        suffix={symbol} />
      <Button
        type="primary"
        onClick={() => {
          onAction(value);
          setValue('');
        }}
      >
        {action}
      </Button>
    </Space>
  );
};

export default TokenValueInput;
