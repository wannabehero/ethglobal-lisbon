import { Input, Button, Space } from 'antd';
import { useState } from 'react';

interface ContractValueInputProps {
  symbol: string;
  action: string;
  loading: boolean;

  onAction: (value: string) => void;
}

const TokenValueInput = ({ symbol, action, onAction, loading }: ContractValueInputProps) => {
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
        loading={loading}
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
